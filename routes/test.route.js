const express = require('express');
const app = express();
const routes = express.Router();

const gtfs = require('gtfs');


// Defined store route
routes.route('/').get(function (req, res) {
    res.json({});
});

module.exports = routes;
