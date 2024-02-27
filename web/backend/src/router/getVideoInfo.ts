import { Router, Request, Response } from "express";
import getPlatformFromUrl from "../functions/getPlatformFromUrl.js";
import videoInfo from "../platfroms/youtube/videoInfo.js";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  if (!req.body.url) {
    res.status(400).json({ error: "URL is required" });
    return;
  }

  const url = req.body.url;

  if (getPlatformFromUrl(url) === "youtube") {
    try {
      const data = await videoInfo(url);

      if (data.error && data.error.includes("Invalid URL")) {
        res.status(400).json({ error: "Invalid URL" });
        return;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      res.json({
        ...data,
        platform: "youtube",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Internal Server Error",
        message:
          "An error occured while trying to get video info from youtube. Please try again later.",
      });
    }
  } else {
    res.status(400).json({ error: "Invalid URL" });
  }
});

const getVideoInfo = router;
export default getVideoInfo;
