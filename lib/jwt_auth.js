'use strict';
var User = require('../models/user')
var jwt = require('jwt-simple');
var mongoose = require('mongoose');

module.exports = function(secret) {
  return function(req, res, next) {
    var token =  req.headers.jwt || req.body.jwt;
    
    var decoded;
    try {
      decoded = jwt.decode(token, secret);
    } catch(err) {
      console.log(err);
      return res.status(403).send('access denied1');
    }
    
    User.findOne({_id: decoded.iss}, function(err, user) {
      if (err) return res.status(403).send('access denied2');
      if (!user) return res.status(403).send('access denied3');
      
      req.user = user;
      req.is_admin = decoded.is_admin;
      req.exp = decoded.exp;
      console.log(req.is_admin)
      next();
    })
  };
};