const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.get("/books", async (req, res) => {
    let query = {};
    if (req.query.title) {
        query.title = new RegExp(req.query.title, 'i');
    }
    if (req.query.author) {
        query.author = new RegExp(req.query.author, 'i');
    }
    if (req.query.category) {
        query.category = req.query.category;
    }
    Book.find(query).then(books => {
        res.json(books);
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error fetching books");
    });
});

router.post("/books", async (req, res) => {
    let { title, author, year, category, cover } = req.body;
    const book = new Book({ title, author, year, category, cover });
    try {
        await book.save();
    } catch (e) {
        res.status(500).json({ message: 'Failed to save the book', error: e.message });
    }
    res.json(book);
});

router.get("/books/:id", async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
});

router.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, year, category, cover } = req.body;
    const book = await Book.findByIdAndUpdate(
        id,
        { title, author, year, category, cover },
        { new: true },
    );
    if (!book) {
        return res.status(404).send("Book not found");
    }
    res.json(book);
});

router.delete("/books/:id", async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
        return res.status(404).send("Book not found");
    }
    res.json(`${book.title} deleted`);
});

router.get("/books/category/:categoryName", async (req, res) => {
    const { categoryName } = req.params;
    const books = await Book.find({ category: categoryName });
    if (books.length === 0) {
        return res.status(404).send("No books found for the category");
    }
    res.json(books);
});

module.exports = router;
