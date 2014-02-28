$(document).ready(function () {
	var footerY = $("#footer").offset().top;
	var footerHeight = $("#footer").height();
	var documentHeight = $(document).height();
	if (footerY + footerHeight < documentHeight) {
		$("#footer").css("height", (documentHeight - footerY) + "px");
	}
});
