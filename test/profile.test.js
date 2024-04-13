const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
chai.use(chaiHttp);
const { expect } = chai;

describe("Profile API", () => {
  let token;

  before(async () => {
    const loginResponse = await chai.request(app).post("/user/login").send({ email: "mufid.to@gmail.com", password: "password" });
    token = loginResponse.body.jwt;
  });

  describe("GET /profile", () => {
    it("should retrieve the user's profile when authenticated", async () => {
      const res = await chai.request(app).get("/profile").set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("username");
      expect(res.body).to.have.property("email");
      expect(res.body).not.to.have.property("password");
    });

    it("should return 401 Unauthorized when no token is provided", async () => {
      const res = await chai.request(app).get("/profile");
      expect(res).to.have.status(401);
    });
  });

  describe("PUT /profile", () => {
    it("should update the user's profile when authenticated", async () => {
      const updatedInfo = { username: "UpdatedUser", email: "updated.email@gmail.com" };
      const res = await chai.request(app).put("/profile").set("Authorization", `Bearer ${token}`).send(updatedInfo);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("message", "Profile updated successfully");
      expect(res.body.user).to.include(updatedInfo);
    });

    it("should return 401 Unauthorized when no token is provided", async () => {
      const res = await chai.request(app).put("/profile");
      expect(res).to.have.status(401);
    });

    it("should return 400 Bad Request when provided with invalid email format", async () => {
      const updatedInfo = { email: "invalidEmail" };
      const res = await chai.request(app).put("/profile").set("Authorization", `Bearer ${token}`).send(updatedInfo);
      expect(res).to.have.status(400);
    });
  });
});
