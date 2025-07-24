import { NextFunction, Request, Response } from "express";
import { CreateMemberRequest, ListMemberRequest } from "../models/member";
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

  static list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request: ListMemberRequest = {
        name: req.query.name as string,
        email: req.query.email as string,
        phone: req.query.phone as string,
        page: parseInt(req.query.page as string) || 1,
        size: parseInt(req.query.size as string) || 10,
      };

      const response = await MemberService.list(request);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  };
}
