const db = require("../db/connection");

exports.fetchTopics = () => {
  return db
    .query(
      `SELECT 
        topics.slug,
        topics.description 
        FROM topics;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        CAST(COUNT(comment_id) AS INT) AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          message: `No user found for article_id: ${article_id}`,
        });
      }
      return article;
    });
};

exports.postCommentByArticleId = (newCommentObj, article_id) => {
  const commentBody = newCommentObj.body;
  const userName = newCommentObj.author;
  return db
    .query(
      `INSERT INTO comments(body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [commentBody, userName, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchAndPatchVotesByArticleId = (voteObject, article_id) => {
  const votesChange = voteObject.inc_votes;
  return db
    .query(
      `UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING *;`,
      [votesChange, article_id]
    )
    .then((result) => {
      const article = result.rows[0];
      return article;
    });
};

exports.deleteCommentByCommentIdFromDB = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then((result) => {
      const comment = result.rows[0];
      if (!comment) {
        return Promise.reject({
          status: 404,
          message: "Not found!",
        });
      }

      return result.rows;
    });
};
