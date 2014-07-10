var passport = require("passport");
var db = require("../db");
var bcrypt = require("bcrypt-nodejs");

module.exports = function (app) {
    var isEmail = function (email) {
        return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
    };

    var emailAvailable = function (email, callback) {
        db.User.count({ email: email }, function (err, count) {
            if (err)
                console.log(err);
            if (count)
                callback(false);
            else
                callback(true);
            return;
        });
    };

    app.post("/register", function (req, res) {
        if (isEmail(req.body.email) && req.body.password.length >= 8) {
            emailAvailable(req.body.email, function (available) {
                if (available) {
                    var newUser = new db.User({
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password),
                        verified: false
                    });
                    newUser.save(function (err) {
                        if (err)
                            console.log(err);
                        res.redirect("/");
                    });
                } else {
                    res.end("Email taken");
                }
            });
        }
    });

    app.post("/emailavailable", function (req, res) {
        if (!isEmail(req.body.email))
            return res.end(JSON.stringify({ available: false }));
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
    }));
}