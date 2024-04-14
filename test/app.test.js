require('dotenv').config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const Book = require("../models/book");

chai.use(chaiHttp);
const { expect } = chai;

let token;

before(async () => {
    try {
        const res = await chai.request(app)
            .post("/auth/login")
            .send({ email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD });
        token = res.body.jwt;
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
});

describe("Book API", () => {
    // Test for GET route "/books"
    it("should get all books on /books GET", async () => {
        const res = await chai.request(app).get("/books").set("Authorization", `Bearer ${token}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("array");
    });

    // Test for POST route "/books"
    it("should post a new book on /books POST", async function () {
        const book = {
            title: "Test Book",
            author: "Test Author",
            year: 2022,
            category: "Science",
            cover: "Test Cover",
        };
        const res = await chai.request(app).post("/books").send(book).set("Authorization", `Bearer ${token}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("title").eql(book.title);
    });

    // Test for GET route "/books/:id"
    it("should get a book by id on /books/:id GET", async () => {
        const book = new Book({
            title: "Test Book",
            author: "Test Author",
            year: 2022,
            category: "Science",
            cover: "Test Cover",
        });
        await book.save();
        const res = await chai.request(app).get(`/books/${book.id}`).set("Authorization", `Bearer ${token}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("title").eql(book.title);
        expect(res.body).to.have.property("author").eql(book.author);
        expect(res.body).to.have.property("year").eql(book.year);
        expect(res.body).to.have.property("category").eql(book.category);
        expect(res.body).to.have.property("cover").eql(book.cover);
    });

    // Test for PUT route "/books/:id"
    it("should update a book on /books/:id PUT", async () => {
        const book = new Book({
            title: "Test Book",
            author: "Test Author",
            year: 2022,
            category: "Science",
            cover: "Test Cover",
        });
        await book.save();
        const res = await chai
            .request(app)
            .put(`/books/${book.id}`)
            .send({ title: "Updated Test Book" })
            .set("Authorization", `Bearer ${token}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("title").eql("Updated Test Book");
    });

    // Test for DELETE route "/books/:id"
    it("should delete a book on /books/:id DELETE", async () => {
        const book = new Book({
            title: "Test Book",
            author: "Test Author",
            year: 2022,
            category: "Science",
            cover: "Test Cover",
        });
        await book.save();
        const res = await chai.request(app).delete(`/books/${book.id}`).set("Authorization", `Bearer ${token}`);
        expect(res).to.have.status(200);
        expect(res.body).to.equal(`${book.title} deleted`);
    });
});
