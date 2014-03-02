var mongoose = require("mongoose");

var Article = mongoose.model("Article", { title: String, text: String, time: Date });

exports.Article = Article;
