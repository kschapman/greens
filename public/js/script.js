$.ajax({
	url:"http://localhost:3000/tweets.json",
	dataType:"json",
	success: function(data){
		for (var i = 0; i < data.length; i++) {
			var tweet = data[i];
			console.log(data[i]);
			$("#twitter-feed").append("<p class='tweet-font'>"+tweet.text+"</p></br>");
		}
	},
	error: function(){
		console.log("somthing wrong");
	}
});
