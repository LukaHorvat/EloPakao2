var express = require("express");

function paths(app) {
    app.get("/", function (req, res) {
        res.render("pages/index");
    });

    app.get("/article/:name", function (req, res) {
        if (req.param("name") === "intro") {
            res.render("pages/article", { title: "Pačićevo malo jezero", text: "Glupa patka" });
        }
    });

    require("./routing/admin")(app);

    app.get("/calendar", function (req, res) {
        res.render("pages/calendar");
    });

    app.get("/register", function (req, res) {
        res.render("pages/register");
    });

    require("./routing/authentication")(app);
}

module.exports = paths;
