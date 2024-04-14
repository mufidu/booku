const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
chai.use(chaiHttp);
const { expect } = chai;

describe("User Operations", () => {
  let token, userId;

  before(async () => {
    // Register a new user
    let res = await chai.request(app)
      .post("/auth/register")
      .send({
        username: "testUser",
        email: "testuser@example.com",
        password: "password123"
      });
    userId = res.body.userId;

    // Login to obtain token
    res = await chai.request(app)
      .post("/auth/login")
      .send({
        email: "testuser@example.com",
        password: "password123"
      });
    token = res.body.jwt;
  });

  it("should delete the user with authentication", async () => {
    const res = await chai.request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.equal('\"User deleted successfully\"');

    // Verify user is deleted from the database
    const checkUser = await chai.request(app)
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(checkUser).to.have.status(404);
  });
});
