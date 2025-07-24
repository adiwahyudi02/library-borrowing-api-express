import express from "express";
import { GuardController } from "../controllers/guard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { BookController } from "../controllers/book.controller";

export const privateRouter = express.Router();
privateRouter.use(authMiddleware);

// guards
privateRouter.get("/api/guards/me", GuardController.me);
privateRouter.patch("/api/guards/me", GuardController.updateMe);
privateRouter.delete("/api/guards/logout", GuardController.logout);

// books
privateRouter.post("/api/books", BookController.create);
