import axios from "axios";
import { Context } from "telegraf";
import ytdl from "ytdl-core";
import { protos } from "@google-cloud/tasks";
import createTask from "../../functions/createTask";

let downloadUrl: string = "";

export default async function downloadVideo(
  link: string,
  quality: string,
  ctx: Context,
  message_id: number
) {
  try {
    // await ctx.answerCbQuery("Generating Link Please Wait....");

    await ctx.reply("Generating Link Please Wait....", {
      reply_to_message_id: message_id,
    });

    const res = await ytdl.getInfo(link);

    let format =
      res.formats.find(
        (format) => format.qualityLabel === quality && format.hasAudio
      ) || res.formats.find((format) => format.qualityLabel === quality);

    // console.log(downloadLink);

    if (!format) {
      await ctx.reply("Sorry we can't download this video", {
        reply_to_message_id: message_id,
      });
      return;
    }

    if (format.hasAudio) {
      await ctx.reply(format.url, {
        reply_to_message_id: message_id,
      });

      return;
    }

    //check if video is too large greater than 999mb

    if (!format.contentLength) {
      await ctx.reply("Sorry we can't download this video", {
        reply_to_message_id: message_id,
      });
      return;
    }

    if (parseInt(format.contentLength) > 500000000) {
      downloadUrl = format.url;
      await ctx.reply(
        "Sorry this video is too large. We are working on it to able to handel large videos meanwhile you can download it from the link below \n\n",
        {
          reply_to_message_id: message_id,
        }
      );
      return;
    }

    const res1 = await axios.post(process.env.DB_LINK_QUEUE_DATA, {
      messageId: message_id,
      chatId: ctx.chat.id,
    });

    //create task in queue

    const taskData = {
      platform: "youtube",
      url: link,
      quality: quality,
      dbId: res1.data.trim(),
    };

    const task = {
      httpRequest: {
        httpMethod: "POST",
        url: process.env.TASK_LINK,
        headers: {
          "Content-Type": "application/json",
        },
        body: Buffer.from(JSON.stringify(taskData)).toString("base64"),
      },
    } as protos.google.cloud.tasks.v2beta3.ITask;

    await createTask(task);
  } catch (error) {
    if (
      error &&
      error.message &&
      error.message.includes("413") &&
      downloadUrl !== ""
    ) {
      await ctx.reply(
        "Sorry this video is too large. We are working on it to able to handel large videos meanwhile you can download it from the link below \n\n" +
          downloadUrl,
        {
          reply_to_message_id: message_id,
        }
      );
      return;
    }
    console.log("error......");
    console.log(error);
    await ctx.reply("Sorry we can't download this video ---------", {
      reply_to_message_id: message_id,
    });
  }
}
