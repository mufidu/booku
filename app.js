if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const methodOverride = require("method-override");
const Book = require("./models/book");

const morgan = require("morgan");
const session = require('express-session');
const authRoutes = require('./routes/auth.routes.js');
const bookRoutes = require('./routes/book.routes.js');
const authenticateToken = require('./middleware/auth.middleware.js');
const userRoutes = require('./routes/user.routes.js');


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

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/users', authenticateToken, userRoutes);

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

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
