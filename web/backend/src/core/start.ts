import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import getVideoInfo from "../router/getVideoInfo.js";
import createVideoToMerge from "../router/createVideoToMerge.js";
import cors from "cors";
import corsOptions from "./cors.js";
app.use(cors(
  corsOptions
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/getVideoInfo", getVideoInfo);
app.use("/createVideoToMerge", createVideoToMerge);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
