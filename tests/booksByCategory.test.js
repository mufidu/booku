const request = require('supertest');
const app = require('../app');
jest.mock('../models/book', () => ({
  find: jest.fn()
}));

const Book = require('../models/book');

describe('GET /books/category/:categoryName', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return books for a valid category', async () => {
    const mockBooks = [
      { title: 'Book One', category: 'Fiction' },
      { title: 'Book Two', category: 'Fiction' }
    ];
    Book.find.mockResolvedValue(mockBooks);

    const response = await request(app).get('/books/category/Fiction');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockBooks);
    expect(Book.find).toHaveBeenCalledWith({ category: 'Fiction' });
  });

  test('should return 404 for an invalid category', async () => {
    Book.find.mockResolvedValueOnce([]);
    const response = await request(app).get('/books/category/InvalidCategory');
    expect(response.status).toBe(404);
    expect(response.text).toBe('Invalid category');
  });

  test('should return 404 with no books found for a valid category', async () => {
    Book.find.mockResolvedValue([]);
    const response = await request(app).get('/books/category/NonexistentCategory');
    expect(response.status).toBe(404);
    expect(response.text).toBe('No books found for the category');
  });
});
