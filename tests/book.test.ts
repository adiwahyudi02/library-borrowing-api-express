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
          title: "test",
          author: "test",
          stock: 1,
        })
        .set("X-API-TOKEN", "test");

      logger.info(response);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe("test");
      expect(response.body.data.author).toBe("test");
      expect(response.body.data.stock).toBe(1);
    });

    it("should should failed to create a new book if the request is invalid", async () => {
      const response = await supertest(web)
        .post("/api/books")
        .send({
          title: "test",
          author: "test",
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
          title: "test",
          author: "test",
          stock: 1,
        })
        .set("X-API-TOKEN", "wrong");

      logger.info(response);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });
});
