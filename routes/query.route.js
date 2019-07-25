
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
            let params = {
                agency_key,
                route_id,
                direction_id,
            };

            let trips = await gtfs.getTrips(params);

            let indexedTrips = {};
            for (let trip of trips) {
                let match = trip.trip_id.match(/^(\d+)-(\w+)-(\w+)-(\w+)-\d\d-?(\w*)$/);
                indexedTrips[match[1]] = match.slice(2, 6);
            }

            let special = [];
            for (let tripData of Object.values(indexedTrips)) {
                if (tripData[3].length > 0) {
                    if (!special.includes(tripData[3])) {
                        special.push(tripData[3])
                    }
                }
            }

            let stops = await gtfs.getStops(params);

            const stop_indices = stops.map(stop => {return stop.stop_id});

            let name = stops.length > 0 ? stops[stops.length - 1].stop_name : '' ;

            data[route_id][direction_id] = {
                name,
                special,
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
                    let match = time.trip_id.match(/^(\d+)-/);
                    let id = indexedTrips[match[1]].slice(1,3).join('-')
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
