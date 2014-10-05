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
var shortId = require('shortid');


// GET : download file, remove after success
exports.download = function (req, res) {
    var id = req.params.id;
    var filename = req.params.filename || "ionic.app.css";
    console.log(req.params.filename);
    var file = "./server/ionic/tmp/ionic-" + id + ".app.css";

    res.download(path.resolve(file), filename, function (err) {  // send file for download
        if (err) {
            console.log(err);
            throw err;
        } else {
            fs.unlink(path.resolve(file), function (err) { // delete file when done
                if (err) {
                    console.log(err);
                    throw err;
                }
                res.status(200);
            });
        }
    });
};


// POST : Creates a new compile in the DB.
exports.compile = function (req, res) {
    var postData = req.body;
    var cssType = req.params.cssType;
    var uniqueID = shortId.generate(); // generate a unique ID for tmp file
    var stats = {};
    var sassString = "";

    mkdirp('./server/ionic/tmp', function (err) { // create temporary folder
        if (err) {
            console.log(err);
            throw err;
        }
    });

    console.log(cssType);

    if (cssType != "nested" && cssType != "compressed") {
        res.status(400).json({success: false, id: null, error: "Wrong CSS type"}).end();
    }

    sassString += "$ionicons-font-path: '../../../ionic/scss/fonts' !default;";
    sassString += "$font-family-sans-serif: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif !default;";
    sassString += "$font-family-light-sans-serif:'Helvetica Neue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif !default;"
    sassString += "$font-family-serif: Georgia, 'Times New Roman', Times, serif !default;";
    sassString += "$font-family-monospace:  Monaco, Menlo, Consolas, 'Courier New', monospace !default;";

    _.each(postData, function (each) { // create variables SASS compiler string
        sassString += each.variable + ":  " + each.value + " !default;\n";
    });

    sassString += "@import './server/ionic/scss-prod/ionic';"; // import ionic into SASS compiler string

    sass.renderFile({
        data: sassString,
        success: function (css) {
            res.status(200).json({success: true, id: uniqueID});
        },
        error: function (error) {
            console.log(error);
            res.status(400).json({success: false, id: null, error: error});
        },
        outFile: "./server/ionic/tmp/ionic-" + uniqueID + ".app.css",
        outputStyle: cssType,
        stats: stats
    });
};


// GET : compile for live preview
exports.live = function (req, res) {

    var reqData = req.query;
    var sassString = "";
    res.set('Content-Type', 'text/css');

    sassString += "$font-family-sans-serif: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif !default;";
    sassString += "$font-family-light-sans-serif:'Helvetica Neue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif !default;"
    sassString += "$font-family-serif: Georgia, 'Times New Roman', Times, serif !default;";
    sassString += "$font-family-monospace:  Monaco, Menlo, Consolas, 'Courier New', monospace !default;";

    _.each(reqData, function (value, key) {
        sassString += key + ":  " + value + " !default;\n";
    });

    sassString += "@import './server/ionic/scss-live/ionic';";
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


// ??? : Update ionic sass files depending on latest version
exports.update = function (req, res) {

    mkdirp('./server/ionic/scss_test', function (err) { // create new scss test folder
        if (!err == null) console.log(err);
    });
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

function handleError(res, err) {
    return res.send(500, err);
}
