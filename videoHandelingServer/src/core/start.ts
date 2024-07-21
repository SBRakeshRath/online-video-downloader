//hello world
// import func from "../functions/fum.js";
import { configDotenv } from "dotenv";

// console.log(func());

import express from "express";
import bodyParser from "body-parser";
import DownloadVideo from "../functions/yt/downloadVideo.js";
import updateStatus from "../functions/statusDb/updateStatus.js";

// bodyParser.json();
// bodyParser.urlencoded({ extended: true });

const app = express();
app.use(bodyParser.json());
configDotenv();


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/", async (req, res) => {

  //now get headers from the request
  console.log(req.body)

  const headers = req.headers;
  const taskRetryCount = headers["x-cloudtasks-taskretrycount"];

  // X-CloudTasks-TaskRetryCount is the number of attempts (including the first attempt) that have been made to process the task.

  if (!req.body) return res.status(400).send("No body");
  if (!req.body.platform) return res.status(400).send("No platform");
  if (!req.body.dbId) return res.status(400).send("No dbId");
  if (
    taskRetryCount &&
    typeof taskRetryCount === "string" &&
    parseInt(taskRetryCount) > 0
  ) {
    try {
      await updateStatus("failed", req.body.dbId, 0);
    } catch (error) {
      console.log(error);
    }
    return res.status(200).send("Done");
  }
  if (req.body.platform === "youtube") {
    //youtube
    if (!req.body.url || !req.body.quality)
      return res.status(400).send("No url or quality");
    // DownloadVideo(req.body.url, req.body.quality);

    try {
      const result = await DownloadVideo(
        req.body.url,
        req.body.quality,
        req.body.dbId
      );
      if (result) {
        res.status(200).send("Done");
        return;
      }
      res.status(500).send("Error");
    } catch (error) {
      console.log("error");
      console.log(error);
      await updateStatus("failed", req.body.dbId, 0);

      res.status(500).send("Error");
    }
  }
});

app.listen(parseInt(process.env.PORT) || 4000);
