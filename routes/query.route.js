
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

routes.route('/timetables').post(async function (req, res) {
    const payload = req.body;
    
    const agency_key = 'STAC';
    let routes = await gtfs.getRoutes();
    const data = {};

    if (payload.hasOwnProperty('routes')) {
        const filteredRoutes = [];
        for (let route of routes) {
            if (payload.routes.includes(route.route_id)) {
                filteredRoutes.push(route);
            }
        }
        routes = filteredRoutes;
    }

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
                name: stops[stops.length - 1].stop_name,
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

                let obj = {};
                for (let time of times) {
                    let match = time.trip_id.match(/^(\d+)-(\w+)-(\w+)-(\w+)-.+$/);
                    let id = match[4];
                    if (!obj.hasOwnProperty(id)) {
                        obj[id] = []
                    }
                    obj[id].push(time);
                }

                data[route_id][direction_id].times[stop_id] = obj;
            }
        }
    }

    res.json(data);
});

module.exports = routes;
