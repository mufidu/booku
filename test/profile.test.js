const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Profile Routes', function () {
  let token;

  before(async function () {
    const loginResponse = await chai.request(app)
      .post('/auth/login')
      .send({ email: 'mufid.to@gmail.com', password: 'password' });
    token = loginResponse.body.jwt;
  });

  describe('GET /profile', function () {
    it('should retrieve the user profile successfully', async function () {
      const res = await chai.request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body).to.include.keys('username', 'email');
    });

    it('should return an error for unauthorized access', async function () {
      const res = await chai.request(app)
        .get('/profile');
      expect(res).to.have.status(401);
    });
  });

  describe('PUT /profile', function () {
    it('should update the user profile successfully', async function () {
      const res = await chai.request(app)
        .put('/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'NewUsername', email: 'newemail@example.com' });
      expect(res).to.have.status(200);
      expect(res.body).to.include({ username: 'NewUsername', email: 'newemail@example.com' });

      // Change back to the original data
      await chai.request(app)
        .put('/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'mufid', email: 'mufid.to@gmail.com' });
    });

    it('should return an error for unauthorized access', async function () {
      const res = await chai.request(app)
        .put('/profile')
        .send({ username: 'UnauthorizedUser', email: 'unauthorized@example.com' });
      expect(res).to.have.status(401);
    });

    it('should return a validation error for invalid data', async function () {
      const res = await chai.request(app)
        .put('/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'invalidemail' });
      expect(res).to.have.status(400);
    });
  });
});
