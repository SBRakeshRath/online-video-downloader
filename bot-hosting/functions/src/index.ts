import { onRequest } from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
// import { CloudTasksClient, protos } from "@google-cloud/tasks";

import "./src/core/start";

import bot from "./src/core/bot";

// const queue_name = "video-audio-merger";
// const project_id = "online-video-downloader-410712";
// const location = "asia-south1";

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

// export const addTask = onRequest(async (request, response) => {
//   const client = new CloudTasksClient();
//   const parent = client.queuePath(project_id, location, queue_name);

//   const task = {
//     httpRequest: {
//       httpMethod: "POST",
//       url: "https://0d52-103-106-200-60.ngrok-free.app/online-video-downloader-410712/us-central1/helloWorld",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: Buffer.from(JSON.stringify(request.body)).toString("base64"),
//     },
//   } as protos.google.cloud.tasks.v2beta3.ITask;

//   try {
//     await client.createTask({
//       parent: parent,
//       task: task,
//     });
//   } catch (error) {
//     logger.error(error);
//   }

//   response.send("Task added");
// });

export const botWebhook = onRequest((request, response) => {
  // logger.info("Hello logs!", { structuredData: true });
  return bot.handleUpdate(request.body, response);
});

