var request = require("supertest"),
	express = require("express");
	app = require("../../app"),
	main = require("../utils/main");


//from Mastering Web Application Development with Express
//can you mix unit assertion styles and this style below for the same application?
//It probably affects

describe("GET /", function(){



	//what if I start main before?
	before(function(done){
		
		done();

	});

	it("response is successful", function(done){
		request(app)
			.get("/")
			.set("Accept", "application/json")
			.expect("Content-Type", /json/)
			.expect(200)//done was here. Why? Removing it removed double call back warning.
			.end(function(err, res){
				if(err) throw err;
				done();
			})
	})
})