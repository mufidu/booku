const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user.model');

const userId = new mongoose.Types.ObjectId();
const userPayload = {
  _id: userId,
  username: 'testUser',
  email: 'test@example.com',
  password: 'password123'
};

const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '2h' });

beforeEach(async () => {
  await User.deleteMany();
  await new User(userPayload).save();
});

test('GET /profile should fetch user profile successfully', async () => {
  await request(app)
    .get('/profile')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      expect(response.body.email).toBe(userPayload.email);
      expect(response.body.username).toBe(userPayload.username);
    });
});

test('GET /profile should fail without authentication', async () => {
  await request(app)
    .get('/profile')
    .expect(401);
});

test('PUT /profile should update user profile successfully', async () => {
  const newEmail = 'newtest@example.com';
  await request(app)
    .put('/profile')
    .set('Authorization', `Bearer ${token}`)
    .send({ email: newEmail })
    .expect(200)
    .then((response) => {
      expect(response.body.email).toBe(newEmail);
    });
});

test('PUT /profile should fail without authentication', async () => {
  await request(app)
    .put('/profile')
    .expect(401);
});

test('PUT /profile should fail with invalid updates', async () => {
  await request(app)
    .put('/profile')
    .set('Authorization', `Bearer ${token}`)
    .send({ location: 'Neverland' })
    .expect(400);
});
