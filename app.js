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

app.get('/books', async (req, res) => {
    const books = await Book.find({});
    res.json(books);
});

app.get('/books/new', async (req, res) => {
    res.json(categories);
});

app.post('/books', async (req, res) => {
    let { title, author, year, category, cover } = req.body;
    const book = new Book({ title, author, year, category, cover });
    await book.save();
    res.json(book);
});

app.get('/books/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.json(book);
});

app.get('/books/:id/edit', async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.json(book);
});

app.put('/books/:id', async (req, res) => {
    let { title, author, year, category, cover } = req.body;
    await Book.findByIdAndUpdate(req.params.id, { title, author, year, category, cover });
    res.json(await Book.findById(req.params.id));
});

app.delete('/books/:id', async (req, res) => {
    res.json(await Book.findByIdAndDelete(req.params.id));
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
