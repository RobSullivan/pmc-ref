var assert = require("chai").assert,
	async = require("async");

var ArticleModel = require("../../../models/ArticleModel");


var ReferencesController = require("../../../controllers/ReferencesController");

suite("ReferencesController", function(){

	var referencesController;
	var pmid =  21743474; //10.1038/nature10158 - suprised refs aren't in pubmed http://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&db=pubmed&id=21743474
	var pmidWithRefs = 24282674; //http://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&db=pubmed&id=24282674

	setup(function(){

		referencesController = new ReferencesController();
		err = new Error();

	});

	teardown(function(){

	});

	test("has getPmid method", function(done){
		assert.isFunction(referencesController.getPmid);
		done();
	});



	suite("#getPmid", function(){

		test("accepts an err object and a callback as a parameter in order to work with async.waterfall", function(done){
			referencesController.getPmid([0], function(value){
				assert.isDefined(value, "value has been defined");
				done();
			});

		});


		test("gets an object that has pmid property", function(done){
			
			referencesController.getPmid([0], function(err, value){				
				assert.property(value, "pmid", "needs a pmid");
				done();
			});
			
		});	

		test("gets an object that has an _id property", function(done){
			referencesController.getPmid([0], function(err, value){
				assert.property(value, "_id", "result value needs an _id");
				done();
			});
		});




	});

	suite.only("#fetchReferences", function(){
		test("makes request to eutils.elink", function(done){
			referencesController.fetchReferences(pmid, function(err, response){
				
				assert.equal(response.statusCode, 200, "response failed");
				done();
			});
			
		});


	});

	suite("#referencesExist", function(){
		test("body from response contains pubmed_pubmed_refs", function(done){

			

			referencesController.fetchReferences(pmidWithRefs, function(err, response){
				var data = response.body;

				referencesController.referencesExist(data, function(err, exist){
					assert.isTrue(exist, "references exist for " + pmidWithRefs);
					done();
				});
			});
				
		});

		test("body from response does not contain pubmed_pubmed_refs", function(done){
			referencesController.fetchReferences(pmid, function(err, response){
				var data = response.body;
				referencesController.referencesExist(data, function(err, exist){
					assert.isFalse(exist, "references do not exist for "+ pmid);
					done();
				});
			});
		});
	});

	suite("#parseResponse", function(){
		test("is called if #referencesExist sends back a true value", function(done){

			async.waterfall([
				function(callback){
					referencesController.fetchReferences(pmidWithRefs, callback);
				},
				function(response, callback){
					var data = response.body;
					referencesController.referencesExist(data, callback);

				},
				function(exist, linkSet, callback){

					if(exist === false){
						//do something
						callback();
						
					}else{
						referencesController.parseResponse(linkSet, callback);
					}
				}
				], function(err, result){
					
					assert.ok(result, "oops something went wrong");
					
					done();
				});
			
		});

		test("is not called if #referencesExist sends back a false value", function(done){

			async.waterfall([
				function(callback){
					referencesController.fetchReferences(pmid, callback);
				},
				function(response, callback){
					var data = response.body;
					referencesController.referencesExist(data, callback);
				},
				function(exist, linkSet, callback){
					if(exist === false){
						callback(null, exist);
					}else{
						referencesController.parseResponse(linkSet, callback);
					}
				}], function(err, result){
					
					assert.isFalse(result, "oops looks like parseResponse was called.");
					done();
				});

		});

		test("extracts pmids from LinkName pubmed_pubmed_refs and gives them back in an array", function(done){

			async.waterfall([
				function(callback){
					referencesController.fetchReferences(pmidWithRefs, callback);
				},
				function(response, callback){
					var data = response.body;
					referencesController.referencesExist(data, callback);

				},
				function(exist, refPmids, callback){

					if(exist === false){
						//do something
						callback();
						
					}else{
						referencesController.parseResponse(refPmids, callback);
					}
				}
				], function(err, result){
					
					assert.isArray(result, "result is not an array");
					assert.include(result, 23877618, "value missing from pmid array");
					
					done();
				});

		});

		
	});

	suite("#existingPmids", function(){
		test("do these pmids already exist in database?", function(done){

			async.waterfall([
				function(callback){

					referencesController.getPmid(callback);//also testing getPmid in waterfall here, teehee.

				},
				function(dbPmid, callback){
					
					referencesController.fetchReferences(dbPmid["pmid"], callback);

				}, 
				function(response, callback){
					
					var data = response.body;
					referencesController.referencesExist(data, callback);

				}, function(exist, refPmids, callback){
					
					if(exist === false){
						callback(err, exist);
					}else{
						referencesController.parseResponse(refPmids, callback);
					
					}
				}, function(pmidArray, callback){
					

					referencesController.existingPmids(pmidArray, callback);

				}], function(err, result){
					
					assert.isArray(result, "what has gone wrong?");
					done();	

				});
			
					

				
			
		});
	});

	suite("#sortPmids", function(){
		test("distinguish between existing pmids and new pmids", function(done){

				async.waterfall([

					function(callback){

					referencesController.getPmid(callback);

				}, function(dbPmid, callback){

					referencesController.fetchReferences(dbPmid["pmid"], callback);

				}, function(response, callback){
					var data = response.body;

					referencesController.referencesExist(data, callback);
				}, function(exist, refPmids, callback){
					if(exist === false){
						callback(null, exist);
					}else{
						referencesController.parseResponse(refPmids, callback);
					}
				}, function(pmidArray, callback){

					referencesController.sortPmids(pmidArray, callback);

				}, function(pmidsExist, newPmids){
					
					assert.notInclude(newPmids, pmidsExist, "newPmids contains some existing pmids");
					done();

				}]);


		});

	});


	suite.skip("#addPmidsToDb", function(){
		test("add new pmids to db with seedObjectId in is_ref_of field", function(done){
				
				var seedObjectId;

				teardown(function(){
					ArticleModel.remove({pmid:{$in: newPmids}}, function(err, result){
						if(err){
							console.log(err);
						}else{
							console.log("newPmids removed status: "+result);
						}
					});
				});//remove newly inserted pmids after

				async.waterfall([
					function(callback){
						referencesController.getPmid(callback);
					},
					function(dbPmid, callback){
						seedObjectId = dbPmid["_id"];
						referencesController.fetchReferences(dbPmid["pmid"], callback);
					},
					function(response, callback){
						var data = response.body;
						referencesController.referencesExist(data, callback);
					},
					function(exist, refPmids, callback){
						if(exist === false){//conditions should be kept out of tests but ho hum
							callback(null, exist);
						}else{
							referencesController.parseResponse(refPmids, callback);
						}
					}, function(pmidArray, callback){

						referencesController.sortPmids(pmidArray, callback);

					}, function(existingPmids, newPmids, callback){


						this.newPmids = newPmids;//to remove after adding.
						referencesController.addPmidsToDb(newPmids, seedObjectId, callback);
					}], function(err, result){
						console.log("new pmid: "+result);
						var expectedVal = [seedObjectId];
					assert.propertyVal(result, "__v", 0, "error adding new pmids.");
					done();
				});

			
		});




	});

	suite("#updateExistingPmids", function(){

		test("", function(done){
		var seedObjectId;

		teardown(function(){
			//remove seedObjectId from is_ref_of field in existing pmids.
			ArticleModel.update({$pull:{is_ref_of: seedObjectId}, multi:true}, function(err, result){
				if(err){
					console.log(err);
				}else{
					console.log(err);
				}
			});
		});


		async.waterfall([function(callback){

			referencesController.getPmid(callback);

		}, function(dbPmid, callback){
			seedObjectId = dbPmid["_id"];
			referencesController.fetchReferences(dbPmid["pmid"], callback);

		}, function(response, callback){
			
			var data = response.body;
			referencesController.referencesExist(data, callback);
		}, function(exist, refPmids, callback){
			if(exist === false){
				callback(null, exist);
			}else{
				referencesController.parseResponse(refPmids, callback);
			}
		}, function(pmidArray, callback){
			referencesController.sortPmids(pmidArray, callback);

		}, function(existingPmids, newPmids, callback){
			referencesController.updateExistingPmids(existingPmids, seedObjectId, callback);
		}], function(err, result){
			assert.notProperty(result, "writeConcernError", "error updating existing pmids");
			done();
		});

	});
});

});