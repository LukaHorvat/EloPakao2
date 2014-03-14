var fs = require("fs");
var jade = require("jade");
var db = require("../db");

module.exports = function (app) {    
    //Precompile CMS pane
    var panePath = __dirname + "/../views/pages/pane.jade";
    var precompiledPane;
    var recompilePane = function () {
        precompiledPane = jade.compile(fs.readFileSync(panePath).toString(), { filename: panePath });
    };
    recompilePane();
    fs.watch(panePath, recompilePane);

    var capitalize = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    app.all(/^\/(admin|add|remove|edit|get).*/, function (req, res, next) {
        //if (req.user && req.user.email === "darwin226@gmail.com") {
            next();
        /*} else {
            res.status(401);
            res.end();
        }*/
    });

    app.get("/admin", function (req, res) {
        var modelNames = [];
        for (var key in db.schema) {
            if (db.schema[key].adminOption) {
                modelNames.push(key);
            }
        }
        var modelIndex = 0;

        var options = {};
        var callback = function (err, items) {
            var displayField = db.schema[modelNames[modelIndex]].adminOption.displayField;
            for (var i = 0; i < items.length; ++i)
                items[i].displayName = items[i][displayField];
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
        db[capital].findById(req.param("id"), function (err, item) {
            if (err) console.log(err);
            if (err) console.log(err);
            for (var field in model.fields) {
                if (model.fields[field].adminField) {
                    var encoder = model.fields[field].adminField.encoder || function (x) {
                        return x;
                    };
                    returnObject[req.param("model") + "-" + field] = {
                        type: model.fields[field].adminField.inputType,
                        value: encoder(item[field])
                    };
                }
            }
            res.end(JSON.stringify(returnObject));
        });
    });

    app.post("/edit/:model/:id", function (req, res) {
        var capital = capitalize(req.param("model"));
        var model = db.schema[capital];
        db[capital].findById(req.param("id"), function (err, article) {
            for (var field in model.fields) {
                if (model.fields[field].adminField) {
                    var decoder = model.fields[field].adminField.decoder || function (x) {
                        return x;
                    };
                    article[field] = decoder(req.body[req.param("model") + "-" + field]);
                }
            }
            article.save(function (err) {
                if (err)
                    console.log(err);
                res.redirect("/admin#" + capital);
            });
        });
    });

    app.get("/remove/:model/:id", function (req, res) {
        var capital = capitalize(req.param("model"));
        db[capital].findByIdAndRemove(req.param("id"), function (err) {
            if (err) console.log(err);
            
            res.redirect("/admin#" + capital);
        });
    });
}