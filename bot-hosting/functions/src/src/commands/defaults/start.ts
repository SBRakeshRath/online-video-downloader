const startMessage: string =
  "<b> Welcome to the bot! </b>\n\n" +
  "You can use this bot to download videos from YouTube \n\n" +
  " Follow the Steps to download the video \n\n" +
  " 1. Send the link of the video \n\n" +
  " 2. Select the quality of the video \n\n" +
  " 3. Download the video \n\n" +
  " 4. Enjoy";

import bot from "../../core/bot.js";

bot.start(async (ctx) => {
  try {
    await ctx.replyWithHTML(startMessage);
  } catch (error) {
    console.log(error);
  }
});
