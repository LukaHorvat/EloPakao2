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
		registrationDate: {
			type: Date
		},
		members: {
			type: [ObjectId],
			adminField: {
				visual: "Members",
				inputType: "textfield",
				placeholder: "summoner name,..."
			}
		}
	},
	adminOption: {
		displayField: "name"
	}
}