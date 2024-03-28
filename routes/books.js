const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.get('/category/:categoryName', async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const books = await Book.find({ category: categoryName });
    res.json(books);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
