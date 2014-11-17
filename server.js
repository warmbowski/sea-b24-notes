var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var passport = require('passport');
var app = express();

mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGO_URL || 'mongodb://localhost/notes_development');
app.use(bodyparser.json());
app.set('jwtSecret', process.env.JWT_SECRET || 'changethisordie');
// app.set('secret', process.env.SECRET || 'changethistoo');

app.use(passport.initialize());

require('./lib/passport')(passport);
var jwtauth = require('./lib/jwt_auth')(app.get('jwtSecret'));
var jwtexpire = require('./lib/jwt_expire');
var jwtadmin = require('./lib/jwt_admin');

var notesRouter = express.Router();
notesRouter.use(jwtauth);
notesRouter.use(jwtexpire);

var adminRouter = express.Router();
adminRouter.use(jwtauth);
adminRouter.use(jwtexpire);
adminRouter.use(jwtadmin);

require('./routes/users_routes')(app, passport);
require('./routes/admin_routes')(adminRouter, app.get('jwtSecret'));
require('./routes/notes_routes')(notesRouter);

app.use('/v1', notesRouter);
app.use('/', adminRouter);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('server running on port: %d', app.get('port'));
});
