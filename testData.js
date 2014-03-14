var db = require("./db");
var async = require("async");

module.exports.fill = function () {
	//Cleanup and reconstruct
	async.series([
		function (cb) {
			db.Tournament.findOneAndRemove({ name: "test tourny" }, function (err, obj) {
				if (obj) {
					db.Bracket.findByIdAndRemove(obj.bracket, cb);
				} else cb();
			});
		}
	], function () {
		async.series([
			function (cb) {
				var teams = ["a", "b", "c", "d", "e", "f", "g", "h"];
				var bracket = new db.Bracket({
					teams: teams
				});
				bracket.events.push({
					timestamp: new Date(2014, 1),
					winner: "a",
					loser: "b"
				});
				bracket.events.push({
					timestamp: new Date(2014, 2),
					winner: "c",
					loser: "d"
				});
				bracket.events.push({
					timestamp: new Date(2014, 3),
					winner: "a",
					loser: "c"
				});
				bracket.save(function (err, obj) {
					console.log(obj.generateJSON(new Date(2014, 4)));
					var tourny = new db.Tournament({
						name: "test tourny",
						date: new Date(),
						participants: teams,
						bracket: obj._id
					});
					tourny.save(cb);
				});
			}
		]);
	});
}