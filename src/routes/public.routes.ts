import express from "express";
import { GuardController } from "../controllers/guard.controller";
import { BookController } from "../controllers/book.controller";

export const publicRouter = express.Router();

// guards
publicRouter.post("/api/guards/register", GuardController.register);
publicRouter.post("/api/guards/login", GuardController.login);

// books
publicRouter.get("/api/books", BookController.list);
publicRouter.get("/api/books/:bookId", BookController.get);
