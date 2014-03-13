var serialization = require("./serialization");
var mongoose = require("mongoose");
var schema = require("./schema");

for (var modelName in schema) {
    var model = {};
    for (var field in schema[modelName].fields) {
        model[field] = schema[modelName].fields[field].type;
    }
    exports[modelName] = mongoose.model(modelName, model);
}
exports.schema = schema;
