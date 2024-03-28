const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('GET /books/author/:authorName', () => {
  it('should retrieve books by an existing author', async () => {
    const authorName = 'John Doe';
    const res = await chai.request(server).get(`/books/author/${authorName}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    res.body.forEach(book => {
      expect(book.author).to.equal(authorName);
    });
  });

  it('should return an empty array for a non-existing author', async () => {
    const authorName = 'NonExisting Author';
    const res = await chai.request(server).get(`/books/author/${authorName}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array').that.is.empty;
  });

  it('should handle invalid author names', async () => {
    const authorName = 'Invalid123';
    const res = await chai.request(server).get(`/books/author/${authorName}`);
    expect(res).to.have.status(400);
    expect(res.body).to.have.property('message').that.includes('Error fetching books by author');
  });
});
