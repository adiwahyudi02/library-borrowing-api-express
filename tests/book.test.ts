import supertest from "supertest";
import { TestUtils } from "./utils";
import { web } from "../src/applications/web";
import { logger } from "../src/applications/logger";

describe("Book", () => {
  describe("POST /api/books", () => {
    beforeEach(async () => {
      await TestUtils.CreateDummyGuard();
    });

    afterEach(async () => {
      await TestUtils.DeleteDummyBook();
      await TestUtils.DeleteDummyGuard();
    });

    it("should create a new book", async () => {
      const response = await supertest(web)
        .post("/api/books")
        .send({
          title: "title-test-123",
          author: "author-test-123",
          stock: 1,
        })
        .set("X-API-TOKEN", "test");

      logger.info(response);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe("title-test-123");
      expect(response.body.data.author).toBe("author-test-123");
      expect(response.body.data.stock).toBe(1);
    });

    it("should should failed to create a new book if the request is invalid", async () => {
      const response = await supertest(web)
        .post("/api/books")
        .send({
          title: "title-test-123",
          author: "author-test-123",
          stock: 0,
        })
        .set("X-API-TOKEN", "test");

      logger.info(response);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should should failed to create a new book if the token is wrong", async () => {
      const response = await supertest(web)
        .post("/api/books")
        .send({
          title: "title-test-123",
          author: "author-test-123",
          stock: 1,
        })
        .set("X-API-TOKEN", "wrong");

      logger.info(response);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/books", () => {
    beforeEach(async () => {
      await TestUtils.CreateDummyBook();
    });

    afterEach(async () => {
      await TestUtils.DeleteDummyBook();
    });

    it("should return all books with pagging", async () => {
      const response = await supertest(web).get("/api/books");

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.pagging).toBeDefined();
    });

    it("should return the book based on title", async () => {
      const response = await supertest(web).get("/api/books").query({
        title: "title-test-123",
        page: 1,
        size: 5,
      });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();

      expect(response.body.data.length).toBeGreaterThan(0);
      const firstItem = response.body.data[0];
      expect(firstItem.title).toContain("title-test-123");
    });

    it("should return the book based on author", async () => {
      const response = await supertest(web).get("/api/books").query({
        author: "author-test-123",
        page: 1,
        size: 5,
      });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();

      expect(response.body.data.length).toBeGreaterThan(0);
      const firstItem = response.body.data[0];
      expect(firstItem.author).toContain("author-test-123");
    });

    it("should return right page and size on the pagging", async () => {
      const response = await supertest(web).get("/api/books").query({
        page: 2,
        size: 5,
      });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.pagging.current_page).toBe(2);
      expect(response.body.pagging.size_page).toBe(5);
    });
  });
});
