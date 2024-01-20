/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onDocumentWritten } from "firebase-functions/v2/firestore";

import { Telegraf } from "telegraf";
import { configDotenv } from "dotenv";
configDotenv();

export const sendRequestOnVideoSateChange = onDocumentWritten(
  "queue/{telegram}",
  async (event) => {
    const data = event.data?.after.data();
    // console.log(data);
    // console.log(event.data)

    if (!data || data === undefined) {
      console.log("No data");
      return;
    }

    const link = data?.link;
    const platform = data?.telegram;

    if (!platform) {
      console.log("No platform");
      return;
    }

    if (platform.platform.toLowerCase().trim() === "tg") {
      const chatId = platform.chatId;
      const messageId = platform.messageId;
      const bot = new Telegraf(process.env.BOT_TOKEN as string);
      const state = data?.status.toLowerCase().trim();

      try {
        // check to see if the message has been sent
        // if(event.data && event.data.before.data().status){
        if (
          state === "queued" &&
          data?.telegram.queueMessageSent === undefined
        ) {
          const res = await bot.telegram.sendMessage(
            chatId,
            "Your video is queued",
            {
              reply_to_message_id: messageId,
            }
          );
          //   const sendChatId = res.chat.id;

          const editMessageId = res.message_id;

          //update chatId in firestore
          await event.data?.after.ref.update({
            "telegram.editMessageId": editMessageId,
            "telegram.queueMessageSent": true,
          });

          return;
        }
        // console.log(data?.telegram.editMessageId);

        if (state === "downloading-audio" || state === "downloading-video") {
          await bot.telegram.editMessageText(
            chatId,
            data?.telegram.editMessageId,
            undefined,
            state + "..." + parseInt(data?.statusPercentage) + "%"
          );
          return;
        }

        if (state === "merging") {
          await bot.telegram.editMessageText(
            chatId,
            data?.telegram.editMessageId,

            undefined,
            "Your video is processing... in the server" +
              "..." +
              parseInt(data?.statusPercentage) +
              "%"
          );
          return;
        }

        if (state === "uploading") {
          await bot.telegram.editMessageText(
            chatId,
            data?.telegram.editMessageId,

            undefined,
            "Your video is uploading... to the cloud"
          );
          return;
        }

        if (state === "failed") {
          await bot.telegram.editMessageText(
            chatId,

            data?.telegram.editMessageId,
            undefined,
            "Your video failed to process... please try again"
          );
          return;
        }

        if (state === "uploaded") {
          await bot.telegram.editMessageText(
            chatId,
            data?.telegram.editMessageId,

            undefined,
            "LInk to your video (valid for 2hours only): " + link
          );
          return;
        }

        if (state === "queued" && data?.telegram.queueMessageSent) {
          return;
        }

        bot.telegram.sendMessage(chatId, "Your video is in an unknown state");
      } catch (error) {
        console.log(error);
      }
    }
  }
);

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
