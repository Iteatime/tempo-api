
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

routes.route('/timetables').get(function (req, res) {
    const data = {};
    gtfs.getRoutes()
    .then(routes => {
        const maxThreads = routes.length * 2;
        let doneThreads = 0;
        for (let route of routes) {
            data[route.route_id] = [ [], [] ];
            for (let direction of [0, 1]) {
                gtfs.getStops({agency_key: 'STAC', route_id: route.route_id, direction_id: direction})
                .then(stops => {
                    const stop_indices = stops.map(stop => {return stop.stop_id});
                    data[route.route_id][direction] = stop_indices;
                    doneThreads++;
                    if (doneThreads === maxThreads) {
                        res.json(data);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            }
        }
    })
    .catch(err => {
        console.log(err);
    });
});

module.exports = routes;
