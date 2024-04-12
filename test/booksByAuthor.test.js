const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

let token;

before(done => {
  chai.request(server)
    .post('/user/login')
    .send({ email: 'mufid.to@gmail.com', password: 'password' })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
});

describe('GET /books/author/:authorName', () => {
  it('should retrieve books by an existing author', async () => {
    const authorName = 'Tere Liye';
    const res = await chai.request(server).get(`/books/author/${authorName}`).set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    res.body.forEach(book => {
      expect(book.author).to.equal(authorName);
    });

    it('should return books with the correct structure for a valid author name', async () => {
      const authorName = 'Valid Author';
      const res = await chai.request(server).get(`/books/author/${authorName}`).set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      res.body.forEach(book => {
        expect(book).to.include.keys('title', 'author', 'year', 'category');
        expect(book).to.not.have.any.keys('id', '_v');
      });
    });

  });

});

it('should handle invalid author names gracefully', async () => {
  const invalidAuthorName = '@!#Invalid123';
  const res = await chai.request(server).get(`/books/author/${invalidAuthorName}`).set('Authorization', `Bearer ${token}`);
  expect(res).to.have.status(404);
  if (res.status === 200) {
    expect(res.body).to.be.an('array').that.is.empty;
  }
});

it('should return an empty array for a non-existing author', async () => {
  const authorName = 'NonExisting Author';
  const res = await chai.request(server).get(`/books/author/${authorName}`).set('Authorization', `Bearer ${token}`);
  expect(res).to.have.status(200);
  expect(res.body).to.be.an('array').that.is.empty;
});


});
