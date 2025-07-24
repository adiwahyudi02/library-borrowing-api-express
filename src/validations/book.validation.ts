import { z, ZodType } from "zod";

export class BookValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(191),
    author: z.string().min(1).max(191),
    stock: z.number().min(1).max(100),
  });

  static readonly LIST: ZodType = z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });

  static readonly GET: ZodType = z.number().positive();

  static readonly UPDATE: ZodType = z.object({
    title: z.string().min(1).max(191).optional(),
    author: z.string().min(1).max(191).optional(),
    stock: z.number().min(0).max(100).optional(),
  });
}
