const { fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId } = require("../models/nc-news.model");
const apiEndpoints = require("../endpoints.json");


exports.getApiEndpoints = (req, res) => {
    res.status(200).send({API_Endpoints: apiEndpoints});
    };

exports.getTopics = (req, res) => {
    return fetchTopics().then((rows) => {
        res.status(200).send({topics: rows});
    })
};

exports.getArticles = (req, res) => {
    return fetchArticles().then((rows) => {
        res.status(200).send({articles: rows});
    })
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    return fetchArticleById(article_id)
        .then((article) => {res.status(200).send({article})})
        .catch((err) => {
            next(err)
        });
};

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    return fetchCommentsByArticleId(article_id)
        .then((comments) => {res.status(200).send({comments})})
        .catch((err) => {
            console.log(err, "CONTROLLER");
            next(err)
        });
    };