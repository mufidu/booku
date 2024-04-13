const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const User = require("../models/user.model");

chai.use(chaiHttp);
const { expect } = chai;

describe("User API", () => {
  let testUserId;

  afterEach(async () => {
    if (testUserId) {
      await User.findByIdAndDelete(testUserId);
    }
  });

  it("should delete a user on /user/delete/:id DELETE", async () => {
    const user = new User({
      username: "testUser",
      email: "testUser@example.com",
      password: "password123"
    });
    const savedUser = await user.save();
    testUserId = savedUser._id;

    const res = await chai.request(app).delete(`/user/delete/${testUserId}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message").eql("User deleted successfully");

    const deletedUser = await User.findById(testUserId);
    expect(deletedUser).to.be.null;
  });
});
