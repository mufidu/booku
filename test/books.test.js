const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('GET /books/by-author/:authorName', () => {
    it('should fetch books by a specific author', (done) => {
        chai.request(app)
            .get('/books/by-author/John Doe')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                if (res.body.length > 0) {
                    expect(res.body[0]).to.have.property('author');
                    expect(res.body[0].author).to.equal('John Doe');
                }
                done();
            });
    });
});
