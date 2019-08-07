const express = require('express');
const app = express();
const routes = express.Router();

const gtfs = require('gtfs');


// Defined store route
routes.route('/').get(async function (req, res) {
    const trips = await gtfs.getTrips({
        agency_key: 'STAC',
        route_id: '02-65',
        direction_id: 0,
    })

    res.json(trips);
});

module.exports = routes;
