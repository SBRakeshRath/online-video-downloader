import bot from "../../core/bot.js";
import extractLink from "../../functions/extractLink.js";
import getPlatform from "../../functions/getPlatform.js";
import downloadAudio from "../../platforms/youtube/downloadAudio.js";
import downloadVideo from "../../platforms/youtube/downloadVideo.js";
import getVideoInfo from "../../platforms/youtube/getVideoInfo.js";

bot.on("callback_query", async (ctx) => {
  if (!ctx.callbackQuery) {
    await ctx.answerCbQuery("Something went wrong");
    return;
  }

  if (!ctx.callbackQuery.message) {
    await ctx.answerCbQuery("Something went wrong");
    return;
  }

  if (!("data" in ctx.callbackQuery)) {
    await ctx.answerCbQuery("Something went wrong");
    return;
  }

  const message = ctx.callbackQuery.message;

  if (
    !(
      "reply_to_message" in message &&
      message.reply_to_message &&
      "text" in message.reply_to_message &&
      message.reply_to_message.text
    )
  ) {
    await ctx.answerCbQuery("Something went wrong");
    return;
  }

  const link = extractLink(message.reply_to_message.text);

  if (!link || link === null) {
    await ctx.answerCbQuery("Sorry No link found  ");
    return;
  }

  const platform = getPlatform(link);

  if (!platform) {
    await ctx.answerCbQuery("Sorry Link not Supported ");
    return;
  }

  // download the video

  try {
    if (platform === "youtube") {
      const type = JSON.parse(ctx.callbackQuery.data).type;

      if (type === "video") {
        if (!JSON.parse(ctx.callbackQuery.data).quality) {
          // console.log(message.message_id)
          await getVideoInfo(message.reply_to_message.message_id, link, ctx,type);
          return;
        }
        await downloadVideo(
          link,
          JSON.parse(ctx.callbackQuery.data).quality,
          ctx,
          message.reply_to_message.message_id
        );
        return;
      }

      if (type === "audio") {
        if (!JSON.parse(ctx.callbackQuery.data).quality) {
          // console.log(message.message_id)
          await getVideoInfo(message.reply_to_message.message_id, link, ctx,type);
          return;
        }
        await downloadAudio(
          link,
          JSON.parse(ctx.callbackQuery.data).quality,
          ctx,
          message.message_id
        );
        return;
      }

      await ctx.answerCbQuery("Sorry Link not Supported ");
      return;
    }
    await ctx.answerCbQuery("Sorry Link not Supported ");
  } catch (error) {
    console.log(error);
    await ctx.answerCbQuery("Something went wrong");
  }
});
