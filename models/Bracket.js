module.exports = {
	fields: {
		events: {
			type: [
				{
					timestamp: Date,
					winner: String,
					loser: String
				}
			]
		},
		teams: {
			type: [String]
		}
	},
	methods: {
		generateJSON: function (maxTime) {
			var exponent = Math.ceil(Math.log2(this.events.length));
			var result = {
				allEvents: this.events,
				exponent: exponent
			};
			var size = Math.pow(2, result.exponent) - 1;
			var tree = [];
			for (var i = 0; i < exponent + 1; ++i) {
				tree.push([]);
				for (var j = 0; j < Math.pow(2, exponent - i); ++j) {
					tree[i].push("empty");
				}
			}
			var last = function (array) { return array[array.length - 1]; };
			var initialMatches = this.teams
			.reduce(function (acc, current) { //Group in sub-arrays of 2
				if (last(acc).length == 2) acc.push([current]);
				else last(acc).push(current);
				return acc;
			}, [[]])
			.map(function (group) { //Map groups to smarter objects
				return {
					team1: {
						name: group[0],
						wins: 0
					},
					team2: {
						name: group[1],
						wins: 0
					}
				};
			})

			var tree = [initialMatches];
			for (var i = 0; i < tree.length; ++i) { //Generate tree with empty matches
				debugger;
				var current = tree[i];
				if (current.length === 1) break;
				var level = [];
				for (var j = 0; j < current.length / 2; ++j) level.push({});
				tree.push(level);
			}

			this.events.forEach(function (ev) {
				
			});


			return "";
		}
	}
}