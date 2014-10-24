var request = require("supertest"),
	express = require("express");
	app = require("../app");



describe("GET /", function(){
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

// describe("GET /references", function(){
// 	it("returns 200", function(done){
// 		request(app)
// 			.get("/references")
// 			.expect(200, done)
// 			.end(function(err, res){
// 				if(err) return done(err);
// 				done();
// 			});
// 	});
// });
