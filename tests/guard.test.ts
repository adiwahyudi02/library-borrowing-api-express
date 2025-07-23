import supertest from "supertest";
import { web } from "../src/applications/web";
import { TestUtils } from "./utils";
import { logger } from "../src/applications/logger";

describe("Guard", () => {
  describe("/api/guards/register", () => {
    afterEach(async () => {
      await TestUtils.DeleteDummyGuard();
    });

    it("should register a new guard", async () => {
      const response = await supertest(web).post("/api/guards/register").send({
        name: "test",
        email: "test@test.com",
        password: "test",
      });

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe("test");
      expect(response.body.data.email).toBe("test@test.com");
    });

    it("should should failed to register a new guard if the request is invalid", async () => {
      const response = await supertest(web).post("/api/guards/register").send({
        name: "",
        email: "",
        password: "",
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("/api/guards/login", () => {
    beforeEach(async () => {
      await TestUtils.CreateDummyGuard();
    });

    afterEach(async () => {
      await TestUtils.DeleteDummyGuard();
    });

    it("should login successfully", async () => {
      const response = await supertest(web).post("/api/guards/login").send({
        email: "test@test.com",
        password: "test",
      });

      logger.info(response);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.name).toBe("test");
      expect(response.body.data.email).toBe("test@test.com");
      expect(response.body.data.access_token).toBeDefined();
    });

    it("should should failed to login if the request is invalid", async () => {
      const response = await supertest(web).post("/api/guards/login").send({
        email: "",
        password: "",
      });

      logger.info(response);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should should failed to login if the email is wrong", async () => {
      const response = await supertest(web).post("/api/guards/login").send({
        email: "wrong@test.com",
        password: "test",
      });

      logger.info(response);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should should failed to login if the password is wrong", async () => {
      const response = await supertest(web).post("/api/guards/login").send({
        email: "test@test.com",
        password: "wrong",
      });

      logger.info(response);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("/api/guards/me", () => {
    beforeEach(async () => {
      await TestUtils.CreateDummyGuard();
    });

    afterEach(async () => {
      await TestUtils.DeleteDummyGuard();
    });

    it("should return the current logged-in guard", async () => {
      const response = await supertest(web)
        .get("/api/guards/me")
        .set("X-API-TOKEN", "test");

      logger.info(response);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.name).toBe("test");
      expect(response.body.data.email).toBe("test@test.com");
    });

    it("should not return the Unauthorized error if token is invalid", async () => {
      const response = await supertest(web)
        .get("/api/guards/me")
        .set("X-API-TOKEN", "wrong");

      logger.info(response);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });
});
