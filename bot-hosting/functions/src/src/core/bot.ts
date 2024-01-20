import { Telegraf } from "telegraf";
import { configDotenv } from "dotenv";
configDotenv();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

export default bot;