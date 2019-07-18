
const express = require('express');
const app = express();
const routes = express.Router();

const formidable = require('formidable');
const gtfs = require('gtfs');
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: String,
    date: { type : Date, default : Date.now }
});

const FileModel = mongoose.model('files', fileSchema);


// Defined store route
routes.route('/').get(function (req, res) {
    var query = FileModel.findOne();
    query.exec(function (err, file) {
        if (err) { throw err; }
        res.json(file);
    });
});

routes.route('/').post(function (req, res) {
    var form = new formidable.IncomingForm();
    // form.uploadDir = './data';

    form.on('fileBegin', function(name, file) {
        file.path += '.zip';
    });

    form.parse(req, function(err, fields, files) {
        filename = files.file.path;
        name = files.file.name;
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
            // mongoose.connect('mongodb://localhost:27017/tempo', function(err) {
            //     if (err) { throw err; }
            // });

            const match = name.match(/(\w+)\..*/);
            name = match[1];

            const deleteQuery = FileModel.deleteMany();
            deleteQuery.exec(function (err) {
                if (err) { throw err; }
            });

            var currentFile = new FileModel({ name });

            currentFile.save(function (err) {
                if (err) { throw err; }
                console.log('Registered file name succesfully');
                // mongoose.connection.close();
            });

            res.json({});
            console.log('Import successful');
        })
        .catch(err => {
            console.error(err);
        });
    });
});

module.exports = routes;
