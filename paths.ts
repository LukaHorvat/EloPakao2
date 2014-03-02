import express = require("express");
var mongoose = require("mongoose");
var db = require("./db");

function paths (app: express.Application) {
	app.get("/", function (req, res) {
		res.render("pages/index", { path: app.path() });
	});

	app.get("/article/:name", function (req, res) {
		if (req.param("name") === "intro") {
			res.render("pages/article", { title: "Pačićevo malo jezero", text: "Glupa patka", path: app.path() });
		}
	});

	app.get("/admin", function (req, res) {
		db.Article.find(function (err, articles) {
			console.log(articles)
			res.render("pages/admin", { path: app.path(), articles: articles });
		});
	});

	app.get("/editarticle/:id", function (req, res) {
		db.Article.findOne({ _id: mongoose.Types.ObjectId(req.param("id")) }, function (err, article) {
			if (err) {
				console.log("Unknown article " + req.param("id"));
				res.end();
			}
			res.render("pages/admin", { path: app.path(), article: article });
		});
	});

	app.post("/editarticle/:id", function (req, res) {
		db.Article.findOne({ _id: mongoose.Types.ObjectId(req.param("id")) }, function (err, article) {
			if (err) {
				console.log("Unknown article " + req.param("id"));
				res.end();
			}
			article.title = req.body["article-title"];
			article.text = req.body["article-text"];
			article.time = new Date();
			article.save(function (err) {
				if (err) console.log(err);
				res.redirect("/admin");
			});
		});
	});

	app.post("/addarticle", function (req, res) {
		var article = new db.Article({
			title: req.body["article-title"],
			text: req.body["article-text"],
			time: new Date()
		});
		article.save(function (err) {
			if (err) console.log(err);
			res.redirect("/admin");
		});
	});
}

export = paths;