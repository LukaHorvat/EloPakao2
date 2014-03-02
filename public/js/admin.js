$(document).ready(function () {
	$("#options ul li a").first().focus();
	$("#options ul li a").click(function () {
		//Switch pane
		$(".control-panel-pane").css("display", "none");
		$("#" + this.target).css("display", "block");
	});
	$("#" + $("#options ul li a")[0].target).css("display", "block");
	$(".summernote").summernote();
});