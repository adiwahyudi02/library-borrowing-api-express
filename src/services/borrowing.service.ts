import { prismaClient } from "../applications/database";
import { Validation } from "../validations/validation";
import { ResponseError } from "../errors/response.error";
import {
  CreateBorrowingRequest,
  ListBorrowingRequest,
} from "../models/borrowing";
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

  static list = async (request: ListBorrowingRequest) => {
    const listRequest = Validation.validate(BorrowingValidation.LIST, request);

    const skip = (listRequest.page - 1) * listRequest.size;

    const filters = [];

    if (listRequest.search) {
      filters.push({
        OR: [
          {
            member: {
              name: { contains: listRequest.search },
            },
          },
          {
            member: {
              email: { contains: listRequest.search },
            },
          },
          {
            book: {
              title: { contains: listRequest.search },
            },
          },
        ],
      });
    }

    if (listRequest.status) {
      if (listRequest.status === "borrowed") {
        filters.push({
          returnDate: null,
        });
      } else if (listRequest.status === "returned") {
        filters.push({
          NOT: { returnDate: null },
        });
      }
    }

    if (listRequest.borrowDate) {
      filters.push({
        borrowDate: {
          gte: new Date(listRequest.borrowDate),
          lt: new Date(
            new Date(listRequest.borrowDate).getTime() + 24 * 60 * 60 * 1000
          ),
        },
      });
    }

    if (listRequest.dueDate) {
      filters.push({
        dueDate: {
          gte: new Date(listRequest.dueDate),
          lt: new Date(
            new Date(listRequest.dueDate).getTime() + 24 * 60 * 60 * 1000
          ),
        },
      });
    }

    if (listRequest.returnDate) {
      filters.push({
        returnDate: {
          gte: new Date(listRequest.returnDate),
          lt: new Date(
            new Date(listRequest.returnDate).getTime() + 24 * 60 * 60 * 1000
          ),
        },
      });
    }

    const where = filters.length > 0 ? { AND: filters } : undefined;

    const res = await prismaClient.borrowing.findMany({
      where,
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
      take: listRequest.size,
      skip: skip,
    });

    const total = await prismaClient.borrowing.count({
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
}
