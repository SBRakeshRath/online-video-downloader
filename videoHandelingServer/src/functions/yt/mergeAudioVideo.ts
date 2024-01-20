import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import uploadMergedVideos from "../../storage/uploadMergedVideo.js";
import updateStatus from "../statusDb/updateStatus.js";

export default async function mergeAudioVideo(
  audioPath: string,
  videoPath: string,
  outputPath: string,
  id: string
) {
  try {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);

    await new Promise<void>((resolve, reject) => {
      let percent = 0;
      let totalTime: number = 0;

      // console.log("merging");
      // wait
      const i = ffmpeg()
        .input(videoPath)
        .input(audioPath)
        .output(outputPath)
        .withVideoCodec("copy")
        .on("codecData", (data) => {
          // HERE YOU GET THE TOTAL TIME
          // console.log(data);
          totalTime = parseInt(data.duration.replace(/:/g, ""));
        })
        // .on('')
        .on("progress", async (progress) => {
          // let currentPercent = progress.percent;
          // console.log(progress);

          const time = parseInt(progress.timemark.replace(/:/g, ""));

          // AND HERE IS THE CALCULATION
          const cp = (time / totalTime) * 100;
          if (cp - percent > 2) {
            // console.log(percent);
            percent = cp;
            await updateStatus("merging", id, percent);
          }
        })
        .on("qbcdef", async (err) => {
          await updateStatus("failed", id, 0);
          return reject(new Error(err));
        })
        .on("end", () => {
          resolve(); // finish
        })
        .on("error", (err) => {
          return reject(new Error(err));
        })
        .run();
    });

    console.log("uploading");
    //delete audio and video files

    fs.unlinkSync(audioPath);
    fs.unlinkSync(videoPath);

    return true;
  } catch (error) {
    console.log(error);
  }
  return false;
}
