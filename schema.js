var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var Mixed = mongoose.Types.Mixed;

var schema = {
	Article: {
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
	},
	Tournament: {
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
					decoder: function (date: string) {
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
					encoder: function (participants: string[]) {
						return participants.join(", ");
					},
					decoder: function (participants: string) {
						return participants.split(/, +/);
					}
				}
			}
		},
		adminOption: {
			displayField: "name"
		}
	},
	Team: {
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
	},
	User: {
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
		adminOption: {
			displayField: "email"
		}
	}
}

module.exports = schema;