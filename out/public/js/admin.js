$(document).ready(function () {
	$("#options ul li a").click(function () {
		//Switch pane
		$(".control-panel-pane").css("display", "none");
		$("#" + this.attributes["option-target"].value).css("display", "block");
		history.pushState(null, null, "#" + this.attributes["option-target"].value);
		resizeFn();
	});

	if (window.location.hash === "") {
		$("#" + $("#options ul li a")[0].attributes["option-target"].value).css("display", "block");
	} else {
		$(window.location.hash).css("display", "block");
	}

	$(".item-remove").click(function () {
		window.location = path + "/remove/" + this.attributes["item-type"].value + "/" + this.attributes["item-id"].value;
	});

	$(".item").click(function () {
		var typeName = this.attributes["item-type"].value;
		var itemId = this.attributes["item-id"].value;
		$.get(path + "/get/" + typeName + "/" + this.attributes["item-id"].value, function (data) {
			var item = JSON.parse(data);
			for (var field in item) {
				var select = $("#" + field);
				switch (item[field].type) {
					case "multiline":
						select.html(item[field].value);
						break;
					case "textfield":
						select.attr("value", item[field].value);
						break;
					case "toggle":
						select.attr("value", item[field].value.toString());
						var toggleButton = $(".toggle-button[hidden-field=\"" + field + "\"]");
						if (item[field].value) {
							toggleButton.html("Yes");
							toggleButton.removeClass("btn-danger");
							toggleButton.addClass("btn-success");
						} else {
							toggleButton.html("No");
							toggleButton.addClass("btn-danger");
							toggleButton.removeClass("btn-success");
						}
						break;
					default:
						console.log("Unsupported input type: " + item[field].type);
						break;
				}
			}
			$("#" + typeName + "-submit").html("Edit"); //Change Add button into Edit
			$("#" + typeName + "-form").attr("action", path + "/edit/" + typeName + "/" + itemId); //Change form's method from add to edit
		});
	});

	$(".toggle-button").click(function () {
		if ($(this).html() === "Yes") {
			$(this).html("No");
			$("#" + $(this).attr("hidden-field")).attr("value", "false");
		} else {
			$(this).html("Yes");
			$("#" + $(this).attr("hidden-field")).attr("value", "true");
		}
		$(this).toggleClass("btn-danger btn-success");
	});

	resizeFn();
});