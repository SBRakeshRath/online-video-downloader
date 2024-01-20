import { Storage } from "@google-cloud/storage";
import path from "path";
const __dirname = path.resolve();

export default async function uploadMergedVideos(pathToUpload: string) {
  try {
    const storage = new Storage();

    const bucket = storage.bucket("video-audio-storage123/");
    const res = await bucket.upload(pathToUpload);
    const accessLink = res[0].metadata.mediaLink;
    return accessLink;
  } catch (error) {
    console.log(error);
  }
  return false;
}
