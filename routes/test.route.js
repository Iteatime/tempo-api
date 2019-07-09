const express = require('express');
const app = express();
const routes = express.Router();

const gtfs = require('gtfs');

var appRouter = function(app) {
    app.get("/", function(req, res) {
        gtfs.getRoutes()
        .then(routes => {
            console.log(routes);
        })
        .catch(err => {
            console.log(err);
        });
    });
}

module.exports = appRouter;
