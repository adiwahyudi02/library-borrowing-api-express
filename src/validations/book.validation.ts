import { z, ZodType } from "zod";

export class BookValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(191),
    author: z.string().min(1).max(191),
    stock: z.number().min(1).max(100),
  });
}
