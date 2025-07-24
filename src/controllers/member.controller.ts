import { NextFunction, Request, Response } from "express";
import { CreateMemberRequest } from "../models/member";
import { MemberService } from "../services/member.service";

export class MemberController {
  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = req.body as CreateMemberRequest;
      const response = await MemberService.create(request);

      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  };
}
