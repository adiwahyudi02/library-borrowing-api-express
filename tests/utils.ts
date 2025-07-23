import { prismaClient } from "../src/applications/database";
import bcrypt from "bcrypt";

export class TestUtils {
  static async CreateDummyGuard() {
    const password = await bcrypt.hash("test", 10);
    await prismaClient.guard.create({
      data: {
        name: "test",
        email: "test@test.com",
        password: password,
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
