var dotenv		= require("dotenv").config();
var express 		= require("express");
var app 		= express();
var request 		= require("request");
var bodyParser 		= require("body-parser");
var compression		= require("compression");
var data = [null, null];

app.use(compression());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.get("/", function(req, res){
    var newsUrl="https://newsapi.org/v2/everything?sources=bbc-news&apiKey=" + process.env.newsapi;
    var weatherUrl="https://api.openweathermap.org/data/2.5/weather?q=Saigon&appid=" + process.env.weatherapi;
    getData(newsUrl)
        .then(function(body){
            data[0]=JSON.parse(body);
            return getData(weatherUrl);
        }, function(err){
            data[0]=0;
            console.log(err);
            return getData(weatherUrl);
        })
        .then(function(body){
            data[1]=JSON.parse(body);
            res.render("home", {data: data});
            
        }, function(err){
            data[1]=0;
            console.log(err);
            res.render("home", {data: data});
        });
});

app.post("/weather", function(req, res){
    var cityName=req.body.city;
    cityName=cityName.replace(/\s/g, '');
    var url="https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + process.env.weatherapi;
    getData(url)
        .then(function(body){
            data[1]=JSON.parse(body);
            res.render("partials/weather", {data: data});
        }, function(err){
            console.log(err);
            res.send("<h3>Opp! not found the city :(</h3>");
        });
});

app.post("/article", function(req, res){
   var newsUrl=req.body.newsUrl;
   res.render("partials/article", {newsUrl: newsUrl});
});

app.post("/home", function(req, res){
   res.render("partials/news", {data: data}); 
});


function getData(url){
    return new Promise(function(resolve, reject){
        request(url, function(error, response, body){
           if(!error && response.statusCode===200) {
               resolve(body);
           }
           else{
               reject(new Error("failed"));
           }
        });
    });
}


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started!"); 
});
