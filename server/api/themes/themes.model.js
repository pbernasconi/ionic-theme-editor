'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThemesSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Themes', ThemesSchema);