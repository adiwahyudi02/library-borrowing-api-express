import supertest from "supertest";
import { TestUtils } from "./utils";
import { web } from "../src/applications/web";
import { logger } from "../src/applications/logger";
import { Borrowing } from "@prisma/client";

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

  describe("GET /api/borrowings", () => {
    beforeEach(async () => {
      await TestUtils.CreateDummyGuard();
      await TestUtils.CreateDummyMember();
      await TestUtils.CreateDummyBook();
      await TestUtils.CreateDummyBorrowing();
    });

    afterEach(async () => {
      await TestUtils.DeleteDummyBorrowing();
      await TestUtils.DeleteDummyMember();
      await TestUtils.DeleteDummyBook();
      await TestUtils.DeleteDummyGuard();
    });

    it("should return all borrowings with pagging", async () => {
      const response = await supertest(web)
        .get("/api/borrowings")
        .set("X-API-TOKEN", "test");

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.pagging).toBeDefined();
    });

    it("should return the borrowings based on the name of the member", async () => {
      const member = await TestUtils.GetDummyMember();
      const response = await supertest(web)
        .get("/api/borrowings")
        .query({
          search: member.name,
        })
        .set("X-API-TOKEN", "test");

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.length).toBeGreaterThan(0);
      const firstItem = response.body.data[0];
      expect(firstItem.member.name).toContain(member.name);
    });

    it("should return the borrowings based on the nenber email", async () => {
      const member = await TestUtils.GetDummyMember();

      const response = await supertest(web)
        .get("/api/borrowings")
        .query({
          search: member.email,
        })
        .set("X-API-TOKEN", "test");

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();

      expect(response.body.data.length).toBeGreaterThan(0);
      const firstItem = response.body.data[0];
      expect(firstItem.member.email).toContain(member.email);
    });

    it("should return the borrowings based on the title books", async () => {
      const book = await TestUtils.GetDummyBook();

      const response = await supertest(web)
        .get("/api/borrowings")
        .query({
          search: book.title,
        })
        .set("X-API-TOKEN", "test");

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();

      expect(response.body.data.length).toBeGreaterThan(0);
      const firstItem = response.body.data[0];
      expect(firstItem.book.title).toContain(book.title);
    });

    it("should return the borrowings based on the status", async () => {
      const response = await supertest(web)
        .get("/api/borrowings")
        .query({
          status: "borrowed",
        })
        .set("X-API-TOKEN", "test");

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();

      const check = response.body.data.filter(
        (item: Borrowing) => item.returnDate === null
      );

      expect(check.length).toBeGreaterThan(0);
    });

    it("should return right page and size on the pagging", async () => {
      const response = await supertest(web)
        .get("/api/borrowings")
        .query({
          page: 2,
          size: 5,
        })
        .set("X-API-TOKEN", "test");

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.pagging.current_page).toBe(2);
      expect(response.body.pagging.size_page).toBe(5);
    });

    it("should failed 401 to get borrowings if the token is wrong", async () => {
      const response = await supertest(web)
        .get("/api/borrowings")
        .set("X-API-TOKEN", "wrong");

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });
});
