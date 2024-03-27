const mongoose = require("mongoose");

dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/booku";

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!');
});

module.exports = db;
