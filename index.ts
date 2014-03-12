/// <reference path="node/node.d.ts" />
/// <reference path="express/express.d.ts" />
/// <reference path="./paths.ts" />
/// <reference path="./db.ts" />

import os = require("os");
import express = require("express");
import paths = require("./paths");
import https = require("https");
import http = require("http");
import fs = require("fs");
var	stylus = require("stylus"),
	nib = require("nib");
var app = express();
var mongoose = require("mongoose");

var httpPort = 8442;
var httpsPort = 8443;

app.locals.pathNoProtocol = (os.hostname() == "myfirefly.me" ? "myfirefly.me" : "localhost") + ":" + httpsPort + app.path();
app.locals.path = "https://" + app.locals.pathNoProtocol;
app.locals.capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

//Redirect all HTTP traffic to HTTPS
app.use(function (req, res, next) {
	if (!req.secure) { //HTTP request
		console.log("HTTP request for " + req.url + ". Redirecting to " + app.locals.path + req.url);
		return res.redirect(app.locals.path + req.url);
	}
	next();
});

//beginregion Ugly setup stuff
app.enable("strict routing");

var compile = function (str, path) {
	return stylus(str)
		.set('filename', path)
		.use(nib());
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
mongoose.connection.on("connected", function () { console.log("Connected to db"); });

https.createServer({
	key: fs.readFileSync("server-key.pem"),
	cert: fs.readFileSync("server-cert.pem")
}, app).listen(httpsPort);

http.createServer(app).listen(httpPort);