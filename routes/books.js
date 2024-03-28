const express = require('express');
const Book = require('../models/book.js');
const router = express.Router();

router.get('/by-author/:authorName', (req, res) => {
    Book.find({ author: req.params.authorName })
        .then(books => res.json(books))
        .catch(err => res.status(500).json({ message: "Error fetching books by author", error: err }));
});

module.exports = router;
