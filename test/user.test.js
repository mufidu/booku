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
        username: "test_delete",
        email: "test_delete@example.com",
        password: "password123"
      });

  it("should return an error when no ID is provided for deletion", async () => {
    const res = await chai.request(app)
      .delete('/users')
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res).to.have.status(400);
    expect(res.body).to.equal('"No user ID provided"');
  });
    userId = res.body.userId;

    // Login to obtain token
    res = await chai.request(app)
      .post("/auth/login")
      .send({
        email: "test_delete@example.com",
        password: "password123"
      });
    token = res.body.jwt;
  });

  it("should delete the user with authentication", async () => {
    const res = await chai.request(app)
      .delete('/users')
      .set("Authorization", `Bearer ${token}`)
      .send({ id: userId });

    expect(res).to.have.status(200);
    expect(res.body).to.equal('\"User deleted successfully\"');
  });
});
