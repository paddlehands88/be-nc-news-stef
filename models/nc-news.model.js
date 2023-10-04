const db = require("../db/connection");


exports.fetchTopics = () => {
    return db.query(
        `SELECT 
        topics.slug,
        topics.description 
        FROM topics;`)
        .then(({rows}) => {
            return rows;
        })
};

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
        .then(({rows}) => {
            const article = rows[0];
            if (!article) {
                return Promise.reject({
                    status: 404,
                    message: `No user found for article_id: ${article_id}`
                });
            }       
            return article;
        })
};

