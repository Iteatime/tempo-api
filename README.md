# Tempo API

This app is an API to treat gtfs datas using mongodb.

## How To start:

* By default, it runs on `localhost:4000`.

### 1 Local

#### 1.1 Requirements:

* Node.js (at least version 10.x): [latest](https://nodejs.org/en/download/current/)
* nodemon (optional): npm install -g nodemon

#### 1.2 Installation:

* Install node gtfs and mongoose with `npm install gtfs mongoose -g`
* You have to clone this repo then you can run: `npm install` after `cd path/of/the/project`

example if the directory is on your desk:
> npm install gtfs mongoose -g  
> cd Bureau/tempo-api/tempo-api/  
> npm install


#### 1.3 Run server:

* You can start without the watch via: `nodemon server` in the file directory

### 2 Libraries

* We are currently using node-gtfs to treat gtfs data, you can find informations about node-gtfs [here](https://www.npmjs.com/package/gtfs).
