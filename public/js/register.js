$(document).ready(function () {
	var Color = net.brehaut.Color;
	var defaultColor = Color($("#repeat-password").css("background-color"));
	var correctColor = defaultColor.blend(Color("green"), 0.1);
	var wrongColor = defaultColor.blend(Color("red"), 0.1);
	var checkPassword = function () {
		if ($("#repeat-password").attr("value") != $("#original-password").attr("value")) {
			$("#repeat-password").css("background-color", wrongColor.toCSS());
		} else {
			$("#repeat-password").css("background-color", correctColor.toCSS());
		}
	};
	$("#repeat-password").on("change paste keyup", checkPassword);
	$("#original-password").on("change paste keyup", checkPassword);
});