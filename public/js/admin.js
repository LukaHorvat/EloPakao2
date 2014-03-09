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
				}
			}
			$("#" + typeName + "-submit").html("Edit"); //Change Add button into Edit
			$("#" + typeName + "-form").attr("action", path + "/edit/" + typeName + "/" + itemId); //Change form's method from add to edit
		});
	});

	resizeFn();
});