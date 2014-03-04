$(document).ready(function () {
	$("#options ul li a").first().focus();

	$("#options ul li a").click(function () {
		//Switch pane
		$(".control-panel-pane").css("display", "none");
		$("#" + this.target).css("display", "block");
		resizeFn();
	});

	$("#" + $("#options ul li a")[0].target).css("display", "block");

	$(".article-item").click(function () {
		$.get(path + "/getarticle/" + this.id, function (data) {
			var article = JSON.parse(data);
			$("#article-title").attr("value", article.title);
			$("#article-text").html(article.text);
			$("#article-submit").html("Edit");
			$("#article-form").attr("action", path + "/editarticle/" + article._id);
		});
	});

	resizeFn();
});