import { NextFunction, Request, Response } from "express";
import { CreateBookRequest, ListBookRequest } from "../models/books";
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

  static list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request: ListBookRequest = {
        title: req.query.title as string,
        author: req.query.author as string,
        page: parseInt(req.query.page as string) || 1,
        size: parseInt(req.query.size as string) || 10,
      };

      const response = await BookService.list(request);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  };
}
