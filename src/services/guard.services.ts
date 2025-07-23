import { prismaClient } from "../applications/database";
import { ResponseError } from "../errors/response.error";
import { RegisterGuardRequest } from "../models/guard";
import { GuardValidation } from "../validations/guard.validation";
import { Validation } from "../validations/validation";
import bcrypt from "bcrypt";

export class GuardService {
  static register = async (request: RegisterGuardRequest) => {
    const registerRequest = Validation.validate(
      GuardValidation.REGISTER,
      request
    );

    const checkEmailUnique = await prismaClient.guard.findUnique({
      where: {
        email: registerRequest.email,
      },
    });

    if (checkEmailUnique) {
      throw new ResponseError(400, "Email already exists");
    }

    registerRequest.password = await bcrypt.hash(request.password, 10);

    const res = await prismaClient.guard.create({
      data: registerRequest,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return res;
  };
}
