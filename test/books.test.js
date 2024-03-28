const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /books/category/:categoryName', () => {
  it('should return all books for a given category', (done) => {
    chai.request(app)
      .get('/books/category/Fiction')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should return 404 for an invalid category', (done) => {
    chai.request(app)
      .get('/books/category/NonExistentCategory')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should return an empty array for a valid category with no books', (done) => {
    chai.request(app)
      .get('/books/category/EmptyCategory')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array').that.is.empty;
        done();
      });
  });
});
