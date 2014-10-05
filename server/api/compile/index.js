'use strict';

var express = require('express');
var controller = require('./compile.controller');

var router = express.Router();

router.get('/download/:id/:filename', controller.download); // download ionic.css
router.get('/live/ionic.css:data', controller.live); // post a live
router.post('/:cssType', controller.compile); // post a new compile script
router.get('/live/:body', controller.live); // post a live
router.put('/:id', controller.update);

module.exports = router;
