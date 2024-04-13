const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
chai.use(chaiHttp);
const { expect } = chai;

describe("User API", () => {
  let userId;

  it("should create a new user and then delete it", async () => {
    // Create a new user
    const user = {
      username: "testUser",
      email: "testuser@example.com",
      password: "password123"
    };

    let res = await chai.request(app).post("/user/register").send(user);
    expect(res).to.have.status(201);
    userId = res.body.userId;

    // Delete the user
    res = await chai.request(app).delete(`/user/delete/${userId}`);
    expect(res).to.have.status(200);
    expect(res.body.message).to.equal('User deleted successfully');

    // Optionally, verify the user is deleted
    res = await chai.request(app).get(`/user/${userId}`);
    expect(res).to.have.status(404);
  });
});
