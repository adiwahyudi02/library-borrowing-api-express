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
});
