import { NextFunction, Request, Response } from "express";
import {
  LoginGuardRequest,
  RegisterGuardRequest,
  UpdateGuardRequest,
} from "../models/guard";
import { GuardService } from "../services/guard.services";
import { GuardRequest } from "../types/guard-request";

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

  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = req.body as LoginGuardRequest;
      const response = await GuardService.login(request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };

  static me = async (req: GuardRequest, res: Response, next: NextFunction) => {
    try {
      const guard = req.guard;
      const response = await GuardService.me(guard!);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };

  static updateMe = async (
    req: GuardRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const guard = req.guard;
      const request = req.body as UpdateGuardRequest;
      const response = await GuardService.updateMe(guard!, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };
}
