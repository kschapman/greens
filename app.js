var express = require('express');
var path = require('path');
var Twit = require("twit");
var config = require("./config");
var cors = require("cors");
var app = express();

app.use(function(request, response, next){
	console.log(`${request.method} request for ${request.url}`);
	next();
});

//----------------------------KENNETH--------------------------
var T = new Twit({
  consumer_key:         config.TConsumerKey,
  consumer_secret:      config.TConsumerKeySecret,
  access_token:         config.TAccessToken,
  access_token_secret:  config.TAccessTokenSecret,
});

var app = express();

app.use(cors());

app.use(express.static("./public"));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/config', express.static(path.join(__dirname)));

app.get("/tweets.json", function(request, response) {
  var params = { user_id: '31583101', count: 20 };
  T.get("statuses/user_timeline", params, function(err, twitterData, twitterResponse) {
    if (!err) {
      response.json(twitterData);
    }
  });
});
//----------------------------KENNETH--------------------------

app.listen(3000);

console.log("Server running on port 3000");
