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
        access_token: "test",
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

  static async DeleteDummyBook() {
    await prismaClient.book.deleteMany({
      where: {
        title: "test",
      },
    });
  }
}
