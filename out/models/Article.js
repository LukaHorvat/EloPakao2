module.exports = {
	fields: {
		title: {
			type: String,
			adminField: {
				visual: "Title",
				inputType: "textfield",
				placeholder: "Enter title"
			}
		},
		text: {
			type: String,
			adminField: {
				visual: "Content",
				inputType: "multiline",
				placeholder: "Enter content"
			}
		},
		time: {
			type: Date
		}
	},
	adminOption: {
		displayField: "title"
	}
}