const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const User = require("../models/user.model");

chai.use(chaiHttp);
const { expect } = chai;

describe("User API", () => {
    describe("/register endpoint", () => {
        it("should successfully register a new user", async () => {
            const res = await chai.request(app).post("/register").send({
                username: "newUser",
                email: "newuser@example.com",
                password: "password123"
            });
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("userId");
        });

        it("should return an error for email already registered", async () => {
            const res = await chai.request(app).post("/register").send({
                username: "existingUser",
                email: "existing@example.com",
                password: "password123"
            });
            expect(res).to.have.status(400);
            expect(res.text).to.equal("Email already registered");
        });
    });

    describe("/login endpoint", () => {
        it("should successfully login with valid credentials", async () => {
            const res = await chai.request(app).post("/login").send({
                email: "user@example.com",
                password: "password123"
            });
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("jwt");
        });

        it("should return invalid credentials error", async () => {
            const res = await chai.request(app).post("/login").send({
                email: "user@example.com",
                password: "wrongpassword"
            });
            expect(res).to.have.status(401);
            expect(res.text).to.equal("Invalid credentials");
        });
    });

    describe("/profile GET endpoint", () => {
        it("should successfully retrieve user profile with valid token", async () => {
            // Assuming getToken() is a mock function that retrieves a valid token
            const token = getToken("user@example.com");
            const res = await chai.request(app).get("/profile").set("Authorization", `Bearer ${token}`);
            expect(res).to.have.status(200);
            expect(res.body).to.include.keys("username", "email", "password");
        });

        it("should return authentication failure without valid token", async () => {
            const res = await chai.request(app).get("/profile");
            expect(res).to.have.status(401);
            expect(res.text).to.equal("Authentication failed");
        });
    });

    describe("/profile PUT endpoint", () => {
        it("should successfully update user profile with valid token", async () => {
            const token = getToken("user@example.com");
            const res = await chai.request(app).put("/profile").set("Authorization", `Bearer ${token}`).send({
                username: "updatedUser",
                email: "updated@example.com",
                password: "newpassword123"
            });
            expect(res).to.have.status(200);
            expect(res.body).to.include.keys("username", "email", "password");
        });

        it("should return authentication failure without valid token", async () => {
            const res = await chai.request(app).put("/profile");
            expect(res).to.have.status(401);
            expect(res.text).to.equal("Authentication failed");
        });

        it("should return validation error for invalid email format", async () => {
            const token = getToken("user@example.com");
            const res = await chai.request(app).put("/profile").set("Authorization", `Bearer ${token}`).send({
                username: "user",
                email: "notanemail",
                password: "password123"
            });
            expect(res).to.have.status(400);
            expect(res.text).to.equal("Invalid email format");
        });
    });
});

function getToken(email) {
    // This is a placeholder for a function that would return a valid JWT token for testing
    return "valid.token.here";
}
