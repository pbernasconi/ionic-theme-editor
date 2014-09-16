'use strict';

var _ = require('lodash');
var Compile = require('./compile.model');
var http = require('http');
var fs = require('fs');
var request = require('request');
var mkdirp = require('mkdirp');
var path = require('path');
var sass = require('node-sass');


exports.index = function (req, res) {

};

exports.show = function (req, res) {
    var id = req.params.id;
    res.download(path.resolve("./server/ionic/tmp/ionic.app." + id + ".css"), "ionic.app.css");
};

// Creates a new compile in the DB.
exports.create = function (req, res) {
    var postData = req.body;
    var outputString = "";

    /*
     mkdirp('./server/tmp', function (err) {
     if (!err == null) console.log(err);
     });
     */
    _.each(postData, function (each) {
        outputString += each.variable + ":  " + each.value + " !default;\n";
    });

    outputString += "@import './server/ionic/scss/ionic';";

    var dateID = new Date().getTime();
    var stats = {};
    sass.renderFile({
        data: outputString,
        success: function (css) {
            //console.log(css);
            //console.log(stats);
            res.status(200).json({success: true, id: dateID});
        },
        error: function (error) {
            console.log(error);
            res.status(400).json({success: false, id: null});
        },
        includePaths: ['ionic/scss/ionic'],
        outFile: "./server/ionic/tmp/ionic.app." + dateID + ".css",
        outputStyle: 'nested',
        stats: stats
    });


};

exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Compile.findById(req.params.id, function (err, compile) {
        if (err) {
            return handleError(res, err);
        }
        if (!compile) {
            return res.send(404);
        }
        var updated = _.merge(compile, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, compile);
        });
    });
};

exports.destroy = function (req, res) {
    Compile.findById(req.params.id, function (err, compile) {
        if (err) {
            return handleError(res, err);
        }
        if (!compile) {
            return res.send(404);
        }
        compile.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}
