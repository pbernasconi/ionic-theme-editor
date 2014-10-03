'use strict';

var express = require('express');
var controller = require('./compile.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/live/ionic.css:data', controller.live); // post a live
router.post('/', controller.create); // post a new compile script
router.get('/live/:body', controller.live); // post a live
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
