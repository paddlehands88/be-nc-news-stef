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



exports.fetchArticles = () => {
    return db.query(
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
        ORDER BY created_at DESC;`)
        .then(({rows}) => {
            console.log(rows, "MODEL fetchArticles");
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

