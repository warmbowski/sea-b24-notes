'use strict';

module.exports = function(req, res, next) {
  if (!req.is_admin) return res.status(403).send('access denied');
  next()
}