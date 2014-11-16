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
    .send({email: randomEmail, password: 'test'})
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
    .auth(randomEmail, 'test')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      //expect(res.body.jwt).to.eql(jwtToken);
      done();
    });
  }); 

  it('should not create a duplicate user');
  it('should not allow short passwords');
});