exports.addEncodersAndDecoders = function (schema) {
    schema.Tournament.fields.date.adminField.encoder = function (date) {
        return date.getDay() + "." + date.getMonth() + "." + (date.getFullYear() % 100) + " " + date.getHours() + ":" + date.getMinutes();
    };
    schema.Tournament.fields.date.adminField.decoder = function (date) {
        var split = date.split(/[\s:\.]+/);
        return new Date(2000 + parseInt(split[2]), parseInt(split[1]), parseInt(split[0]), parseInt(split[3]), parseInt(split[4]), 0, 0);
    };
    schema.Tournament.fields.participants.adminField.encoder = function (participants) {
        return participants.join(", ");
    };
    schema.Tournament.fields.participants.adminField.decoder = function (participants) {
        return participants.split(/, +/);
    };
    schema.User.fields.verified.encoder = function (verified) {
        return verified.toString();
    };
    schema.User.fields.verified.decoder = function (verified) {
        return verified === "true";
    };
};
