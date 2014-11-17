'use strict';
var moment = require('moment');

module.exports = function(req, res, next) {
  if (!req.exp) return res.status(403).send('access denied');
  if (moment(req.exp).isBefore(moment())) {
    return res.status(403).send('expired access');
  }
  next();
};