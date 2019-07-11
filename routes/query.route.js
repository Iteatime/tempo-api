
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

routes.route('/timetables').get(async function (req, res) {
    const agency_key = 'STAC';
    const routes = await gtfs.getRoutes();
    const data = {};

    for (let route of routes) {
        let route_id = route.route_id;
        data[route_id] = [];

        for (let direction_id of [0, 1]) {
            let stops = await gtfs.getStops({
                agency_key,
                route_id,
                direction_id,
            });

            const stop_indices = stops.map(stop => {return stop.stop_id});

            data[route_id][direction_id] = {
                stops: stop_indices,
                times: {},
            }

            for (let stop_id of stop_indices) {
                let times = await gtfs.getStoptimes({
                    agency_key,
                    route_id,
                    direction_id,
                    stop_id,
                });

                data[route_id][direction_id].times[stop_id] = times;
            }
        }
    }

    res.json(data);
});

module.exports = routes;
