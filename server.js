const express = require("express");
const cors = require("cors");
const Knex = require("knex");
require("dotenv").config();

//database setup
const db = require("knex")({
    client: "pg",
    connection: {
        host: process.env.DB_HOST || "127.0.0.1",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "hp",
        database: process.env.DB_NAME || "url_shortener",
    }
});
module.exports = db;

const app = express();

const port = process.env.PORT

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send({ server: "online" });
});

//middleware
const urlRouter = require("./routes/url.route");
app.use("/url", urlRouter);

//connecting to port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});