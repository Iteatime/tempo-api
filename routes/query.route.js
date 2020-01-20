
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
        console.error(err);
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

            let headsignsByTrip = {};
            let indexedTrips = {};
            for (let trip of trips) {
                let match = trip.trip_id.match(/^(\d+)-(\w+)-(\w+)-([^\d]+)-\d\d-?(\w*)$/);
                let id = match[1];
                let prod = match[3];
                if (!indexedTrips.hasOwnProperty(prod)) {
                    indexedTrips[prod] = {};
                }
                let data = match.slice(2, 6);
                data.push(trip.shape_id);
                indexedTrips[prod][id] = data;

                headsignsByTrip[trip.trip_id] = trip.trip_headsign;
            }

            let special = [];
            for (let prodData of Object.values(indexedTrips)) {
                for (let tripData of Object.values(prodData)) {
                    let code = [tripData[tripData.length - 1]];

                    if (tripData[3].length > 0) {
                        code.push(tripData[3]);
                    }

                    code = code.join('-');

                    if (!special.includes(code)) {
                        special.push(code);
                   }
                }
            }

            let stops = await gtfs.getStops(params);

            const stop_indices = stops.map(stop => {return stop.stop_id});

            let times = {};
            let headsigns = {};
            let name = [];

            for (let stop_id of stop_indices) {
                let stopTimes = await gtfs.getStoptimes({
                    agency_key,
                    route_id,
                    direction_id,
                    stop_id,
                });

                let stopHeadsign = [];
                let obj = {};
                for (let time of stopTimes) {
                    let match = time.trip_id.match(/^(\d+)-\w+-(\w+)/);
                    let id = indexedTrips[match[2]][match[1]].slice(1,3).join('-');
                    if (!obj.hasOwnProperty(id)) {
                        obj[id] = []
                    }
                    obj[id].push(time);

                    let headsign = headsignsByTrip[time.trip_id];
                    match = headsign.match(/^\w+\s+(.+)$/);
                    if (match) {
                        headsign = match[1];
                    }
                    if (!stopHeadsign.includes(headsign)) {
                        stopHeadsign.push(headsign);
                    }
                    if (!name.includes(headsign)) {
                        name.push(headsign);
                    }
                }

                times[stop_id] = obj;
                headsigns[stop_id] = stopHeadsign;
            }

            data[route_id][direction_id] = {
                name,
                headsigns,
                special,
                stops: stop_indices,
                times,
            }
        }
    }

    res.json(data);
});

module.exports = routes;
