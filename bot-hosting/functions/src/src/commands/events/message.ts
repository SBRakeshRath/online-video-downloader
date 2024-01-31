import { inlineKeyboard } from "telegraf/typings/markup.js";
import bot from "../../core/bot.js";
import extractLInk from "../../functions/extractLink.js";
import getPlatform from "../../functions/getPlatform.js";
import getVideoInfo from "../../platforms/youtube/getVideoInfo.js";

bot.on("message", async (ctx) => {
  if (!ctx.message || !("text" in ctx.message)) {
    await ctx.reply("Sorry I can't handel this type of message");
    return;
  }

  const text = ctx.message.text;

  if (!text.includes("https://")) {
    await ctx.reply("Sorry I can't handel this type of message");
    return;
  }

  const link = extractLInk(text);
  if (!link || link === null) {
    await ctx.reply("Sorry No link found  ");
    return;
  }

  const platform = getPlatform(link);

  if (!platform) {
    ctx.reply("Sorry Link not Supported ");
    return;
  }

  try {
    if (platform === "youtube") {
      const inlineKeyboard = [
        [
          {
            text: "video",
            callback_data: JSON.stringify({ type: "video" }),
          },
          {
            text: "audio",
            callback_data: JSON.stringify({ type: "audio" }),
          },
        ],
      ];
      await ctx.reply("Please select the format you want to download", {
        reply_to_message_id: ctx.message.message_id,
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      });
      // const id = message.message_id;
      // await getVideoInfo(ctx.message.message_id, link, ctx);
      return;
    }
    await ctx.reply("Sorry Link not Supported ");
  } catch (error) {
    console.log(error);
  }
});
