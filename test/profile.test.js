const request = require('supertest');
const app = require('../app');
let token;

beforeAll(async () => {
  const response = await request(app)
    .post('/auth/login')
    .send({
      email: 'mufid.to@gmail.com',
      password: 'password'
    });
  token = response.body.token;
});

describe('GET /profile', () => {
  it('should return the user profile for a valid token', async () => {
    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('password');
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .get('/profile');
    expect(response.statusCode).toBe(401);
  });
});

describe('PUT /profile', () => {
  it('should update the user profile for valid data and token', async () => {
    const updatedData = {
      username: 'newUsername',
      email: 'newEmail@gmail.com',
      password: 'newPassword'
    };
    const response = await request(app)
      .put('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(updatedData.username);
    expect(response.body.email).toBe(updatedData.email);
    expect(response.body.password).toBe(updatedData.password);
  });

  it('should return 400 for invalid user data', async () => {
    const invalidData = {
      username: '',
      email: 'notAnEmail',
      password: ''
    };
    const response = await request(app)
      .put('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData);
    expect(response.statusCode).toBe(400);
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .put('/profile')
      .send({
        username: 'anotherUsername',
        email: 'anotherEmail@gmail.com',
        password: 'anotherPassword'
      });
    expect(response.statusCode).toBe(401);
  });
});
