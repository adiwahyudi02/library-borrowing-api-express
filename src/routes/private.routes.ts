import express from "express";
import { GuardController } from "../controllers/guard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { BookController } from "../controllers/book.controller";
import { MemberController } from "../controllers/member.controller";
import { BorrowingController } from "../controllers/borrowing.controller";

export const privateRouter = express.Router();
privateRouter.use(authMiddleware);

// guards
privateRouter.get("/api/guards/me", GuardController.me);
privateRouter.patch("/api/guards/me", GuardController.updateMe);
privateRouter.delete("/api/guards/logout", GuardController.logout);

// books
privateRouter.post("/api/books", BookController.create);
privateRouter.patch("/api/books/:bookId", BookController.update);
privateRouter.delete("/api/books/:bookId", BookController.delete);

// members
privateRouter.post("/api/members", MemberController.create);
privateRouter.get("/api/members", MemberController.list);
privateRouter.get("/api/members/:memberId", MemberController.get);
privateRouter.patch("/api/members/:memberId", MemberController.update);
privateRouter.delete("/api/members/:memberId", MemberController.delete);

// borrowings
privateRouter.post("/api/borrowings", BorrowingController.create);
privateRouter.get("/api/borrowings", BorrowingController.list);
