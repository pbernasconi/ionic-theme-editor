'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/themes', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/themes')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});