const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
chai.use(chaiHttp);
const { expect } = chai;

describe("User endpoint tests", function() {
  let token, userId;

  before(async () => {
    // Register a new user
    let res = await chai.request(app)
      .post('/user/register')
      .send({ username: "testUser", email: "testUser@example.com", password: "password" });
    expect(res).to.have.status(200);

    // Login the user
    res = await chai.request(app)
      .post('/user/login')
      .send({ email: "testUser@example.com", password: "password" });
    expect(res).to.have.status(200);
    token = res.body.token;
    userId = res.body.user.id;
  });

  it("should delete a user successfully", async () => {
    const res = await chai.request(app)
      .delete(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body.message).to.equal('User deleted successfully');

    // Verify user is deleted by attempting to fetch the user
    const fetchDeletedUser = await chai.request(app)
      .get(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(fetchDeletedUser).to.have.status(404);
  });
});
