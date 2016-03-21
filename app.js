

var express = require("express"),
	http = require("http"),
	path = require("path"),
	bodyParser = require("body-parser"),
	MongoClient = require("mongodb").MongoClient,
	mongoose = require("mongoose");

var getReferences = require("./routes/get_references"),
	getArticles = require("./routes/get_articles"),
	getJournals = require("./routes/get_journals"),
	status = require("./routes/status"),
	freeRefs = require("./routes/free_refs"),
	home = require("./routes/home"),
	about = require("./routes/about"),
	api = require("./routes/api");
	// #2


module.exports = function(config){

	//{authMechanism: 'ScramSHA1'}
	//console.log(config.mongoose.host, config.mongoose.port, config.mongoose.db)
	//why if I set db does it not connect to pmcref?
	mongoose.connect(config.mongoose.host);//for local foreman start config.mongoose.host, config.mongoose.port, config.mongoose.db For live - process.env.MONGOLAB_URI
	//mongoose.connect(process.env.MONGOLAB_URI);//for local foreman start config.mongoose.host, config.mongoose.port, config.mongoose.db For live - process.env.MONGOLAB_URI
	var db = mongoose.connection;

	//db.open()
	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function callback(){

			
		//what? this is from mongoose docs
		//I think the app = express code is supposed to be in here
		//and I can see it coming back to bite me by leaving it out
		//but when I place it in here the main.js can't find the server 
	});


	var app = express()
	app.set("views", path.resolve(process.cwd(), "views"));
	app.set("view engine", "jade");

	app.use(bodyParser.urlencoded());
	app.use(express.static(path.resolve(process.cwd(), "public")))


	//start of routes for progressive enhancement approach
	app.get("/api/v1/articles/status/", function(request, response){
		status(request, response, db);
	});

	app.get("/api/v1/references/free/", function(request, response){
		freeRefs(request, response, db);
	});


	//end of routes for progressive enchancement approach


	app.get("/", home);
	app.get("/about", about);
	app.get("/api", api);

	app.get("/api/v1/articles/doi/:doi?", function(request, response){
		getArticles(request, response, db)
	});

	
	app.get("/api/v1/journals/title/:title?", function(request, response){
		getJournals(request, response, db)// - displays articles by journal
	})


	// #2


	//currently not doing anything?
	app.get("/v1/articles/:doi/references/:param?", function(request, response){
		console.log(db)
		getReferences(request, response, db);
	});

	
	

	//to implement: adding data
	//app.post("/v1/article/insert/:doi")

	return http.createServer(app);
	

}


//wrap the app in an HTTP server and export it because since everything that loads
//this module will probably want a server, not just the app function.