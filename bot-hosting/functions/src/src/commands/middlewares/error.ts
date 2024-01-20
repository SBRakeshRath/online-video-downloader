import { Context } from "telegraf";

import bot from "../../core/bot.js";
bot.catch((err: any, ctx: Context) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
  console.log(err);
  ctx.reply("Something went wrong");
});

