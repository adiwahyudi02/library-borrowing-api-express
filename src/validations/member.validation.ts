import { z, ZodType } from "zod";

export class MemberValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
    email: z.email().min(1).max(100),
    phone: z.string().min(6).max(20),
  });

  static readonly LIST: ZodType = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
