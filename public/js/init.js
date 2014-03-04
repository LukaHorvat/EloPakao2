var footerHeight = 0;
var resizeFn = function () {
	var footerY = $("#footer").offset().top;
	var documentHeight = $(window).height();
	if (footerY + footerHeight < documentHeight) {
		$("#footer").css("height", (documentHeight - footerY) + "px");
	} else {
		$("#footer").css("height", footerHeight);
	}
};

$(document).ready(function () {
	footerHeight = $("#footer").height(); //initial height
	$(window).resize(resizeFn);
	resizeFn();
});
