var fs = require("fs");

var schema = { }
var modelNames = fs.readdirSync("./models");
for (var i in modelNames) {
	var name = modelNames[i];
	schema[name.substring(0, name.indexOf("."))] = require("./models/" + name);
}

module.exports = schema;