require('dotenv').config();
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
        email: process.env.TEST_EMAIL,
        password: process.env.TEST_PASSWORD
      });
    userId = res.body.userId;

    // Login to obtain token
    res = await chai.request(app)
      .post("/auth/login")
      .send({
        email: process.env.DELETE_TEST_EMAIL,
        password: process.env.DELETE_TEST_PASSWORD
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
