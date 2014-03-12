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
var bcrypt = require("bcrypt-nodejs");

var db = require("./db");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy({
		usernameField: "email",
		passwordField: "password"
	},
	function (email, password, done) {
		db.User.findOne({ email: email }, function (err, user) {
			console.log("Login attempt: " + email);
			if (err) { return done(err); };
			if (!user) {
				return done(null, false, { message: "Incorrect email" });
			}
			if (!bcrypt.compareSync(password, user.password)) {
				return done(null, false, { message: "Incorrect password" });
			}
			console.log("Login success: " + email);
			return done(null, user);
		});
	}
));

passport.serializeUser(function (user, done) {
	console.log("Serialize: ");
	console.log(user);
	done(null, user._id);
});

passport.deserializeUser(function (id, done) {
	console.log("Attempt deserialize: " + id);
	db.User.findById(id, function(err, user) {
		console.log("Deserialize: " + err + ", " + user);
		done(err, user);
	});
});

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
	app.use(express.session({ secret: "supersecret" }));
	app.use(passport.initialize());
	app.use(passport.session());
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

