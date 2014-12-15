'use strict';
process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('basic user crud', function() {
  var randomNum = Math.floor(Math.random() * 99999);
  var randomEmail = 'fredford' + randomNum + '@example.com';
  var jwtToken = '';

  it('should create a new user', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: randomEmail, password: 'foobarfoo', passwordConfirmation: 'foobarfoo'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should log in an existing user', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/users')
    .auth(randomEmail, 'foobarfoo')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      done();
    });
  });

  it('should not allow users to GET /api/admins', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/admins')
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.eql('access denied');
      done();
    });
  });

  it('should not create a duplicate user', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: randomEmail, password: 'foobarfoo', passwordConfirmation: 'foobarfoo'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(500);
      expect(res.text).to.eql('cannot create that user');
      done();
    });
  });

  it('should not allow new passwords shorter than 6 char in length', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'short' + randomEmail, password: 'test', confirm_pass: 'test'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.eql('password must be at least 6 chars');
      done();
    });
  });

  it('should not allow unconfirmed passwords', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'twinless' + randomEmail, password: 'foobarfoo', passwordConfirmation: 'barfoobar'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(500);
      expect(res.text).to.eql('passwords did not match');
      done();
    });
  });

  it('should expire the jwt after a period of time');
});
