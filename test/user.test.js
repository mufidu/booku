const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const { expect } = chai;

chai.use(chaiHttp);

describe("User Routes", () => {
  describe("POST /user/register", () => {
    it("should register a new user successfully", async () => {
      const res = await chai.request(app).post("/user/register").send({
        username: "newUser",
        email: "newuser@example.com",
        password: "password123"
      });
      expect(res).to.have.status(201);
    });

    it("should not register a user with an already registered email", async () => {
      const res = await chai.request(app).post("/user/register").send({
        username: "existingUser",
        email: "newuser@example.com",
        password: "password123"
      });
      expect(res).to.have.status(400);
    });
  });

  describe("POST /user/login", () => {
    it("should login user successfully", async () => {
      const res = await chai.request(app).post("/user/login").send({
        email: "newuser@example.com",
        password: "password123"
      });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("jwt");
    });

    it("should not login with incorrect credentials", async () => {
      const res = await chai.request(app).post("/user/login").send({
        email: "newuser@example.com",
        password: "wrongpassword"
      });
      expect(res).to.have.status(401);
    });
  });

  describe("PUT /user/profile", () => {
    it("should update user profile successfully", async () => {
      const res = await chai.request(app).put("/user/profile").set("Authorization", "Bearer mockToken").send({
        username: "updatedUser",
        email: "updatedemail@example.com"
      });
      expect(res).to.have.status(200);
    });

    it("should not update profile without authentication", async () => {
      const res = await chai.request(app).put("/user/profile").send({
        username: "updatedUser",
        email: "updatedemail@example.com"
      });
      expect(res).to.have.status(401);
    });
  });

  describe("GET /user/profile", () => {
    it("should get user profile successfully", async () => {
      const res = await chai.request(app).get("/user/profile").set("Authorization", "Bearer mockToken");
      expect(res).to.have.status(200);
    });

    it("should not get profile without authentication", async () => {
      const res = await chai.request(app).get("/user/profile");
      expect(res).to.have.status(401);
    });
  });
});
