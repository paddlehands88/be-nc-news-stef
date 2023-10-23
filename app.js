const cors = require("cors");

app.use(cors());

const {
  getTopics,
  getArticles,
  getApiEndpoints,
  getArticleById,
  postComment,
  getCommentsByArticleId,
  patchVotesByArticleId,
  deleteCommentByCommentId,
} = require("./controllers/nc-news.controller");
const express = require("express");

const app = express();

app.use(express.json());

app.get("/api", getApiEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.post("/api/articles/:article_id/comments", postComment);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.patch("/api/articles/:article_id", patchVotesByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

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
  if (err.code === "23503") {
    res.status(404).send({ message: "not found" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ message: "Invalid Input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: "Not found!" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error!" });
});

module.exports = app;
