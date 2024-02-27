import { CorsOptions } from "cors";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const domains = process.env.CORS_DOMAINS?.split(",") || [];
// console.log("domains", domains);

const corsOptions: CorsOptions = {
  origin: domains,
  optionsSuccessStatus: 200,
};

export default corsOptions;
