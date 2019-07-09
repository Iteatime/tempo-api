
const express = require('express');
const app = express();
const routes = express.Router();

const gtfs = require('gtfs');


// Defined store route
routes.route('/').post(function (req, res) {
    data = req.body;
    gtfs[data.method](data.params)
    .then(routes => {
        res.json(routes);
    })
    .catch(err => {
        console.log(err);
    });
});

module.exports = routes;
