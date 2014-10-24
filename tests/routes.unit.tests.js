var assert = require('chai').assert, 
	expect = require('chai').expect,
	should = require('chai').should(),
	routes = require('../routes'),
	browse = require('../routes/browse'),	//this is middleware
	request = require('supertest'),
	express = require('express');
	app = require('../app').app;


//var app = express();




suite('Routes', function(){
	
	var locals = {title: "npg cc-browser"};
	
	test('index route is a function', function(next){
		
		assert.isFunction(routes.index, 'is a function object');
		next();

	});

	//testing also if need to use next() instead of done
	//of course. next === done.

	test('index route is defined', function(next){
		assert.isDefined(routes.index, 'index is defined');
		next();
	});

	//this test is taken from SO 
	// uses a mock response object that has a render
	//function as a property
	// function takes viewName as arg but also a 'locals' object

	test('index has index view name', function(next){
		routes.index({}, {
			render: function (viewName){
				viewName.should.equal('index');
				next();
			}
		});
	});

	//now to expect render function has locals to render in index

	test('index has local params "npg cc-browser"', function(next){
		routes.index({}, {
			render: function(viewName, locals){
				locals.title.should.equal('npg cc-browser');
				next();
			}
		});
	});

	

	

	


});

suite('Browse route', function(){
	//locals is a mock JSON object
	var locals = {	
			articles: {
				head : '', 
				results: ''
			}
		};

	test('browse.oaArticles is function obj', function(next){
		assert.isFunction(browse.oaArticles, 'is a function obj');
		next();
	});

	test('browse.oaArticles route is defined', function(next){
		assert.isDefined(browse.oaArticles, 'browse is defined');
		next();

	});

	test('browse has browse view name', function(done){
		//call browse.oaArticles and pass it a req and res as an empty object and a render function as per index test above
		browse.oaArticles({}, {
			render: function(viewName){
				viewName.should.equal('browse');
				done();
			}
		});
	});

	test('browse accepts articles arg', function(done){
		
		browse.oaArticles({}, {
			render: function(viewName, locals){
				
				locals.articles.should.have.keys(['head', 'results']);
				done();
			}
		});
	});


});

suite('GET /browse', function(){
	test('respond with 200', function(done){
		request(app)
		.get('/browse')
		.expect(200, done);//using expect inside test.
	});

	test('respond with json', function(done){
		request(app)
		.get('/browse')
		.set('Accept', 'text/html')//what happens if it's sparql-results+json
		.expect('Content-Type', /html/)
		.expect(200, done);
	});
});

