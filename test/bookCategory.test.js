const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const expect = chai.expect;
const errorHandlingMiddleware = require('../middleware/errorHandlingMiddleware');

chai.use(chaiHttp);

describe('GET /books/category/:categoryName', () => {
    describe('Successfully retrieving books by category', () => {
        it('should return all books for a valid category', done => {
            chai.request(server)
                .get('/books/category/Fantasy')
                .use(errorHandlingMiddleware)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.greaterThan(0);
                    res.body.forEach(book => {
                        expect(book.category).to.equal('Fantasy');
                    });
                    done();
                });
        });
    });

    describe('Attempting to retrieve books by a category that does not exist', () => {
        it('should return a 404 status code with an appropriate error message', done => {
            chai.request(server)
                .get('/books/category/Unknown')
                .use(errorHandlingMiddleware)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.text).to.equal('Invalid category');
                    done();
                });
        });
    });

    describe('Ensuring the response structure matches the expected JSON format', () => {
        it('should return books with the correct structure for a valid category', done => {
            chai.request(server)
                .get('/books/category/Science')
                .use(errorHandlingMiddleware)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    res.body.forEach(book => {
                        expect(book).to.include.keys('title', 'author', 'year', 'category');
                        expect(book).to.not.include.keys('id', '_v');
                    });
                    done();
                });
        });
    });
});
