import { prismaClient } from "../applications/database";
import { Validation } from "../validations/validation";
import { ResponseError } from "../errors/response.error";
import { CreateMemberRequest } from "../models/member";
import { MemberValidation } from "../validations/member.validation";

export class MemberService {
  static create = async (request: CreateMemberRequest) => {
    const createRequest = Validation.validate(MemberValidation.CREATE, request);

    const checkEmailUnique = await prismaClient.member.findUnique({
      where: {
        email: createRequest.email,
      },
    });

    if (checkEmailUnique) {
      throw new ResponseError(400, "Email already exists");
    }

    const res = await prismaClient.member.create({
      data: createRequest,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    return res;
  };
}
