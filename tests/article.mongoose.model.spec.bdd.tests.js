var Article = require("../models/OpenAccessArticleModel"),
	Mongoose = require("mongoose"),
	assert = require("chai").assert; //chai's assert lib. 



describe("mocked article Document", function(){
//nested describes to test state of testArticle
	beforeEach(function(done){
		testArticle = new Article({doi: "http://dx.doi.org/10.1038/nature11543"});
		done();
	});
	afterEach(function(done){
		testArticle.remove();
		done();
	});
	it("has a doi property", function(done){
		assert.strictEqual(testArticle.doi, "http://dx.doi.org/10.1038/nature11543");
		done();
	});
	it("has an undefined title", function(done){
		assert.notStrictEqual(testArticle.title, "A physical, genetic and functional sequence assembly of the barley genome");
		done();
	});
	describe("add new context by defining title", function(){
		beforeEach(function(done){
			testArticle.set({title: "A physical, genetic and functional sequence assembly of the barley genome"});
			done();
		});
		afterEach(function(done){
			testArticle.remove();
			done();
		});
		it("has a defined title", function(done){
			assert.strictEqual(testArticle.get("title"), "A physical, genetic and functional sequence assembly of the barley genome");
			done();
		});
		it("has a defined doi", function(done){
			assert.strictEqual(testArticle.get("doi"), "http://dx.doi.org/10.1038/nature11543");
			done();
		});
		it("has an _id property", function(done){
			assert.isDefined(testArticle.get("_id"), "_id has been defined");
			done();
		});
		

	});
	
});