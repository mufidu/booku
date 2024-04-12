if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const methodOverride = require("method-override");
const bookRoutes = require('./routes/book.routes.js');

const morgan = require("morgan");
const session = require('express-session');
const userRoutes = require('./routes/user.routes.js');
const authenticateToken = require('./middleware/auth.middleware.js');


require("./db");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? false : true }
}));

app.use('/user', userRoutes);

// Apply authentication middleware to protect routes




app.get("/", (req, res) => {
    Book.countDocuments({}, (err, count) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error fetching books count");
        } else {
            res.send(`Books count: ${count}`);
        }
    });
});

// Get all books with optional search


// Create a new book


// Get a book by id
app.get("/books/:id", async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    console.log(book.title);
    res.json(book);
});

// Update a book by id


// Delete a book by id
app.delete("/books/:id", async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    const bookTitle = book.title;

    res.json(`${bookTitle} deleted`);
});

// Get books by category


// Get books by author
app.get("/books/author/:authorName", async (req, res) => {
    const { authorName } = req.params;
    try {
        const books = await Book.find({ author: new RegExp(authorName, 'i') });
        res.json(books);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching books by author");
    }
});

// Delete a book by id
app.delete("/books/:id", async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    const bookTitle = book.title;

    res.json(`${bookTitle} deleted`);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
