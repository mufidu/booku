if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const methodOverride = require("method-override");
const Book = require("./models/book");

const morgan = require("morgan");


require("./db");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(morgan("dev"));

const categories = Book.schema.path("category").enumValues;

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

// Get all books
app.get("/books", async (req, res) => {
    const books = await Book.find({});
    res.json(books);
});

// Create a new book
app.post("/books", async (req, res) => {
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
app.get("/books/:id", async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    console.log(book.title);
    res.json(book);
});

// Update a book by id
app.put('/books/:id', async (req, res) => {
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
app.delete("/books/:id", async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    const bookTitle = book.title;

    res.json(`${bookTitle} deleted`);
});

// Get books by category
app.get("/books/category/:categoryName", async (req, res) => {
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
