import { z, ZodType } from "zod";

const datetime = z.string().datetime({
  message: "Invalid ISO datetime format",
});

export class BorrowingValidation {
  static readonly CREATE: ZodType = z.object({
    memberId: z.int().positive(),
    bookId: z.int().positive(),
    guardId: z.int().positive(),
    borrowDate: datetime,
    dueDate: datetime,
  });
}
