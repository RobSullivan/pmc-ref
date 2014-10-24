var Article = require("../models/OpenAccessArticleModel"),
	Mongoose = require("mongoose"),
	assert = require("chai").assert,
	expect = require("chai").expect,
	should = require("chai").should();

//tdd tests
suite("Article model", function(){

	var testArticle;
	var expected = Mongoose.Document;

	setup(function(){
		testArticle = new Article({title: "a test article title"});
	});

	teardown(function(){
		testArticle.remove();
	});

	test("creates a Document instance without error", function(done){
		assert.isDefined(testArticle, "everything is ok");
		done();

	});

	test("is an instanceOf #Document", function(done){
		assert.instanceOf(testArticle, expected, "Error. testArticle is not an instanceOf #Document");
		done();
	});

	test("instance has title property", function(done){
		assert.property(testArticle, "title");
		done();
	});

	test("instance has undefined doi property because it was not given in setUp.", function(done){
		assert.strictEqual(testArticle.doi, undefined);
		done();
	});
	

	
	
});



