import { z, ZodType } from "zod";

const datetime = z.string().datetime({
  message: "Invalid ISO datetime format",
});

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Invalid date format, expected YYYY-MM-DD",
  })
  .refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: "Invalid date value" }
  )
  .optional();

export class BorrowingValidation {
  static readonly CREATE: ZodType = z.object({
    memberId: z.int().positive(),
    bookId: z.int().positive(),
    guardId: z.int().positive(),
    borrowDate: datetime,
    dueDate: datetime,
  });

  static readonly LIST: ZodType = z.object({
    search: z.string().optional(),
    status: z.enum(["borrowed", "returned"]).optional(),
    borrowDate: date,
    dueDate: date,
    returnDate: date,
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
