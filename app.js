const { getTopics } = require("./controllers/nc-news.controller");
const express = require("express");
const app = express();


app.use(express.json());


app.get("/api/topics", getTopics);


// PATH NOT FOUND

app.all("/*", (req, res, next) => {
    res.status(404).send({ message: 'Path not found!' })
})







module.exports = app;