const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
const { expect } = chai;

let token, userId;

describe("User API", () => {
  before(async () => {
    // Register a new user
    let res = await chai.request(app)
      .post("/user/register")
      .send({ username: "testUser", email: "testuser@example.com", password: "password123" });
    userId = res.body.user._id;

    // Login to get token
    res = await chai.request(app)
      .post("/user/login")
      .send({ email: "testuser@example.com", password: "password123" });
    token = res.body.token;
  });

  it("should delete a user on /user/:id DELETE", async () => {
    const res = await chai.request(app)
      .delete(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message', 'User deleted successfully');
  });

  after(async () => {
    // Cleanup: Attempt to delete the test user if it still exists
    await chai.request(app)
      .delete(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
  });
});
