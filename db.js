var mongoose = require("mongoose");
var schema = require("./schema");

for (var modelName in schema) {
    var model = {};
    for (var field in schema[modelName].fields) {
        model[field] = schema[modelName].fields[field].type;
    }
    model = new mongoose.Schema(model);
    for (var method in schema[modelName].methods) {
    	model.methods[method] = schema[modelName].methods[method];
    }
    exports[modelName] = mongoose.model(modelName, model);
}
exports.schema = schema;
