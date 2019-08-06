// server.js

const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    config = require('./gtfs-config.json'),
    gtfs = require('gtfs');

    const testRoute = require('./routes/test.route');
    const queryRoute = require('./routes/query.route');
    const fileRoute = require('./routes/file.route');
    const configRoute = require('./routes/config.route');
    const mainRoute = require('./routes/main.route');

    mongoose.Promise = global.Promise;
    mongoose.connect(config.mongoUrl, { useNewUrlParser: true }).then(
      () => {
        console.log('Database is connected')
      },
      err => { console.log('Can not connect to the database'+ err)}
    );

    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    app.use('/test', testRoute);
    app.use('/query', queryRoute);
    app.use('/file', fileRoute);
    app.use('/config', configRoute);
    app.use('/', mainRoute);

    const port = process.env.PORT || 4000;

    const server = app.listen(port, function(){
      console.log('Listening on port ' + port);
    });
