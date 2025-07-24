import { z, ZodType } from "zod";

export class MemberValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
    email: z.email().min(1).max(100),
    phone: z.string().min(6).max(20),
  });
}
