var express = require("express");
var fs = require("fs");
var jade = require("jade");
var mongoose = require("mongoose");
var db = require("./db");

function paths(app) {
    //Precompile CMS
    var files = fs.readdirSync(__dirname + "/views/pages/panes");
    var precompiledOptions = {};
    for (var i = 0; i < files.length; ++i) {
        var name = files[i].substr(0, files[i].indexOf("."));
        var path = __dirname + "/views/pages/panes/" + files[i];
        var source = fs.readFileSync(path);
        precompiledOptions[name] = jade.compile(source, { filename: path });
    }

    app.get("/", function (req, res) {
        res.render("pages/index");
    });

    app.get("/article/:name", function (req, res) {
        if (req.param("name") === "intro") {
            res.render("pages/article", { title: "Pačićevo malo jezero", text: "Glupa patka" });
        }
    });

    app.get("/admin", function (req, res) {
        db.Article.find(function (err, articles) {
            db.Tournament.find(function (err, tournaments) {
                db.Team.find(function (err, teams) {
                    var locals = {
                        articles: articles,
                        tournaments: tournaments,
                        teams: teams
                    };
                    var options = {};
                    for (var name in precompiledOptions) {
                        options[name] = precompiledOptions[name](locals);
                    }
                    locals.options = options;

                    res.render("pages/admin", locals);
                });
            });
        });
    });

    app.get("/getarticle/:id", function (req, res) {
        db.Article.findOne({ _id: mongoose.Types.ObjectId(req.param("id")) }, function (err, article) {
            if (err) {
                console.log("Unknown article " + req.param("id"));
                res.end();
            } else {
                res.end(JSON.stringify(article));
            }
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
                if (err)
                    console.log(err);
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
            if (err)
                console.log(err);
            res.redirect("/admin");
        });
    });

    app.post("/addtournament", function (req, res) {
    });

    app.get("/calendar", function (req, res) {
        res.render("pages/calendar");
    });
}

module.exports = paths;
