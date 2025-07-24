import supertest from "supertest";
import { TestUtils } from "./utils";
import { web } from "../src/applications/web";
import { logger } from "../src/applications/logger";

describe("Member", () => {
  describe("POST /api/members", () => {
    beforeEach(async () => {
      await TestUtils.CreateDummyGuard();
    });

    afterEach(async () => {
      await TestUtils.DeleteDummyMember();
      await TestUtils.DeleteDummyGuard();
    });

    it("should create a new member", async () => {
      const response = await supertest(web)
        .post("/api/members")
        .send({
          name: "member-test-123",
          email: "member-test-123@test.com",
          phone: "011111111111",
        })
        .set("X-API-TOKEN", "test");

      logger.info(response);

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe("member-test-123");
      expect(response.body.data.email).toBe("member-test-123@test.com");
      expect(response.body.data.phone).toBe("011111111111");
    });

    it("should should failed to create a new member if the request is invalid", async () => {
      const response = await supertest(web)
        .post("/api/members")
        .send({
          name: "",
          email: "",
          phone: "",
        })
        .set("X-API-TOKEN", "test");

      logger.info(response);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should should failed to create a new member if the token is wrong", async () => {
      const response = await supertest(web)
        .post("/api/members")
        .send({
          name: "member-test-123",
          email: "member-test-123@test.com",
          phone: "011111111111",
        })
        .set("X-API-TOKEN", "wrong");

      logger.info(response);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/members", () => {
    beforeEach(async () => {
      await TestUtils.CreateDummyGuard();
      await TestUtils.CreateDummyMember();
    });

    afterEach(async () => {
      await TestUtils.DeleteDummyMember();
      await TestUtils.DeleteDummyGuard();
    });

    it("should return all members with pagging", async () => {
      const response = await supertest(web)
        .get("/api/members")
        .set("X-API-TOKEN", "test");

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.pagging).toBeDefined();
    });

    it("should return the members based on the name", async () => {
      const response = await supertest(web)
        .get("/api/members")
        .query({
          name: "member-test-123",
          page: 1,
          size: 5,
        })
        .set("X-API-TOKEN", "test");

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();

      expect(response.body.data.length).toBeGreaterThan(0);
      const firstItem = response.body.data[0];
      expect(firstItem.name).toContain("member-test-123");
    });

    it("should return the members based on the email", async () => {
      const response = await supertest(web)
        .get("/api/members")
        .query({
          email: "member-test-123@test.com",
          page: 1,
          size: 5,
        })
        .set("X-API-TOKEN", "test");

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();

      expect(response.body.data.length).toBeGreaterThan(0);
      const firstItem = response.body.data[0];
      expect(firstItem.email).toContain("member-test-123@test.com");
    });

    it("should return the members based on the phone", async () => {
      const response = await supertest(web)
        .get("/api/members")
        .query({
          phone: "011111111111",
          page: 1,
          size: 5,
        })
        .set("X-API-TOKEN", "test");

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();

      expect(response.body.data.length).toBeGreaterThan(0);
      const firstItem = response.body.data[0];
      expect(firstItem.phone).toContain("011111111111");
    });

    it("should return right page and size on the pagging", async () => {
      const response = await supertest(web)
        .get("/api/members")
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

    it("should should failed to get members if the token is wrong", async () => {
      const response = await supertest(web)
        .get("/api/members")
        .set("X-API-TOKEN", "wrong");

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });
});
