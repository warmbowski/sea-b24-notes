'use strict';
var User = require('../models/user');

module.exports = function(app, jwtSecret) {
  app.get('/api/admins', function(req, res) {
    User.find({}, function(err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });
  });

  app.post('/api/admins', function(req, res) {
    User.findOne({'basic.email': req.body.email}, function(err, admin) {
      if (err) return res.status(500).send('server error');
      if (admin) return res.status(500).send('cannot create that user');

      var newAdmin = new User();
      newAdmin.basic.isAdmin = true;
      newAdmin.basic.email = req.body.email;
      newAdmin.basic.password = newAdmin.generateHash(req.body.password);
      newAdmin.save(function(err, data) {
        if (err) return res.status(500).send('server error');
        if (!data) return res.status(500).send('server error');
        res.json({jwt: newAdmin.generateToken(jwtSecret)});
      });
    });
  });
};
