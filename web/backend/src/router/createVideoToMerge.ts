import axios from "axios";
import ytdl from "ytdl-core";
import { protos } from "@google-cloud/tasks";
import createTask from "../functions/createTask.js";

import { Request, Response, Router } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  if (!req.body.url || !req.body.quality) {
    res.status(400).json({ error: "URL and quality is required" });
    return;
  }

  try {
    const link = req.body.url;
    const quality = req.body.quality;

    if (!ytdl.validateURL(link)) {
      res.status(400).json({ error: "Invalid URL" });
      return;
    }

    const data = await ytdl.getInfo(link);
    let format = data.formats.find((format) => format.qualityLabel === quality);
    if (!format) {
      res.status(400).json({ error: "Invalid Quality" });
      return;
    }

    if (!format.contentLength) {
      res.status(400).json({ error: "Sorry we can't download this video" });
      return;
    }

    if (parseInt(format.contentLength) > 500000000) {
      res.status(400).json({
        error:
          "Sorry this video is too large. We are working on it to able to handel large videos...",
      });
      return;
    }

    const res1 = await axios.post(process.env.DB_LINK_QUEUE_DATA, {
      link: link,
      quality: quality,
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
    res.json({ message: "Task created", dbId: res1.data.trim() });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      message:
        "An error occured while trying to get video info from youtube. Please try again later.",
    });
  }
});


const createVideoToMerge = router;
export default createVideoToMerge;
// export default function createVideoToMerge(second) {third}
