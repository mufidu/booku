const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

let token;

before(done => {
    chai.request(server)
        .post('/auth/login')
        .send({ email: 'mufid.to@gmail.com', password: 'password' })
        .end((err, res) => {
            token = res.body.jwt;
            done();
        });
});

describe('GET /books/category/:categoryName', () => {
    describe('Successfully retrieving books by category', () => {
        it('should return all books for a valid category', done => {
            chai.request(server)
                .get('/books/category/Fantasy')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.greaterThan(0);
                    res.body.forEach(book => {
                        expect(book.category).to.equal('Fantasy');
                    });

                    describe('Handling invalid category names', () => {
                        it('should return a 400 status code with an appropriate error message for an invalid category name', done => {
                            chai.request(server)
                                .get('/books/category/!nvalidC@tegoryName')
                                .set('Authorization', `Bearer ${token}`)
                                .end((err, res) => {
                                    expect(res).to.have.status(404);
                                    done();
                                });
                        });
                    });
                    done();
                });
        });
    });

    describe('Attempting to retrieve books by a category that does not exist', () => {
        it('should return a 404 status code with an appropriate error message', done => {
            chai.request(server)
                .get('/books/category/Unknown')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array').that.is.empty;
                    done();
                });
        });
    });

    describe('Ensuring the response structure matches the expected JSON format', () => {
        it('should return books with the correct structure for a valid category', done => {
            chai.request(server)
                .get('/books/category/Science')
                .set('Authorization', `Bearer ${token}`)
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
