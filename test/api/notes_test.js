process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('basic notes crud', function() {
  var id;
  it('should be able to create a note', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/notes')
    .send({noteBody: 'hello world', priority: 1})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('hello world');
      expect(res.body).to.have.property('_id');
      id = res.body._id;
      done();
    });
  });

  it('should be able to get an index', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/notes')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.be.true;
      done();
    });
  });

  it('should be able to get a single note', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/notes/' + id)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('hello world');
      expect(res.body.priority).to.eql(1);
      done();
    });
  });

  it('should be able to update a note', function(done) {
    chai.request('http://localhost:3000')
    .put('/api/notes/' + id)
    .send({noteBody: 'new note body'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('new note body');
      done();
    });
  });

  it('should be able to destroy a note', function(done) {
    chai.request('http://localhost:3000')
    .delete('/api/notes/' + id)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('success!');
      done();
    });
  });
  
  it('should cause an error if data invalid', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/notes')
    .send({noteBody: 'ab'})
    .end(function(err, res) {
      //console.log(res.body)
      expect(err).to.eql(null);
      expect(res.status).to.eql(500);
      expect(res.body.noteBody.message).to.eql('Too Short! Not a note.')
      done();
    });
  });
});
