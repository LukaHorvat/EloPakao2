/// <reference path="./serialization.ts" />
import fs = require("fs");
var serialization = require("./serialization");
var mongoose = require("mongoose");

function getType (obj) {
	if (Array.isArray(obj)) {
		return [getType(obj[0])];
	} else if (typeof obj === "string") {
		switch (obj) {
			case "String":
				return String;
			case "Number":
				return Number;
			case "Date":
				return Date;
			case "Buffer":
				return Buffer;
			case "Boolean":
				return Boolean;
			case "Mixed":
				return mongoose.Types.Mixed;
			case "ObjectId":
				return mongoose.Types.ObjectId;
			default:
				throw "Unknown schema type " + obj;
		}
	} else {
		var objType = {};
		for (var key in obj) {
			objType[key] = getType(obj[key]);
		}
	}
}

var schema = JSON.parse(fs.readFileSync(__dirname + "/schema.json").toString());
for (var modelName in schema) {
	var model = {};
	for (var field in schema[modelName].fields) {
		var type = getType(schema[modelName].fields[field].type);
		model[field] = type;
	}
	exports[modelName] = mongoose.model(modelName, model);
}
serialization.addEncodersAndDecoders(schema);
exports.schema = schema;