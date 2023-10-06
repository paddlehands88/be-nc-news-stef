const {
  getTopics,
  getArticles,
  getApiEndpoints,
  getArticleById,
  getCommentsByArticleId,
} = require("./controllers/nc-news.controller");
const express = require("express");
const app = express();

app.get("/api", getApiEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

// PATH NOT FOUND

app.all("/*", (req, res, next) => {
  res.status(404).send({ message: "Not found!" });
});

// ERROR HANDLING MIDDLEWARE

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Invalid Input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: "Not found!" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal Server Error!" });
});

module.exports = app;
