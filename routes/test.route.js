const express = require('express');
const app = express();
const routes = express.Router();





// Require Business model in our routes module
// let Business = require('../models/Business');

// Defined get data(index or listing) route
// businessRoutes.route('/').get(function (req, res) {
//     Business.find(function (err, businesses){
//     if(err){
//       console.log(err);
//     }
//     else {
//       res.json(businesses);
//     }
//   });
// });