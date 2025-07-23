import express from "express";
import { errorMiddleware } from "../middlewares/error.middleware";

export const web = express();
web.use(express.json());
web.use(errorMiddleware);
