var fs = require("fs");

var schema = { }
var modelNames = fs
	.readdirSync("./models")
	.filter(function (path) { return /.*\.js/.test(path); });
for (var i = 0; i < modelNames.length; ++i) {
	var name = modelNames[i];
	schema[name.substring(0, name.indexOf("."))] = require("./models/" + name);
}

module.exports = schema;