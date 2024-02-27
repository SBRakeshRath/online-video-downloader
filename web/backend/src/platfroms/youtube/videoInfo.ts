import ytdl from "ytdl-core";
export default async function videoInfo(link: string) {
  //check if the link is a valid youtube link

  try {
    if (!ytdl.validateURL(link)) {
      return { error: "Invalid URL" };
    }
    const info = await ytdl.getInfo(link);
    const videoDetails = info.videoDetails;

    const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
    const videoFormats = ytdl.filterFormats(info.formats, "videoandaudio");
    const videoWithoutAudio = ytdl.filterFormats(info.formats, "videoonly");

    return {
      videoDetails,
      audioFormats,
      videoFormats,
      videoWithoutAudio,
    };
  } catch (error) {
    return { error: error.message };
  }
}
