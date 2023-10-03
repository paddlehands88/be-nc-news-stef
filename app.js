const { getTopics, getApiEndpoints } = require("./controllers/nc-news.controller");
const express = require("express");
const app = express();



app.get("/api", getApiEndpoints);

app.get("/api/topics", getTopics);


// PATH NOT FOUND

app.all("/*", (req, res, next) => {
    res.status(404).send({ message: 'Path not found!' })
})







module.exports = app;