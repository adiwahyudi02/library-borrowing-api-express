import { Response, NextFunction } from "express";
import { prismaClient } from "../applications/database";
import { GuardRequest } from "../types/guard-request";

export const authMiddleware = async (
  req: GuardRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("X-API-TOKEN");

  if (token) {
    const guard = await prismaClient.guard.findFirst({
      where: {
        access_token: token,
      },
    });

    if (guard) {
      req.guard = guard;
      next();
      return;
    }
  }

  res
    .status(401)
    .json({
      errors: "Unauthorized",
    })
    .end();
};
