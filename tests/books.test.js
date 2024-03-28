const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Book = require('../models/book');

describe('/books/category/:categoryName endpoint', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 200 and an array of books for a valid category that exists', async () => {
    const response = await request(app).get('/books/category/Fiction');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return 404 and an error message for a valid category with no books', async () => {
    const response = await request(app).get('/books/category/NonexistentCategory');
    expect(response.statusCode).toBe(404);
    expect(response.text).toContain('No books found for the category');
  });

  it('should return 404 and an error message for an invalid category', async () => {
    const response = await request(app).get('/books/category/InvalidCategory');
    expect(response.statusCode).toBe(404);
    expect(response.text).toContain('Invalid category');
  });
});
