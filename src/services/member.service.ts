import { prismaClient } from "../applications/database";
import { Validation } from "../validations/validation";
import { ResponseError } from "../errors/response.error";
import { CreateMemberRequest, ListMemberRequest } from "../models/member";
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

  static list = async (request: ListMemberRequest) => {
    const listRequest = Validation.validate(MemberValidation.LIST, request);

    const skip = (listRequest.page - 1) * listRequest.size;

    const filters = [];

    if (listRequest.name) {
      filters.push({
        name: {
          contains: listRequest.name,
        },
      });
    }

    if (listRequest.email) {
      filters.push({
        email: {
          contains: listRequest.email,
        },
      });
    }

    if (listRequest.phone) {
      filters.push({
        phone: {
          contains: listRequest.phone,
        },
      });
    }

    const where = filters.length > 0 ? { OR: filters } : undefined;

    const res = await prismaClient.member.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
      take: listRequest.size,
      skip: skip,
    });

    const total = await prismaClient.member.count({
      where,
    });

    return {
      data: res,
      pagging: {
        current_page: listRequest.page,
        total_page: Math.ceil(total / listRequest.size),
        size_page: listRequest.size,
        total_items: total,
      },
    };
  };
}
