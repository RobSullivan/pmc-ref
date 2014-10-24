var Article = require("../models/OpenAccessArticleModel"),
	Mongoose = require("mongoose"),
	assert = require("chai").assert,
	expect = require("chai").expect,
	should = require("chai").should();

//testing Mongoose's Document interface; learning features.

describe("Document interface", function(){
	beforeEach(function(done){
		testArticle = new Article({});
		compareTestArticle = new Article({});
		done();
	});
	afterEach(function(done){
		testArticle.remove();
		compareTestArticle.remove();
		done();
	});

	it("has an equals method that returns true if _ids match", function(done){

		expect(testArticle.equals(testArticle)).to.be.true;
		done();

	});

	it("has a get method that returns value of a path", function(done){

		var id = testArticle.get("_id", String);
		expect(testArticle.get("_id", String)).to.deep.equal(id);
		done();
	});

	it("has an isInit method which checks if path was initialised", function(done){

		var titleInit = testArticle.get("title", String);
		expect(testArticle.isInit(titleInit)).to.not.be.true;
		done();
	})
});