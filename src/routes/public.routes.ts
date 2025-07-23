import express from "express";
import { GuardController } from "../controllers/guard.controller";

export const publicRouter = express.Router();
publicRouter.post("/api/guards/register", GuardController.register);
publicRouter.post("/api/guards/login", GuardController.login);
