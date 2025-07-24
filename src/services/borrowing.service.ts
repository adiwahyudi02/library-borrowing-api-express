import { prismaClient } from "../applications/database";
import { Validation } from "../validations/validation";
import { ResponseError } from "../errors/response.error";
import { CreateBorrowingRequest } from "../models/borrowing";
import { BorrowingValidation } from "../validations/borrowing.validation";

export class BorrowingService {
  static create = async (request: CreateBorrowingRequest) => {
    const createRequest = Validation.validate(
      BorrowingValidation.CREATE,
      request
    );

    const checkMember = await prismaClient.member.findUnique({
      where: {
        id: createRequest.memberId,
      },
    });

    if (!checkMember) {
      throw new ResponseError(400, "Member not found");
    }

    const checkStock = await prismaClient.book.findUnique({
      where: {
        id: createRequest.bookId,
      },
    });

    if (!checkStock) {
      throw new ResponseError(400, "Book not found");
    }

    if (checkStock.stock < 1) {
      throw new ResponseError(400, "Book stock is not enough");
    }

    // create borrowing
    const res = await prismaClient.borrowing.create({
      data: createRequest,
      select: {
        id: true,
        borrowDate: true,
        dueDate: true,
        returnDate: true,
        memberId: true,
        bookId: true,
        guardId: true,
        member: true,
        book: true,
      },
    });

    // update stock of the book
    await prismaClient.book.update({
      where: {
        id: createRequest.bookId,
      },
      data: {
        stock: {
          decrement: 1,
        },
      },
    });

    return res;
  };
}
