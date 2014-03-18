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
		},
		elimination: {
			type: String
		},
		bestOf: {
			type: Number
		}
	},
	methods: {
		generateJSON: require("../coffee/BracketGenerateJSON")
	}
}