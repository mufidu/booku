if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const function = express();
const methodOverride = require("method-override");
const Book = require("./models/book");
const morgan = require("morgan");

require("./db");

function.use(express.urlencoded({ extended: true }));
function.use(express.json());
function.use(methodOverride("_method"));
function.use(morgan("dev"));

const categories = Book.schema.path("category").enumValues;

function.get("/", (req, res) => {
    res.send("Booku API!");
});

// Get all books
function.get("/books", async (req, res) => {
    const books = await Book.find({});
    res.json(books);
});

// Create a new book
function.post("/books", async (req, res) => {
    let { title, author, year, category, cover } = req.body;
    const book = new Book({ title, author, year, category, cover });
    try {
        await book.save();
    } catch (e) {
        console.log(e);
    }
    res.json(book);
});

// Get a book by id
function.get("/books/:id", async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.json(book);
});

// Update a book by id
function.put("/books/:id", async (req, res) => {
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

// Delete a book by id
function.delete ("/books/:id", async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    const bookTitle = book.title;

    res.json(`${bookTitle} deleted`);
});

// Get books by category
function.get("/books/category/:categoryName", async (req, res) => {
    const { categoryName } = req.params;
    if (!categories.includes(categoryName)) {
        return res.status(404).send("Invalid category");
    }
    const books = await Book.find({ category: categoryName });

    if (books.length === 0) {
        return res.status(404).send("No books found for the category");
    }

    res.json(books);
});

// Delete a book by id
function.delete ("/books/:id", async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    const bookTitle = book.title;

    res.json(`${bookTitle} deleted`);
});

const port = process.env.PORT || 8080;

function.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = function;
