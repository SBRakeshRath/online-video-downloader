import ytdl from "ytdl-core";
import os from "os";
import fs from "fs";
import mergeAudioVideo from "./mergeAudioVideo.js";
import updateStatus from "../statusDb/updateStatus.js";
import uploadMergedVideos from "../../storage/uploadMergedVideo.js";

//create a unique file name for the video which is not present in the temp folder
function createUniqueFileName(extension: string) {
  const tempDir = os.tmpdir() + "/";
  const fileName =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const filePath = tempDir + fileName + Date.now() + "." + extension;

  // create file if not present
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
    return filePath;
  }

  createUniqueFileName(extension);
}

export default async function DownloadVideo(
  link: string,
  quality: string,
  id: string
) {
  const tempDir = os.tmpdir() + "/";

  try {
    // return false;
    const info = await ytdl.getInfo(link);
    const formats = info.formats;

    // check if the quality is present in the formats

    if (!formats.find((format) => format.qualityLabel === quality))
      return false;

    const videoFormat = info.formats.find(
      (format) => format.qualityLabel === quality
    );

    const audioFormat = info.formats
      .filter((format) => format.hasAudio && !format.hasVideo)
      .find((format) => format.container === videoFormat.container);
    if (!audioFormat) return false;

    let videoFileExtension = formats.find(
      (format) => format.qualityLabel === quality
    )?.container;

    if (!videoFileExtension) {
      videoFileExtension = "mp4";
    }

    const videoFilePath = createUniqueFileName(videoFileExtension);

    const videoWritableStream = fs.createWriteStream(videoFilePath);

    //update status to downloading
    await updateStatus("downloading-video", id, 0);

    await new Promise<void>((resolve, reject) => {
      // console.log("downloading video");
      let percent = 0;
      // wait
      ytdl(link, { filter: (format) => format.qualityLabel === quality })
        .on("progress", async (chunkLength, downloaded, total) => {
          const currentPercent = (downloaded / total) * 100;
          if (currentPercent - percent> 5) {
            percent = currentPercent;
            // console.log(percent);
            await updateStatus("downloading-video", id, percent);
          }
        })
        .pipe(videoWritableStream)
        .on("close", () => {
          resolve(); // finish
        })
        .on("error", async (err) => {
          await updateStatus("failed", id, 0);

          return reject(new Error("Can't download video"));
        });
    });

    const audioFileExtension = audioFormat.mimeType
      .split(" ")[0]
      .split("/")[1]
      .split(";")[0];
    // console.log(audioFileExtension);

    const audioFilePath = createUniqueFileName(audioFileExtension);
    const audioWritableStream = fs.createWriteStream(audioFilePath);

    await updateStatus("downloading-audio", id, 0);

    await new Promise<void>((resolve, reject) => {
      // console.log("downloading audio");
      // wait
      let percent = 0;
      ytdl(link, {
        filter: (format) => format.audioCodec === audioFormat.audioCodec,
      })
        .on("progress", async (chunkLength, downloaded, total) => {
          const currentPercent = (downloaded / total) * 100;
          if (currentPercent - percent > 5) {
            percent = currentPercent;
            // console.log(percent);
            await updateStatus("downloading-audio", id, percent);
          }
        })
        .pipe(audioWritableStream)
        .on("close", () => {
          resolve(); // finish
        })
        .on("error", async (err) => {
          await updateStatus("failed", id, 0);

          return reject(new Error("Can't download audio"));
        });
    });

    //convert audio into mp3

    const outputPath = createUniqueFileName(videoFileExtension);
    await updateStatus("merging", id, 0);
    //calculate time
    const startTime = Date.now();

    const res = await mergeAudioVideo(
      audioFilePath,
      videoFilePath,
      outputPath,
      id
    );

    //calculate time
    const endTime = Date.now();
    const timeTaken = endTime - startTime;
    // console.log("time taken", timeTaken);
    //uploading
    await updateStatus("uploading", id,0);

    const uploadedLink = await uploadMergedVideos(outputPath);
    if (!uploadedLink) {
      return false;
    }
    // // //update status to uploaded
    await updateStatus("uploaded", id, 100, uploadedLink);
    //delete merged video
    fs.unlinkSync(outputPath);

    // console.log(outputPath);

    return res;
  } catch (error) {
    await updateStatus("failed", id, 0);
    console.log("error");
    console.log(error);
  }
  return false;
}
