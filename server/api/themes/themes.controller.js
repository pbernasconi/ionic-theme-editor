'use strict';

var _ = require('lodash');
var Themes = require('./themes.model');

// Get list of themess
exports.index = function(req, res) {
  Themes.find(function (err, themess) {
    if(err) { return handleError(res, err); }
    return res.json(200, themess);
  });
};

// Get a single themes
exports.show = function(req, res) {
  Themes.findById(req.params.id, function (err, themes) {
    if(err) { return handleError(res, err); }
    if(!themes) { return res.send(404); }
    return res.json(themes);
  });
};

// Creates a new themes in the DB.
exports.create = function(req, res) {
  Themes.create(req.body, function(err, themes) {
    if(err) { return handleError(res, err); }
    return res.json(201, themes);
  });
};

// Updates an existing themes in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Themes.findById(req.params.id, function (err, themes) {
    if (err) { return handleError(res, err); }
    if(!themes) { return res.send(404); }
    var updated = _.merge(themes, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, themes);
    });
  });
};

// Deletes a themes from the DB.
exports.destroy = function(req, res) {
  Themes.findById(req.params.id, function (err, themes) {
    if(err) { return handleError(res, err); }
    if(!themes) { return res.send(404); }
    themes.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}