import { Guard } from "@prisma/client";
import { prismaClient } from "../applications/database";
import { ResponseError } from "../errors/response.error";
import { LoginGuardRequest, RegisterGuardRequest } from "../models/guard";
import { GuardValidation } from "../validations/guard.validation";
import { Validation } from "../validations/validation";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

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

  static login = async (request: LoginGuardRequest) => {
    const loginRequest = Validation.validate(GuardValidation.LOGIN, request);

    const guard = await prismaClient.guard.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    if (!guard) {
      throw new ResponseError(400, "Email or password is wrong");
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      guard.password
    );

    if (!isPasswordValid) {
      throw new ResponseError(400, "Email or password is wrong");
    }

    const res = await prismaClient.guard.update({
      where: {
        email: loginRequest.email,
      },
      data: {
        access_token: uuid(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        access_token: true,
      },
    });

    return res;
  };

  static me = async (guard: Guard) => {
    return {
      id: guard.id,
      name: guard.name,
      email: guard.email,
    };
  };
}
