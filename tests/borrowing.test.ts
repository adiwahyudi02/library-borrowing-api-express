import supertest from "supertest";
import { TestUtils } from "./utils";
import { web } from "../src/applications/web";
import { logger } from "../src/applications/logger";

describe("Borrowing", () => {
  describe("POST /api/borrowings", () => {
    beforeEach(async () => {
      await TestUtils.CreateDummyGuard();
      await TestUtils.CreateDummyMember();
      await TestUtils.CreateDummyBook();
    });

    afterEach(async () => {
      await TestUtils.DeleteDummyBorrowing();
      await TestUtils.DeleteDummyMember();
      await TestUtils.DeleteDummyBook();
      await TestUtils.DeleteDummyGuard();
    });

    it("should create a new borrowing", async () => {
      const guard = await TestUtils.GetDummyGuard();
      const book = await TestUtils.GetDummyBook();
      const member = await TestUtils.GetDummyMember();

      const response = await supertest(web)
        .post("/api/borrowings")
        .send({
          memberId: member.id,
          bookId: book.id,
          guardId: guard.id,
          borrowDate: "2025-07-24T00:00:00.000Z",
          dueDate: "2025-08-24T00:00:00.000Z",
        })
        .set("X-API-TOKEN", "test");

      logger.info(response);

      expect(response.status).toBe(201);
      expect(response.body.data.memberId).toBe(member.id);
      expect(response.body.data.bookId).toBe(book.id);
      expect(response.body.data.guardId).toBe(guard.id);
      expect(response.body.data.borrowDate).toBe("2025-07-24T00:00:00.000Z");
      expect(response.body.data.dueDate).toBe("2025-08-24T00:00:00.000Z");
    });

    it("should return 401 if token is invalid", async () => {
      const response = await supertest(web)
        .post("/api/borrowings")
        .send({
          memberId: 1,
          bookId: 1,
          guardId: 1,
          borrowDate: "2025-07-24T00:00:00.000Z",
          dueDate: "2025-08-24T00:00:00.000Z",
        })
        .set("X-API-TOKEN", "wrong");

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it("should return 400 if member is not found", async () => {
      const guard = await TestUtils.GetDummyGuard();
      const member = await TestUtils.GetDummyMember();
      const book = await TestUtils.GetDummyBook();

      const response = await supertest(web)
        .post("/api/borrowings")
        .send({
          memberId: member.id + 1,
          bookId: book.id,
          guardId: guard.id,
          borrowDate: "2025-07-24T00:00:00.000Z",
          dueDate: "2025-08-24T00:00:00.000Z",
        })
        .set("X-API-TOKEN", "test");

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should return 400 if book is not found", async () => {
      const guard = await TestUtils.GetDummyGuard();
      const member = await TestUtils.GetDummyMember();
      const book = await TestUtils.GetDummyBook();

      const response = await supertest(web)
        .post("/api/borrowings")
        .send({
          memberId: member.id,
          bookId: book.id + 1,
          guardId: guard.id,
          borrowDate: "2025-07-24T00:00:00.000Z",
          dueDate: "2025-08-24T00:00:00.000Z",
        })
        .set("X-API-TOKEN", "test");

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should return 400 if stock is not enough", async () => {
      const guard = await TestUtils.GetDummyGuard();
      const member = await TestUtils.GetDummyMember();
      const book = await TestUtils.GetDummyBook();

      const success = await supertest(web)
        .post("/api/borrowings")
        .send({
          memberId: member.id,
          bookId: book.id,
          guardId: guard.id,
          borrowDate: "2025-07-24T00:00:00.000Z",
          dueDate: "2025-08-24T00:00:00.000Z",
        })
        .set("X-API-TOKEN", "test");

      const fail = await supertest(web)
        .post("/api/borrowings")
        .send({
          memberId: member.id,
          bookId: book.id,
          guardId: guard.id,
          borrowDate: "2025-07-24T00:00:00.000Z",
          dueDate: "2025-08-24T00:00:00.000Z",
        })
        .set("X-API-TOKEN", "test");

      expect(fail.status).toBe(400);
      expect(fail.body.errors).toBeDefined();
    });
  });
});
