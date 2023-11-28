if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const Book = require('./models/book');
const morgan = require('morgan');

const mongoose = require('mongoose');

dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/booku';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database connected!")
})

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"))

const categories = Book.schema.path('category').enumValues;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Get all books
app.get('/books', async (req, res) => {
    const books = await Book.find({});
    res.json(books);
});

// Create a new book
app.post('/books', async (req, res) => {
    let { title, author, year, category, cover } = req.body;
    const book = new Book({ title, author, year, category, cover });
    await book.save();
    res.json(book);
});

// Get a book by id
app.get('/books/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.json(book);
});

// Update a book by id
app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, year, category, cover } = req.body;

    const book = await Book.findByIdAndUpdate(id, { title, author, year, category, cover });

    if (!book) {
        return res.status(404).send("Book not found");
    }

    res.json(book);
});

// Delete a book by id
app.delete('/books/:id', async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    const bookTitle = book.title;

    res.json(`${bookTitle} deleted`);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
