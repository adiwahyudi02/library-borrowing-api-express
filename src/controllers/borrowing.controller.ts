import { NextFunction, Request, Response } from "express";
import { CreateBorrowingRequest } from "../models/borrowing";
import { BorrowingService } from "../services/borrowing.service";

export class BorrowingController {
  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = req.body as CreateBorrowingRequest;
      const response = await BorrowingService.create(request);

      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };
}
