const express = require('express');
const router = express.Router();
const Book = require('../models/book.model.js');

// Get all books with optional search
router.get("/", async (req, res) => {
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

// Create a new book
router.post("/", async (req, res) => {
    let { title, author, year, category, cover } = req.body;
    const book = new Book({ title, author, year, category, cover });
    try {
        await book.save();
    } catch (e) {
        res.status(500).json({ message: 'Failed to save the book', error: e.message });
    }
    res.json(book);
});

// Get a book by id
router.get("/:id", async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    console.log(book.title);
    res.json(book);
});

// Update a book by id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, year, category, cover } = req.body;

    try {
        const book = await Book.findByIdAndUpdate(id,
            { title, author, year, category, cover },
            { new: true });

        if (!book) {
            return res.status(404).send("Book not found");
        }

        res.json(book);
    } catch (e) {
        res.status(500).json({ message: 'Database operation failed', error: e.message });
    }
});

// Delete a book by id
router.delete("/:id", async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    const bookTitle = book.title;

    res.json(`${bookTitle} deleted`);
});

// Get books by category
router.get("/category/:categoryName", async (req, res) => {
    const { categoryName } = req.params;
    // If string is invalid (contains non-alphabetic characters), return 404
    if (!validateInput('category', categoryName)) {
        return res.status(404).send("Invalid category");
    }
    const books = await Book.find({ category: categoryName });

    if (books.length === 0) {
        // Return empty array if no books found
        return res.json([]);
    } else {
        res.json(books);
    }
});

// Get books by author
router.get("/author/:authorName", async (req, res) => {
    const { authorName } = req.params;
    const books = await Book.find({ author: new RegExp(authorName, 'i') });

    if (!/^[a-zA-Z\s]+$/.test(authorName)) {
        return res.status(404).send("Invalid author");
    }

    if (books.length === 0) {
        return res.json([]);
    } else {
        res.json(books);
    }
});

module.exports = router;