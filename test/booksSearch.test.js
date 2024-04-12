const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
chai.use(chaiHttp);

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

describe('GET /books search functionality', () => {
  it('should return books matching the title query', (done) => {
    chai.request(server)
      .get('/books?title=Harry Potter')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.forEach(book => {
          book.title.should.include('Harry Potter');
        });
        done();
      });
  });

  it('should return books matching the author query', (done) => {
    chai.request(server)
      .get('/books?author=J.K. Rowling')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.forEach(book => {
          book.author.should.equal('J.K. Rowling');
        });
        done();
      });
  });

  it('should return books matching the category query', (done) => {
    chai.request(server)
      .get('/books?category=Fantasy')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.forEach(book => {
          book.category.should.equal('Fantasy');
        });
        done();
      });
  });

  it('should return books matching a combination of title, author, and category queries', (done) => {
    chai.request(server)
      .get('/books?title=Harry Potter&author=J.K. Rowling&category=Fantasy')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.forEach(book => {
          book.title.should.include('Harry Potter');
          book.author.should.equal('J.K. Rowling');
          book.category.should.equal('Fantasy');
        });
        done();
      });
  });

  it('should return all books when no query parameters are provided', (done) => {
    chai.request(server)
      .get('/books')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.above(0); // Assuming the database is not empty
        done();
      });
  });
});
