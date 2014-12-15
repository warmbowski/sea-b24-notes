'use strict';
var User = require('../models/user');

module.exports = function(app, passport) {

  app.get('/api/users', passport.authenticate('basic', {session: false}), function(req, res) {
    res.json({jwt: req.user.generateToken(app.get('jwtSecret'))});
  });

  app.post('/api/users', function(req, res) {
    var decoded = new Buffer(req.body.obfuscated, 'base64').toString('utf8');
    decoded = JSON.parse(decoded);

    User.findOne({'basic.email': decoded.email}, function(err, user) {
      if (err) return res.status(500).send('server error');
      if (user) return res.status(500).send('cannot create that user');
      if (decoded.password.length < 5) return res.status(500).send('password must be at least 6 chars');
      if (decoded.password !== decoded.passwordConfirmation) return res.status(500).send('passwords did not match');

      var newUser = new User();
      newUser.basic.email = decoded.email;
      newUser.basic.password = newUser.generateHash(decoded.password);
      newUser.save(function(err, data) {
        if (err) return res.status(500).send('server error');
        if (!data) return res.status(500).send('server error');
        res.json({jwt: newUser.generateToken(app.get('jwtSecret'))});
      });
    });
  });
};
