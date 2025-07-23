import supertest from "supertest";
import { web } from "../src/applications/web";
import { TestUtils } from "./utils";

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
});
