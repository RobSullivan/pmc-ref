var Model = require('../models/Base'),
	SparqlModel = require('../models/SparqlModel'),
	SparqlClient = require('sparql-client'),
	expect = require('chai').expect,
	spqlEndPointMockUp = {},
	fs = require('fs'); // mock up of sparql endpoint


describe("SparqlModel", function(){
	it("should extend model/Base.js", function(done){
		var base = new Model(spqlEndPointMockUp);
		var ExtendedModel = base.extend({
			someMethod : function(){}
		});
		var spqlModel = new ExtendedModel(spqlEndPointMockUp);
		expect(spqlModel).to.exist;
		done();
	});

});

// now that class exists a new test suite where it is set up to test methods
// against.

describe("SparqlModel", function(){

	//var model = new Model(spqlEndPointMockUp);
	var spqlModel = new SparqlModel(spqlEndPointMockUp);

	it("should have a dataInitialisation method", function(done){
		expect(spqlModel).to.respondTo('dataInitialisation');
		done();
	})
	


});

// now look at some of what the methods return, the params they accept, the method signature




describe('SparqlModel #dataInitialisation', function(){
	//disable timeout, somehow, so it is not needed as a CL option
	

	
		var mockData = '';
		var spqlModel2 = new SparqlModel(spqlEndPointMockUp);
		


		it('should run without error/not timeout', function(done){

			
		spqlModel2.dataInitialisation(function(res){
				//do nothing with res
				

				done();
			});
		
			
		
		});

		it('should return a JSON Results Object', function(done){
			//writing another test that will take ages because don't want to delete the one above just yet.
			//to get results out of the dataInit function pass a res var and assign it to the empty jsonObj
			//according to w3 standards the JSON Results Object from a SPARQL Query contains either the keys head or results,
			//or both depending on the form of the query http://www.w3.org/TR/2013/REC-sparql11-results-json-20130321/#json-result-object.
			//so this test expects those keys to be present in the object returned by dataInit.

			var jsonObj = {};

			spqlModel2.dataInitialisation(function(res){
				
				
				
				

				jsonObj = res;

				console.log(jsonObj.results.bindings);
				
				expect(jsonObj).to.have.keys(['head', 'results']);//head and results keys are sparqlJson standard
				
				done();
				


			});



		})

		

	
})


describe('SparqlModel #saveData', function(){

	//write data out to file, for now

	var spqlModel3 = new SparqlModel(spqlEndPointMockUp)

	it.only('should write the JSON results object to json file', function(done)
	{
		
		spqlModel3.dataInitialisation(function(res){
			
			
			fs.writeFile('data.json', JSON.stringify(res, null, 4), function(err){
				if(!err){
					expect(res).to.have.keys(['head', 'results']);
					console.log('wrote data to data.json')
				} else{
					throw err;
				}

				//done();
			})
			//console.log(res.statusCode);
			fs.readFile('data.json', 'utf8', function(err, data){
				if(!err){
					//expect(data).to.exist; why did I comment out this expect?
					//console.log(data);
				} else{
					throw err;
				}
				done();
			});
			
			

		});

		


		
		
	})

	
})