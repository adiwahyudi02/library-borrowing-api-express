import { Request } from "express";
import { Guard } from "@prisma/client";

export interface GuardRequest extends Request {
  guard?: Guard;
}
