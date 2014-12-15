'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var moment = require('moment');

var userSchema = mongoose.Schema({
  basic: {
    email: {type: String},
    password: {type: String},
    isAdmin: {type: Boolean, default: false}
  }
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.basic.password);
};

userSchema.methods.generateToken = function(secret) {
  var _this = this;
  var token = jwt.encode({
    iss: _this._id,
    is_admin: _this.basic.isAdmin,
    exp: moment().add(5, 'minute').valueOf()
  }, secret);
  return token;
};

module.exports = mongoose.model('User', userSchema);
