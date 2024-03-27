const express = require('express');
const Book = require('../models/book');
const router = express.Router();

router.post('/books', async (req, res) => {
    const { title, author, year, category, cover } = req.body;
    const newBook = new Book({
        title,
        author,
        year,
        category,
        cover
    });

    try {
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save the book' });
    }
});

module.exports = router;
