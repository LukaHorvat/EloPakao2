module.exports = {
	fields: {
		name: {
			type: String,
			adminField: {
				visual: "Name",
				inputType: "textfield",
				placeholder: "Enter name"
			}
		},
		date: {
			type: Date,
			adminField: {
				visual: "Date",
				inputType: "textfield",
				placeholder: "DD.MM.YY hh:mm",
				encoder: function (date) {
					return date.getDay() + "." + date.getMonth() + "." + (date.getFullYear() % 100) + " " +
						date.getHours() + ":" + date.getMinutes();
				},
				decoder: function (date) {
					var split = date.split(/[\s:\.]+/);
					return new Date(2000 + parseInt(split[2]), parseInt(split[1]), parseInt(split[0]), parseInt(split[3]), parseInt(split[4]), 0, 0);
				}
			}
		},
		participants: {
			type: [String],
			adminField: {
				visual: "Participants",
				inputType: "textfield",
				placeholder: "team name,...",
				encoder: function (participants) {
					return participants.join(", ");
				},
				decoder: function (participants) {
					return participants.split(/, +/);
				}
			}
		}
	},
	adminOption: {
		displayField: "name"
	}
}