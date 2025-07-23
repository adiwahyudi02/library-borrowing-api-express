import { prismaClient } from "../src/applications/database";

export class TestUtils {
  static async CreateDummyGuard() {
    await prismaClient.guard.create({
      data: {
        name: "test",
        email: "test@test.com",
        password: "test",
      },
    });
  }

  static async DeleteDummyGuard() {
    await prismaClient.guard.deleteMany({
      where: {
        email: "test@test.com",
      },
    });
  }
}
