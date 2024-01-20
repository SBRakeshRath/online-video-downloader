import { Context } from "telegraf";
import ytdl from "ytdl-core";

export default async function getVideoInfo(
  message_id: number,
  link: string,
  ctx: Context
) {
  try {
    // await ctx.answerCbQuery("Generating Link Please Wait....");

    const info = await ytdl.getInfo(link);
    const formats = info.formats;
    let videoFormats = formats.filter((format) => format.hasVideo);

    let audioFormats = formats.filter(
      (format) => format.hasAudio && !format.hasVideo
    );

    if ((videoFormats.length === 0, audioFormats.length === 0)) {
      await ctx.reply("Sorry we can't download this video", {
        reply_to_message_id: message_id,
      });
      return;
    }

    videoFormats = videoFormats.reduce((acc, current) => {
      //remove same quality videos
      const x = acc.find((item) => item.qualityLabel === current.qualityLabel);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    // create a array having of 3 buttons each

    const videoFormatInputArray = [];
    let ci = 0;
    videoFormats.forEach((format) => {
      if (ci === 3) {
        ci = 0;
      }
      if (ci === 0) {
        videoFormatInputArray.push([]);
      }
      videoFormatInputArray[videoFormatInputArray.length - 1].push({
        text: format.qualityLabel,
        callback_data: JSON.stringify({
          type: "video",
          quality: format.qualityLabel,
        }),
      });
      ci++;
    });

    audioFormats = audioFormats.reduce((acc, current) => {
      //remove same quality videos
      const x = acc.find((item) => item.audioQuality === current.audioQuality);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    const audioFormatInputArray = [];
    ci = 0;
    audioFormats.forEach((format) => {
      if (ci === 3) {
        ci = 0;
      }
      if (ci === 0) {
        audioFormatInputArray.push([]);
      }
      audioFormatInputArray[audioFormatInputArray.length - 1].push({
        text: format.audioQuality,
        callback_data: JSON.stringify({
          type: "audio",
          quality: format.audioQuality,
        }),
      });
      ci++;
    });

    //create for audio and video formats

    await ctx.reply("Please select the video format you want to download", {
      reply_markup: {
        inline_keyboard: videoFormatInputArray,
      },
      reply_to_message_id: ctx.message.message_id,
    });

    await ctx.reply("Please select the audio format you want to download", {
      reply_markup: {
        inline_keyboard: audioFormatInputArray,
      },
      reply_to_message_id: ctx.message.message_id,
    });

    return;
  } catch (error) {
    console.log(error);
    await ctx.reply("Sorry we can't download this video");
    return;
  }
}
