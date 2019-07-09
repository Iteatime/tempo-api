const express = require('express');
const app = express();
const routes = express.Router();

const gtfs = require('gtfs');


// Defined store route
routes.route('/').get(function (req, res) {
    gtfs.getRoutes()
    .then(routes => {
        res.json(routes);
    })
    .catch(err => {
        console.log(err);
    });
});

module.exports = routes;
