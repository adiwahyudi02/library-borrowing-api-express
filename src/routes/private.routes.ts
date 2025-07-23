import express from "express";
import { GuardController } from "../controllers/guard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const privateRouter = express.Router();
privateRouter.use(authMiddleware);
