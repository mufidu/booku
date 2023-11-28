const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const Book = require('../models/book');

chai.use(chaiHttp);
const { expect } = chai;

describe('Book API', () => {
    // Test for GET route "/"
    it('should return Hello World on / GET', async () => {
        const res = await chai.request(app).get('/');
        expect(res.text).to.equal('Hello World!');
    });

    // Test for GET route "/books"
    it('should get all books on /books GET', async () => {
        const res = await chai.request(app).get('/books');
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('title').eql(book.title);
    });

    // Test for POST route "/books"
    it('should post a new book on /books POST', async function () {
        const book = {
            title: 'Test Book',
            author: 'Test Author',
            year: 2022,
            category: 'Science',
            cover: 'Test Cover'
        };
        const res = await chai.request(app).post('/books').send(book);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('title').eql(book.title);
    });

    // Test for GET route "/books/:id"
    it('should get a single book on /books/:id GET', async () => {
        const book = new Book({
            title: 'Test Book',
            author: 'Test Author',
            year: 2022,
            category: 'Science',
            cover: 'Test Cover'
        });
        await book.save();
        const res = await chai.request(app).get(`/books/${book.id}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('title').eql(book.title);
    });

    // Test for PUT route "/books/:id"
    it('should update a book on /books/:id PUT', async () => {
        const book = new Book({
            title: 'Test Book',
            author: 'Test Author',
            year: 2022,
            category: 'Science',
            cover: 'Test Cover'
        });
        await book.save();
        const res = await chai.request(app).put(`/books/${book.id}`).send({ title: 'Updated Test Book' });
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('title').eql('Updated Test Book');
    });

    // Test for DELETE route "/books/:id"
    it('should delete a book on /books/:id DELETE', async () => {
        const book = new Book({
            title: 'Test Book',
            author: 'Test Author',
            year: 2022,
expect(res.body).to.be.a('object');
expect(res.body).to.have.property('title').eql(book.title);
            category: 'Science',
            cover: 'Test Cover'
        });
        await book.save();
        const res = await chai.request(app).delete(`/books/${book.id}`);
        expect(res).to.have.status(200);
        expect(res.body).to.equal(`${book.title} deleted`);
    });
});