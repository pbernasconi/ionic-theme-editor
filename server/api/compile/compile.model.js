'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CompileSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Compile', CompileSchema);