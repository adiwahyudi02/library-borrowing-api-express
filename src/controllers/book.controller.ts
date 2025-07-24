import { NextFunction, Request, Response } from "express";
import { CreateBookRequest } from "../models/books";
import { BookService } from "../services/book.service";

export class BookController {
  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = req.body as CreateBookRequest;
      const response = await BookService.create(request);

      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };
}
