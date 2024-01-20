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
      await ctx.reply("Please Wait... \n\n" + "Fetching Video Info");
      await getVideoInfo(ctx.message.message_id, link, ctx);
      return;
    }
    await ctx.reply("Sorry Link not Supported ");
  } catch (error) {
    console.log(error);
  }
});
