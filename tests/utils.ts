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
        title: "title-test-123",
      },
    });
  }

  static async CreateDummyBook() {
    await prismaClient.book.create({
      data: {
        title: "title-test-123",
        author: "author-test-123",
        stock: 1,
      },
    });
  }

  static async GetDummyBook() {
    const book = await prismaClient.book.findFirst({
      where: {
        title: "title-test-123",
      },
    });

    if (!book) {
      throw new Error("Book is not found");
    }

    return book;
  }
}
