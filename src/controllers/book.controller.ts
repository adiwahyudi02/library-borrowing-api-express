import { NextFunction, Request, Response } from "express";
import {
  CreateBookRequest,
  ListBookRequest,
  UpdateBookRequest,
} from "../models/books";
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

  static get = async (req: Request, res: Response, next: NextFunction) => {
    const bookId = Number(req.params.bookId);

    try {
      const response = await BookService.get(bookId);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = Number(req.params.bookId);
      const request = req.body as UpdateBookRequest;
      const response = await BookService.update(bookId, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };
}
