var mongoose = require("mongoose");

exports.Article = mongoose.model("Article", { title: String, text: String, time: Date });
exports.Tournament = mongoose.model("Tournament", {
    name: String,
    date: Date,
    participants: [mongoose.Types.ObjectId]
});
exports.Team = mongoose.model("Team", {
    name: String,
    registrationDate: Date,
    members: [String]
});
