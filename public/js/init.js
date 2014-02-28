$(document).ready(function () {
	var footerHeight = $("#footer").height(); //initial height
	var resizeFn = function () {
		var footerY = $("#footer").offset().top;
		var documentHeight = $(window).height();
		if (footerY + footerHeight < documentHeight) {
			$("#footer").css("height", (documentHeight - footerY) + "px");
		} else {
			$("#footer").css("height", footerHeight);
		}
	};
	$(window).resize(resizeFn);
	resizeFn();
});
