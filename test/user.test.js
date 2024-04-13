const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('DELETE /user/delete endpoint', () => {
  let token;

  beforeEach(async () => {
    const authResponse = await chai.request(server)
      .post('/user/login')
      .send({ email: 'test.user@example.com', password: 'password' });
    token = authResponse.body.jwt;
  });

  it('should successfully delete a user', async () => {
    const res = await chai.request(server)
      .delete('/user/delete')
      .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.text).to.equal('User successfully deleted');
  });

  it('should not allow unauthorized deletion attempt', async () => {
    const res = await chai.request(server)
      .delete('/user/delete');
    expect(res).to.have.status(401);
  });

  it('should return 404 for deletion of a non-existent user', async () => {
    await chai.request(server)
      .delete('/user/delete')
      .set('Authorization', `Bearer ${token}`);
    const res = await chai.request(server)
      .delete('/user/delete')
      .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(404);
  });
});
