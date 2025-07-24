import { prismaClient } from "../applications/database";
import {
  CreateBookRequest,
  ListBookRequest,
  UpdateBookRequest,
} from "../models/books";
import { BookValidation } from "../validations/book.validation";
import { Validation } from "../validations/validation";
import { ResponseError } from "../errors/response.error";

export class BookService {
  static create = async (request: CreateBookRequest) => {
    const createRequest = Validation.validate(BookValidation.CREATE, request);

    const checkTitleUnique = await prismaClient.book.findUnique({
      where: {
        title: createRequest.title,
      },
    });

    if (checkTitleUnique) {
      throw new ResponseError(400, "Book title already exists");
    }

    const res = await prismaClient.book.create({
      data: createRequest,
      select: {
        id: true,
        title: true,
        author: true,
        stock: true,
      },
    });

    return res;
  };

  static list = async (request: ListBookRequest) => {
    const listRequest = Validation.validate(BookValidation.LIST, request);

    const skip = (listRequest.page - 1) * listRequest.size;

    const filters = [];

    if (listRequest.title) {
      filters.push({
        title: {
          contains: listRequest.title,
        },
      });
    }

    if (listRequest.author) {
      filters.push({
        author: {
          contains: listRequest.author,
        },
      });
    }

    const where = filters.length > 0 ? { OR: filters } : undefined;

    const res = await prismaClient.book.findMany({
      where,
      select: {
        id: true,
        title: true,
        author: true,
        stock: true,
      },
      take: listRequest.size,
      skip: skip,
    });

    const total = await prismaClient.book.count({
      where,
    });

    return {
      data: res,
      pagging: {
        current_page: listRequest.page,
        total_page: Math.ceil(total / listRequest.size),
        size_page: listRequest.size,
        total_items: total,
      },
    };
  };

  static get = async (bookId: number) => {
    const id = Validation.validate(BookValidation.GET, bookId);

    const res = await prismaClient.book.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        author: true,
        stock: true,
      },
    });

    if (!res) {
      throw new ResponseError(404, "Book not found");
    }

    return res;
  };

  static update = async (bookId: number, request: UpdateBookRequest) => {
    const id = Validation.validate(BookValidation.GET, bookId);
    const editRequest = Validation.validate(BookValidation.UPDATE, request);

    const checkId = await prismaClient.book.findUnique({
      where: {
        id,
      },
    });

    if (!checkId) {
      throw new ResponseError(404, "Book not found");
    }

    if (editRequest.title) {
      const checkTitleUnique = await prismaClient.book.findUnique({
        where: {
          title: editRequest.title,
        },
      });

      if (checkTitleUnique && checkTitleUnique.id !== id) {
        throw new ResponseError(400, "Book title already exists");
      }
    }

    const res = await prismaClient.book.update({
      where: {
        id,
      },
      data: editRequest,
      select: {
        id: true,
        title: true,
        author: true,
        stock: true,
      },
    });

    return res;
  };
}
