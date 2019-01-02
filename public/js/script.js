$("document").ready(function(){
	$("#search-button").on("click", function(){
		var city=$("#search-input").val();
		$.post("/weather", {city: city}, function(data){
			$("#weather-content").html(data);
		});
	});
	
	addEvent(".news-link", "#news-box");
	
	$("#home").on("click", function(){
		$.post("/home", {}, function(data){
			$("#news-box").html(data);
			addEvent(".news-link", "#news-box");
			$("#right").css("overflow-y", "scroll");
		});
	});
	
	$("#right").css("overflow-y", "scroll");
});


function addEvent(e, s){
	$(e).on("click", function(){
		var newsUrl=$(this).attr("id");
		$.post("/article", {newsUrl: newsUrl}, function(data){
			$(s).html(data);
			$("#right").css("overflow-y", "hidden");
		});
	});
}