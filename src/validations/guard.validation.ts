import { z, ZodType } from "zod";

export class GuardValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(100),
    email: z.email().min(1).max(100),
    password: z.string().min(1).max(100),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.email().min(1).max(100),
    password: z.string().min(1).max(100),
  });
}
