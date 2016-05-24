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

	it("/api/v1/articles/:doi is successful", function(done){
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

	//Work carried out on refactor-get-articles branch
	it("/api/v1/article/check/:doi?", function(done){
		request.get("/api/v1/article/check/10.1038%2Fnature10158")
		.expect(200)
		.end(function(err, res){
			if(err) return done(err);
			done();
		});
		//.expect("Access-Control-Allow-Origin", "*", done);
	})

	it.skip("check", function(done){
		request.get()
		.expect(function(res){
			res.body = {"doi":"10.1038/nature11543","total_refs":57,
			"free_access_refs":27,"percentage":47}
		})
	})
	//end

	it.skip("/api/v1/citations/doi is successful", function(done){ //#2

		request.get("/api/v1/citations/doi/10.1038%2Fnature10158")
		.expect(200)
		.expect("Access-Control-Allow-Origin", "*", done);

	});

});


