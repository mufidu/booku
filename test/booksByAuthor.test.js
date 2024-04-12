const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('GET /books/author/:authorName', () => {
    let token;
    before(done => {
        chai.request(server)
            .post('/user/login')
            .send({email: 'mufid.to@gmail.com', password: 'password'})
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });
  it('should retrieve books by an existing author', async () => {
    const authorName = 'John Doe';
    const res = await chai.request(server).get(`/books/author/${authorName}`).set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    res.body.forEach(book => {
      expect(book.author).to.equal(authorName);
    });
  });

  it('should return an empty array for a non-existing author', async () => {
    const authorName = 'NonExisting Author';
    const res = await chai.request(server).get(`/books/author/${authorName}`).set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array').that.is.empty;
  });

  
});
