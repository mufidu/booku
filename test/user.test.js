const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user.model');
const { setupDB, teardownDB } = require('./testHelpers');

describe('DELETE /user/delete/:id', () => {
  beforeAll(setupDB);
  afterAll(teardownDB);

  let userId;

  beforeEach(async () => {
    const user = new User({ username: 'testUser', email: 'test@example.com', password: 'password123' });
    await user.save();
    userId = user._id;
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test('should delete a user successfully', async () => {
    const response = await request(app)
      .delete(`/user/delete/${userId}`)
      .set('Authorization', 'Bearer mockToken');

    expect(response.status).toBe(200);
    expect(response.text).toBe('User successfully deleted');
    const user = await User.findById(userId);
    expect(user).toBeNull();
  });

  test('should return 404 for invalid user ID', async () => {
    const invalidUserId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/user/delete/${invalidUserId}`)
      .set('Authorization', 'Bearer mockToken');

    expect(response.status).toBe(404);
    expect(response.text).toBe('User not found');
  });

  test('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .delete(`/user/delete/${userId}`);

    expect(response.status).toBe(401);
  });
});
