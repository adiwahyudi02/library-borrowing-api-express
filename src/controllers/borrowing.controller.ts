import { NextFunction, Request, Response } from "express";
import {
  CreateBorrowingRequest,
  ListBorrowingRequest,
  ReturningBorrowingRequest,
} from "../models/borrowing";
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

  static list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request: ListBorrowingRequest = {
        ...req.query,
        page: parseInt(req.query.page as string) || 1,
        size: parseInt(req.query.size as string) || 10,
      };

      const response = await BorrowingService.list(request);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  };

  static get = async (req: Request, res: Response, next: NextFunction) => {
    const borrowingId = Number(req.params.borrowingId);

    try {
      const response = await BorrowingService.get(borrowingId);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };

  static returning = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const borrowingId = Number(req.params.borrowingId);
      const request = req.body as ReturningBorrowingRequest;
      const response = await BorrowingService.returning(borrowingId, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };
}
