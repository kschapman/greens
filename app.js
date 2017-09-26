var express = require('express');
var path = require('path');
var Twit = require("twit");
var config = require("./config");
var cors = require("cors");
var app = express();

app.use(function(request, response, next){
<<<<<<< HEAD
	console.log(request.method + " request for" + request.url);
=======
	console.log(request.method + " request for " + request.url);
>>>>>>> 499762716897f14eaae7816058a8ef062d618496
	next();
});

// Finding specific files for connection
app.use(cors());
app.use(express.static("./public"));

app.use(express.static("./public"));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/config', express.static(path.join(__dirname)));

//----------------------------KENNETH--------------------------
var T = new Twit({
  consumer_key:         config.TConsumerKey,
  consumer_secret:      config.TConsumerKeySecret,
  access_token:         config.TAccessToken,
  access_token_secret:  config.TAccessTokenSecret,
});

app.get("/tweets.json", function(request, response) {
  var params = { user_id: '31583101', count: 20 };
  T.get("statuses/user_timeline", params, function(err, twitterData, twitterResponse) {
    if (!err) {
      response.json(twitterData);
    }
  });
});

app.listen(3000);

console.log("Server running on port 3000");