const express = require('express');
const app = express();
const routes = express.Router();

const gtfs = require('gtfs');


// Defined store route
routes.route('/').get(function (req, res) {
    res.send({message: 'Tempo API is up and running!'});
});

module.exports = routes;
