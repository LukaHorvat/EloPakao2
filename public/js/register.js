$(document).ready(function () {
	var Color = net.brehaut.Color;
	var defaultColor = Color($("#repeat-password").css("background-color"));
	var correctColor = defaultColor.blend(Color("green"), 0.1);
	var wrongColor = defaultColor.blend(Color("red"), 0.1);
	var isEmail = function (email) {
		return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);	
	}
	var tooltipVisibility = {};
	var markField = function (correct, field, message) {
		if (correct) {
			$(field).css("background-color", correctColor.toCSS());
			$(field).attr("data-original-title", "");
			if (tooltipVisibility[message]) { //Make sure you don't close the tooltip if there's another message showing
				$(field).tooltip("hide");
				tooltipVisibility[message] = false;
			}
		} else {
			$(field).css("background-color", wrongColor.toCSS());
			$(field).attr("data-original-title", message); //Tooltip message
			if (!tooltipVisibility[message]) { //Prevents tooltip flashing when invoking show on a visiable tooltip
				$(field).tooltip("show");
				tooltipVisibility[message] = true;
			}
			$("#register-submit").attr("disabled", true)
		}
		return correct
	}

	var checkForm = function () {
		$("#register-submit").attr("disabled", false);

		//Email check
		if (markField(
			isEmail($("#email").attr("value")), 
			"#email", 
			"Nevaljana email adresa"
		)) {
			var currentEmail = $("#email").attr("value");
			$.post(path + "/emailavailable", { email: $("#email").attr("value") }, function (res) {
				//If the input email has changed by the time server responded, don't do anything
				if ($("#email").attr("value") === currentEmail) {
					var available = JSON.parse(res).available;
					markField(
						available,
						"#email",
						"Email adresa je već zauzeta"
					);
				}
			});
		}

		//Password length check		
		markField(
			$("#original-password").attr("value").length >= 8, 
			"#original-password", 
			"Lozinka mora imati bar 8 znakova"
		);

		//Repeated password check
		markField(
			$("#repeat-password").attr("value") === $("#original-password").attr("value"), 
			"#repeat-password", 
			"Ponovljena lozinka je različita od originalne"
		);
	};
	$("#repeat-password").on("change paste keyup", checkForm);
	$("#original-password").on("change paste keyup", checkForm);
	$("#email").on("change paste keyup", checkForm);
	var tooltipOptions = { 
		placement: "left",
		trigger: "manual",
		container: "body"
	};
	$("#email").tooltip(tooltipOptions);
	$("#original-password").tooltip(tooltipOptions);
	$("#repeat-password").tooltip(tooltipOptions);
});