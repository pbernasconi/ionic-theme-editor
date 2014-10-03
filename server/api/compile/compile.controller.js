'use strict';

var _ = require('lodash');
var Compile = require('./compile.model');
var http = require('http');
var https = require('https');
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

function getNightly(postData) {
    var outputString = "";
    var ionicVersion = "";
    var githubStr = "https://github.com/driftyco/ionic/blob/master/";
    var rawgitStr = "https://cdn.rawgit.com/driftyco/ionic/master/";

    request('https://cdn.rawgit.com/driftyco/ionic/master/package.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            ionicVersion = JSON.parse(body).version;

            console.log(ionicVersion);

            var gitOptions = {
                url: 'https://api.github.com/repos/driftyco/ionic/contents/scss?', //ref=v' + ionicVersion,
                headers: {'User-Agent': 'request'}
            };

            request(gitOptions, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var scss = JSON.parse(body);
                    _.each(scss, function (each) {
                        if (each.name != "ionicons") {
                            var fileIn = each.html_url.replace(githubStr, rawgitStr);
                            var fileOut = path.resolve("./server/ionic/scss/" + each.name);

                            var options = {
                                url: fileIn,
                                headers: {'User-Agent': 'request'}
                            };

                            request(options, function (error, res, bod) {
                                fs.writeFile(path.resolve(fileOut), (bod), function (error) {
                                    if (error) console.log("error : " + error);
                                    else {
                                        _.each(postData, function (each) {
                                            outputString += each.variable + ":  " + each.value + " !default;\n";
                                        });

                                        outputString += "@import './server/ionic/scss/ionic';";

                                        var dateID = new Date().getTime();

                                        CompileSass(outputString, dateID);
                                    }
                                });
                            });
                        }
                    });
                }
            });


        }
    });
}

function CompileSass(outputString, dateID) {
    var stats = {};
    sass.renderFile({
        data: outputString,
        success: function (css) {
            //res.status(200).json({success: true, id: dateID});
        },
        error: function (error) {
            console.log(error);
            //res.status(400).json({success: false, id: null});
        },
        includePaths: ['ionic/scss/ionic'],
        outFile: "./server/ionic/tmp/ionic.app.css", // + dateID + ".css",
        outputStyle: 'nested',
        stats: stats
    });
}

// Creates a new compile in the DB.
exports.create = function (req, res) {
    var postData = req.body;

    mkdirp('./server/ionic/scss_test', function (err) { // create new scss test folder
        if (!err == null) console.log(err);
    });

    mkdirp('./server/ionic/tmp', function (err) { // temporary file
        if (!err == null) console.log(err);
    });

    getNightly(postData)
};

exports.live = function (req, res) {

    var reqData = req.query;
    var sassString = "";
    res.set('Content-Type', 'text/css');

    _.each(reqData, function (value, key) {
        sassString += key + ":  " + value + " !default;\n";
    });

    sassString += "@import './server/ionic/scss/ionic';";
    //sassString += "@function best-text-color($color) { @if (lightness( $color ) > 70) {@return #000000;} @else { @return #FFFFFF;}}";
    //sassString += ".bar {&.bar-brand { @include bar-style($brand, lighten($brand, 50%), best-text-color($brand));} }";


    var stats = {};
    sass.render({
        data: sassString,
        success: function (css) {
            res.send(css);
        },
        error: function (error) {
            console.log(error);
            res.status(400).json({success: false, id: null});
        },
        includePaths: ['ionic/scss/ionic'],
        outputStyle: 'compressed',
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
