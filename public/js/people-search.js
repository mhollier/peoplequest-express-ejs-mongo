// Client-side logic for people search.

$(function () {

	// Show/hide loading indicator
	$(document).ajaxStart(function () {
		$("#loadingIndicator").modal("show");
	}).ajaxStop(function () {
		$("#loadingIndicator").modal("hide");
	});

	var ajaxFormSubmit = function () {
		var $form = $(this);

		var options = {
			url: $form.attr("action"),
			type: $form.attr("method"),
			data: $form.serialize()
		};

		$.ajax(options).done(function (data) {
			var $newHtml = $(data);
			$("#peopleList").replaceWith($newHtml);
		});
		return false;
	};

	// Submit the search form via AJAX
	$("form[peoplequest-enable-ajax='true']").submit(ajaxFormSubmit);
});