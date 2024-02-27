import { Request, Response } from "firebase-functions";
import connect from "../db/connect";

function createData(data: any) {
  const dataToBeAdded = {
    status: "queued",
    web: {
      platform: "web",
      link: data.link,
      quality: data.quality,
    },
    createdAt: new Date(),
    link: null,
  };
  return dataToBeAdded;
}

export default async function addQueueDataFromTelegram(
  req: Request,
  res: Response
) {
  const data = req.body;
  if (!data) {
    res.status(400).send("No data provided");
    return;
  }
  if (!data.link) {
    res.status(400).send("No link provided");
    return;
  }
  if (!data.quality) {
    res.status(400).send("No messageId provided");
    return;
  }
  const db = await connect();
  const dataToBeAdded = createData(data);
  try {
    const docRef = await db.collection("queue").add(dataToBeAdded);
    res.status(200).send(docRef.id);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
}
