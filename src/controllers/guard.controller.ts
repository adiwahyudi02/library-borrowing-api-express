import { NextFunction, Request, Response } from "express";
import { RegisterGuardRequest } from "../models/guard";
import { GuardService } from "../services/guard.services";

export class GuardController {
  static register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = req.body as RegisterGuardRequest;

      const response = await GuardService.register(request);
      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };
}
