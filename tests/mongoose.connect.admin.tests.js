var assert = require('chai').assert,
	expect = require('chai').expect,
	should = require('chai').should(),
	articleDb = require('../models/ArticleDbAdmin');



suite('Article database administration', function(){

	var dburl;
	var articleDb;

	setup(function(){
		//do some setting up
		dburl = 'mongodb://127.0.0.1:27017/articles';
		articleDb = new DbAdmin();
	}); 

	test('gets a pending connection to article database', function(done){
		//do some testing
		articleDb.connect(function(err){
			assert.isUndefined(err, 'error occured when connecting');
			done();
		});
	});

	teardown(function(){
		//teardown something.
	});

});

