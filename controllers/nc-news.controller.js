const { fetchTopics, fetchApiEndpoints } = require("../models/nc-news.model");
const apiEndpoints = require("../endpoints.json");

exports.getTopics = (req, res) => {
    return fetchTopics().then((rows) => {
        res.status(200).send({topics: rows});
    })
};

exports.getApiEndpoints = (req, res) => {
    res.status(200).send({API_Endpoints: apiEndpoints});
    };