var bcrypt = require("bcrypt-nodejs");

module.exports = {
	fields: {
		email: {
			type: String,
			adminField: {
				visual: "Email",
				inputType: "textfield",
				placeholder: "Enter email"
			}
		},
		password: {
			type: String,
			adminField: {
				visual: "Password hash",
				inputType: "textfield",
				placeholder: "Enter password hash"
			}
		},
		verified: {
			type: Boolean,
			adminField: {
				visual: "Email verified",
				inputType: "toggle"
			}
		}
	},
	methods: {
		checkPassword: function (password) {
			return bcrypt.compareSync(password, this.password)
		}
	},
	adminOption: {
		displayField: "email"
	}
}