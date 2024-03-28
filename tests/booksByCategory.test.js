const request = require('supertest');
const app = require('../app');
const Book = require('../models/book');
jest.mock('../models/book');

describe('GET /books/category/:categoryName', () => {
  it('returns 200 and a list of books for a valid category', async () => {
    const mockBooks = [
      { title: 'Book One', author: 'Author One', category: 'Fiction' },
      { title: 'Book Two', author: 'Author Two', category: 'Fiction' }
    ];
    Book.find.mockResolvedValue(mockBooks);

    const response = await request(app).get('/books/category/Fiction');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockBooks);
    expect(Book.find).toHaveBeenCalledWith({ category: 'Fiction' });
  });

  it('returns 404 for an invalid category', async () => {
    Book.find.mockResolvedValue([]);

    const response = await request(app).get('/books/category/NonExistentCategory');
    expect(response.status).toBe(404);
    expect(response.text).toContain('No books found for the category');
    expect(Book.find).toHaveBeenCalledWith({ category: 'NonExistentCategory' });
  });
});
