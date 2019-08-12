
const express = require('express');
const app = express();
const routes = express.Router();

const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    config: Object,
});

const ConfigModel = mongoose.model('config', configSchema);


// Defined store route
routes.route('/').get(function (req, res) {
    var query = ConfigModel.findOne();
    query.exec(function (err, file) {
        if (err) { throw err; }
        res.json(file);
    });
});

routes.route('/').post(async function (req, res) {
    config = req.body;

    const deleteQuery = ConfigModel.deleteMany();
    await deleteQuery.exec(function (err) {
        if (err) { throw err; }
    });

    var currentConfig = new ConfigModel({config});

    await currentConfig.save(function (err) {
        if (err) { throw err; }
        console.log('Registered config succesfully');
    });

    res.status(204);
    res.send();
    console.log('Config saved successfully');
});

routes.route('/').delete(async function (req, res) {
    const deleteQuery = ConfigModel.deleteMany();
    await deleteQuery.exec(function (err) {
        if (err) { throw err; }
    });

    res.status(204);
    res.send();
    console.log('Config deleted successfully');
});

module.exports = routes;
