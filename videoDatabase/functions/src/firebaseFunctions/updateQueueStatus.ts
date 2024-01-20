import { Request, Response } from "firebase-functions";
import connect from "./../db/connect";

export default async function updateQueueStatus(req: Request, res: Response) {
  const data = req.body.data;
  // console.log("update")
  if (!data) {
    res.status(400).send("No data provided");
    return;
  }
  if (!data.status) {
    res.status(400).send("No status provided");
    return;
  }
  if (!data.id) {
    res.status(400).send("No id provided");
    return;
  }
  if (data.statusPercentage === undefined) {
    res.status(400).send("No statusPercentage provided");
    return;
  }

  const db = await connect();
  try {
    const dbData = await db.collection("queue").doc(data.id).get();
    if (!dbData.exists) {
      res.status(400).send("No such document");
      return;
    }

    let link = null;

    if (data.link) {
      link = data.link;
    }

    const dataToBeAdded = {
      ...dbData.data(),
      status: data.status,
      link: link,
      updatedAt: new Date(),
      statusPercentage: data.statusPercentage,
    };

    await db.collection("queue").doc(data.id).update(dataToBeAdded);

    res.status(200).send("OK");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
}
