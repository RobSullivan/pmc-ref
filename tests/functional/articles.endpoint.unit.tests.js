var request = require("supertest"),
	app = require("../../app"),
	mongoose = require("mongoose");


//from Mastering Web Application Development with Express

describe("GET /", function(){



	before(function(done){
		
		config = {
			mongoose: {
				host : 'mongodb://localhost/',
				port: 1337,
				db: 'test'
			}

		}

		app = app(config)
		done();

	});



	it("response is successful", function(done){
		request(app)
			.get("/")
			.expect("Content-Type", /html/)
			.expect(200)
			.end(function(err, res){
				if(err) throw err;
				done();
			})
	})
})