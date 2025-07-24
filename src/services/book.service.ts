import { prismaClient } from "../applications/database";
import { CreateBookRequest } from "../models/books";
import { BookValidation } from "../validations/book.validation";
import { Validation } from "../validations/validation";

export class BookService {
  static create = async (request: CreateBookRequest) => {
    const createRequest = Validation.validate(BookValidation.CREATE, request);

    const checkTitleUnique = await prismaClient.book.findUnique({
      where: {
        title: createRequest.title,
      },
    });

    if (checkTitleUnique) {
      throw new Error("Book title already exists");
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
}
