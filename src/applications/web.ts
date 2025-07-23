import express from "express";
import { publicRouter } from "../routes/public.routes";
import { privateRouter } from "../routes/private.routes";
import { errorMiddleware } from "../middlewares/error.middleware";

export const web = express();
web.use(express.json());
web.use(publicRouter);
web.use(privateRouter);
web.use(errorMiddleware);
