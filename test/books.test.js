const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
chai.use(chaiHttp);
const { expect } = chai;

describe('GET /books/category/:categoryName', () => {
  it('should get all books by category', (done) => {
    chai.request(server)
      .get('/books/category/Fiction')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        res.body.forEach(book => {
          expect(book.category).to.equal('Fiction');
        });
        done();
      });
  });
});
