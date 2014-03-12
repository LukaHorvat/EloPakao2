exports.addEncodersAndDecoders = function (schema) {
	schema.Tournament.fields.date.adminField.encoder = function (date: Date) {
		return date.getDay() + "." + date.getMonth() + "." + (date.getFullYear() % 100) + " " +
			date.getHours() + ":" + date.getMinutes();
	};
	schema.Tournament.fields.date.adminField.decoder = function (date: string) {
		var split = date.split(/[\s:\.]+/);
		return new Date(2000 + parseInt(split[2]), parseInt(split[1]), parseInt(split[0]), parseInt(split[3]), parseInt(split[4]), 0, 0);
	};	
	schema.Tournament.fields.participants.adminField.encoder = function (participants: string[]) {
		return participants.join(", ");
	};
	schema.Tournament.fields.participants.adminField.decoder = function (participants: string) {
		return participants.split(/, +/);
	};
	schema.User.fields.verified.encoder = function (verified: boolean) {
		return verified.toString();
	};
	schema.User.fields.verified.decoder = function (verified: string) {
		return verified === "true";
	};
}