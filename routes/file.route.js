
const express = require('express');
const app = express();
const routes = express.Router();

const formidable = require('formidable');
const gtfs = require('gtfs');

// Defined store route
routes.route('/').post(function (req, res) {
    var form = new formidable.IncomingForm();
    // form.uploadDir = './data';

    form.on('fileBegin', function(name, file) {
        file.path += '.zip';
    });

    form.parse(req, function(err, fields, files) {
        filename = files.file.path;
        console.log(filename);
        gtfs.import(
            {
                "mongoUrl": "mongodb://localhost:27017/tempo",
                "agencies": [
                  {
                    "agency_key": "STAC",
                    "path": filename
                  }
                ]
            }
        )
        .then(() => {
            res.json({});
            console.log('** Import Successful **');
            // return mongoose.connection.close();
        })
        .catch(err => {
            console.error(err);
        });
    });

    return;
});

module.exports = routes;
