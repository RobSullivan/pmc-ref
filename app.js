var express = require("express"),
	http = require("http"),
	MongoClient = require("mongodb").MongoClient,
	mongoose = require("mongoose");

var getReferences = require("./routes/get_references"),
	getArticles = require("./routes/get_articles"),
	getJournals = require("./routes/get_journals");

module.exports = function(config){
	console.log(config.mongoose)
	mongoose.connect(process.env.MONGOLAB_URI);//for local foreman start config.mongoose.host, config.mongoose.port, config.mongoose.db
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function callback(){

			
		//what? this is from mongoose docs
		//I think the app = express code is supposed to be in here
		//and I can see it coming back to bite me by leaving it out
		//but when I place it in here the main.js can't find the server 
	});

	var app = express();	
	
	app.use(express.urlencoded());

	app.get("/", function(request, response){
		//render a template
		response.send(200, "Welcome to PMC-REF [beta]")
	});

	app.get("/api/v1/articles/doi/:doi?", function(request, response){
		getArticles(request, response, db)
	});

	//currently not doing anything.
	app.get("/v1/articles/:doi/references/:param?", function(request, response){
		getReferences(request, response, db);
	});

	//not implemented
	app.get("/api/v1/journals/title/:title?", function(request, response){
		getJournals(request, response, db)// - displays articles by journal
	})

	//to implement: adding data
	//app.post("/v1/article/insert/:doi")

	return http.createServer(app);
	

}


//wrap the app in an HTTP server and export it because since everything that loads
//this module will probably want a server, not just the app function.