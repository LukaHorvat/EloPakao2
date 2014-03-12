import express = require("express");
import fs = require("fs");
var jade = require("jade"); 
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var db = require("./db");
var passport = require("passport");

function paths (app: express.Application) {
	//Precompile CMS pane
	var panePath = __dirname + "/views/pages/pane.jade";
	var precompiledPane; 
	var recompilePane = function () {
		precompiledPane = jade.compile(fs.readFileSync(panePath).toString(), { filename: panePath });
	};
	recompilePane();
	fs.watch(panePath, recompilePane);

	var capitalize = function (str) {
    	return str.charAt(0).toUpperCase() + str.slice(1);
	};

	app.get("/", function (req, res) {
		res.render("pages/index");
	});

	app.get("/article/:name", function (req, res) {
		if (req.param("name") === "intro") {
			res.render("pages/article", { title: "Pačićevo malo jezero", text: "Glupa patka"});
		}
	});

	app.all(/^\/(admin|add|remove|edit|get).*/, function (req, res, next) {
		if (req.user && req.user.email === "darwin226@gmail.com") {
			next();
		} else {
			res.status(401);
			res.end();
		}
	});

	app.get("/admin", function (req, res) {
		var modelNames: string[] = [];
		for (var key in db.schema) {
			if (db.schema[key].adminOption) {
				modelNames.push(key);
			}
		}
		var modelIndex = 0;

		var options = {};
		var callback = function (err, items) {
			var displayField = db.schema[modelNames[modelIndex]].adminOption.displayField;
			for (var i = 0; i < items.length; ++i) items[i].displayName = items[i][displayField];
			options[modelNames[modelIndex]] = precompiledPane({ 
				items: items, 
				itemTypeName: modelNames[modelIndex].toLowerCase(),
				itemType: db.schema[modelNames[modelIndex]].fields, 
				path: app.locals.path, 
				capitalize: app.locals.capitalize
			});

			modelIndex++;
			if (modelIndex == modelNames.length) {
				res.render("pages/admin", { options: options });
			} else {
				db[modelNames[modelIndex]].find(callback);
			}
		};
		db[modelNames[0]].find(callback);
	});

	app.post("/add/:model", function (req, res, next) {
		var capital = capitalize(req.param("model"));
		var obj = {};
		for (var field in db.schema[capital].fields) {
			obj[field] = null;
		}
		var item = new db[capital](obj);
		item.save(function (err, obj) {
			if (err) {
				console.log(err);
				res.end("Error");
			} else {
				req.url = "/edit/" + req.param("model") + "/" + obj._id;
				next();
			}
		});
	});

	app.get("/get/:model/:id", function (req, res) {
		var capital = capitalize(req.param("model"));
		var returnObject = {};
		var model = db.schema[capital];
		db[capital].findOne({ _id: mongoose.Types.ObjectId(req.param("id")) }, function (err, article) {
			for (var field in model.fields) {
				if (model.fields[field].adminField) {
					var encoder = model.fields[field].adminField.encoder ||
						function (x) { return x; };
					returnObject[req.param("model") + "-" + field] = {
						type: model.fields[field].adminField.inputType,
						value: encoder(article[field])
					};
				}
			}
			res.end(JSON.stringify(returnObject));
		}); 
	});

	app.post("/edit/:model/:id", function (req, res) {
		var capital = capitalize(req.param("model"));
		var model = db.schema[capital];
		db[capital].findOne({ _id: mongoose.Types.ObjectId(req.param("id")) }, function (err, article) {
			for (var field in model.fields) {
				if (model.fields[field].adminField) {
					var decoder = model.fields[field].adminField.decoder ||
						function (x) { return x; };
					article[field] = decoder(req.body[req.param("model") + "-" + field]);
				}
			}
			article.save(function (err) {
				if (err) console.log(err);
				res.redirect("/admin#" + capital);
			});
		}); 
	});

	app.get("/remove/:model/:id", function (req, res) {
		var capital = capitalize(req.param("model"));
		db[capital].remove( { _id: mongoose.Types.ObjectId(req.param("id")) }, function (err) {
			if (err) console.log(err);
			res.redirect("/admin#" + capital);
		})
	});

    app.get("/calendar", function (req, res) {
        res.render("pages/calendar");
    });

    app.get("/register", function (req, res) {
    	res.render("pages/register");
    });

    var isEmail = function (email: string): boolean {
		return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);	
	}

	var emailAvailable = function (email: string, callback: (res: boolean) => any) {
		db.User.count({ email: email }, function (err, count) {
			if (err) console.log(err);
			if (count) callback(false);
			else callback(true);
			return;
		});
	};

    app.post("/register", function (req, res) {
    	if (isEmail(req.body.email) && req.body.password.length >= 8) {
    		emailAvailable(req.body.email, function (available) {
    			if (available) {
    				var newUser = new db.User({
    					email: req.body.email,
    					password: bcrypt.hashSync(req.body.password)
    				});
    				newUser.save(function (err) {
    					if (err) console.log(err);
    					res.redirect("/");
    				});
    			} else {
    				res.end("Email taken");
    			}
    		});
    	}
    });

    app.post("/emailavailable", function (req, res) {
    	if (!isEmail(req.body.email)) return res.end(JSON.stringify({ available: false }));
    	else {
    		emailAvailable(req.body.email, function (available) {
    			res.end(JSON.stringify({ available: available }));
    		});
    	}
    });

    app.get("/login", function (req, res) {
    	res.render("pages/login");
    });

    app.post("/login", passport.authenticate("local", {
	    	successRedirect: "/",
	    	failureRedirect: "/loginFailed"
	    }
	));
}

export = paths;