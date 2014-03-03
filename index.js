/// <reference path="node/node.d.ts" />
/// <reference path="express/express.d.ts" />
/// <reference path="./paths.ts" />
/// <reference path="./db.ts" />
var express = require("express");
var paths = require("./paths");
var stylus = require("stylus"), nib = require("nib");
var app = express();
var mongoose = require("mongoose");

//beginregion Ugly setup stuff
app.enable("strict routing");

var compile = function (str, path) {
    return stylus(str).set('filename', path).use(nib());
};

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: compile
}));
app.configure(function () {
    app.use(express.static('public'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(app.router);
});

//endregion
paths(app); //Process paths

mongoose.connect("mongodb://localhost/test");
mongoose.connection.on("connected", function () {
    console.log("Connected to db");
});

app.listen(8442);
