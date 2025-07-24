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

  static async GetDummyGuard() {
    const guard = await prismaClient.guard.findUnique({
      where: {
        email: "test@test.com",
      },
    });

    if (!guard) {
      throw new Error("Guard is not found");
    }

    return guard;
  }

  static async DeleteDummyBook() {
    await prismaClient.book.deleteMany({
      where: {
        OR: [
          {
            title: "title-test-123",
          },
          {
            title: "title-test-123 updated",
          },
        ],
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

  static async CreateDummyMember() {
    await prismaClient.member.create({
      data: {
        name: "member-test-123",
        email: "member-test-123@test.com",
        phone: "011111111111",
      },
    });
  }

  static async DeleteDummyMember() {
    await prismaClient.member.deleteMany({
      where: {
        OR: [
          {
            email: "member-test-123@test.com",
          },
          {
            email: "member-test-123@test.comupdated",
          },
        ],
      },
    });
  }

  static async GetDummyMember() {
    const member = await prismaClient.member.findFirst({
      where: {
        email: "member-test-123@test.com",
      },
    });

    if (!member) {
      throw new Error("Member is not found");
    }

    return member;
  }

  static async CreateDummyBorrowing() {
    const guard = await this.GetDummyGuard();
    const book = await this.GetDummyBook();
    const member = await this.GetDummyMember();
    await prismaClient.borrowing.create({
      data: {
        memberId: member.id,
        bookId: book.id,
        guardId: guard.id,
        borrowDate: "2025-07-24T00:00:00.000Z",
        dueDate: "2025-08-24T00:00:00.000Z",
      },
    });
  }

  static async DeleteDummyBorrowing() {
    const guard = await this.GetDummyGuard();
    const book = await this.GetDummyBook();
    const member = await this.GetDummyMember();
    await prismaClient.borrowing.deleteMany({
      where: {
        memberId: member.id,
        bookId: book.id,
        guardId: guard.id,
        borrowDate: "2025-07-24T00:00:00.000Z",
        dueDate: "2025-08-24T00:00:00.000Z",
      },
    });
  }
}
