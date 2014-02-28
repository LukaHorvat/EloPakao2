/// <reference path="node/node.d.ts" />
/// <reference path="express/express.d.ts" />

import os = require("os");
import express = require("express");
var	stylus = require("stylus"),
	nib = require("nib");
var app = express();

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
app.use(stylus.middleware(
	{ 
		src: __dirname + '/public', 
		compile: compile
  	}
));
app.configure(function() {
	app.use(express.static('public'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(app.router);
});
//endregion

app.get("/", function (req, res) {
	res.render("pages/index");
});

app.listen(8442);