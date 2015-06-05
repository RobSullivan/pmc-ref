var request = require("supertest"),
	app = require("../../app"),
	config = require("../utils/config"),
	mongoose = require("mongoose");


describe("GET routes", function(){

	app = app(config);
	request = request(app);
	

	it("/ response is successful", function(done){
		request.get("/")
			.expect("Content-Type", /html/)
			.expect(200, done);
			
	});

	it("/journals/title/:title is successful", function(done){
		request.get("/api/v1/journals/title/Nature")
		.expect(200)
		.expect("Access-Control-Allow-Origin", "*", done)
	});

	it("/api/v1/articles/doi:doi is successful", function(done){
		request.get("/api/v1/articles/doi/10.1038%2Fnature10158")
		.expect(200)
		.expect("Access-Control-Allow-Origin", "*", done);
		

	});

	it("/api/v1/references/free/ is successful", function(done){

		request.get("/api/v1/references/free/")
		.query({"doi":"10.1038%2Fnature10158"})
		.expect(200)
		.expect("Access-Control-Allow-Origin", "*", done);

	});

	it("/api/v1/articles/status/ is successful", function(done){

		request.get("/api/v1/articles/status/")
		.query({"doi":"10.1038%2Fnature10158"})
		.expect(200)
		.expect("Access-Control-Allow-Origin", "*", done);

	});

	it.skip("/api/v1/citations/doi is successful", function(done){ //#2

		request.get("/api/v1/citations/doi/10.1038%2Fnature10158")
		.expect(200)
		.expect("Access-Control-Allow-Origin", "*", done);

	});

});


