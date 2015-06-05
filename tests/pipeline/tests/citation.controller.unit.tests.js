var assert = require("chai").assert,
	async = require("async"),
	_ = require("underscore"),
	ObjectId = require("mongoose").Types.ObjectId;



var CitationController = require("../../../controllers/CitationController"),
	ArticleModel = require("../../../models/ArticleModel"),
	ignorePmid = [24563719];

suite("CitationController", function(){

	var citationController;
	var pmid; 

	setup(function(){

		citationController = new CitationController();
		pmid = 21743474;//10.1038/nature10158

	});

	teardown(function(){

	});

	test("has getPmid method", function(done){
		assert.isFunction(citationController.getPmid);
		done();
	})



	suite("#getPmid", function(){
		test("gets an object containing a pmid property", function(done){

			/* if there is a pmid to get that is. Check the conditions set
			*  in the getPmid query.
			*
			*  [24563719] is a pmid to ingore
			*
			*/
			
			citationController.getPmid([24563719], function(err, value){
				var expectedNumber = value;
				assert.isNumber(expectedNumber.pmid);
				assert.isNull(err);
				done();
			})
			
		});	


	});

	suite("#fetchCitations", function(){
		test("makes request to eutils.elink", function(done){


			citationController.fetchCitations(pmid, function(err, response){
				
				assert.equal(response.statusCode, 200, "response failed");
				done();
			});
			
		});
	});


	suite("#citationsExist", function(){

		test("body from response contains pubmed_pubmed_citedin", function(done){
			citationController.fetchCitations(pmid, function(err, response){
				var data = response.body;
				citationController.citationsExist(data, function(err, exist){
					assert.isTrue(exist, "pubmed_pubmed_citedin not in response body");
					done();
				})


			});
		});

	});

	suite("#parseResponse", function(){
		test("is called if citations exist in response", function(done){

			
			async.waterfall([
				function(callback){
						citationController.fetchCitations(pmid, callback);
				}, function(response, callback){
					var data = response.body;
					citationController.citationsExist(data, callback);
				}, function(exist, citationLinkSet, callback){
					if(exist ===false){
						callback(true);
					}else{
						citationController.parseResponse(citationLinkSet, callback);
					}
				}], function(err, result){
					
					assert.ok(result, "what's gone wrong here?");
					done();
				});
		});

		test("is not called if citations in response do not exist", function(done){
			
			async.waterfall([function(callback){
				/** dbPmid is a mock object and works as long as 
				*   no one ever cites this article.
				* 	How's that for a dependency?
				*/
				dbPmid = {"pmid": 24277739};
				citationController.fetchCitations(dbPmid["pmid"], callback);

			}, function(response, callback){
				var data = response.body;
				
				citationController.citationsExist(data, callback);

			}, function(exist, citationLinkSet, callback){
				
				if(exist === false){
					callback(null, "no citations");//confusing?
				}else{
					citationController.parseResponse(citationLinkSet, callback);
				}
			}], function(err, result){

				assert.equal(result, "no citations", "#parseResponse called in error");
				done();
			});

		})



		test.only("extracts pmids from pubmed_pubmed_citedin section to an array", function(done){
				

				async.waterfall([
				function(callback){
						citationController.fetchCitations(pmid, callback);
				}, function(response, callback){
					var data = response.body;
					citationController.citationsExist(data, callback);
				}, function(exist, citationLinkSet, callback){
					if(exist ===false){
						callback(true);
					}else{
						citationController.parseResponse(citationLinkSet, callback);
					}
				}], function(err, result){
					
					assert.isArray(result, "not an array");
					done();
				});

				
			
		});

		
	});

	suite("#checkPmids", function(){

		var steps;

		setup(function(){//here I set up a function to to save repeating myself in the tests.
			steps = function(callback){

				async.waterfall([
				function(callback){
						citationController.fetchCitations(pmid, callback);
				}, function(response, callback){
					var data = response.body;
					citationController.citationsExist(data, callback);
				}, function(exist, citationLinkSet, callback){
					if(exist ===false){
						callback(true);
					}else{
						citationController.parseResponse(citationLinkSet, callback);
					}
				}], function(err, results){
					if(err){
						callback(err);
					}else{
						callback(results);
					}
				});
		}

		});

		test("do these pmids already exist in database?", function(done){
			
			steps(function(pmidArray){
				
				var pmids = pmidArray;
				citationController.existingPmids(pmids, function(err, result){
					
					assert.ok(result, "something wrong");
					done();
				});
			});
				
				
					
				
				

				
					
								
			
		});
	});


	suite("#sortPmids", function(){

		var stepsNeededBeforeSort;

		setup(function(){

			stepsNeededBeforeSort = function(callback){

				async.waterfall([
				function(callback){


					citationController.fetchCitations(pmid, callback);

				}, function(response, callback){

					var data = response.body;

					citationController.citationsExist(data, callback);

				}, function(exist, citationLinkSet, callback){
					if(exist === false){
						callback(true, exist);
					}else{
						citationController.parseResponse(citationLinkSet, callback);
					}
				}

				], function(err, result){

					callback(result);//assuming there are no errors.

					
				});


			}

		});

		test("exists", function(done){

			stepsNeededBeforeSort(function(pmidArray){

				citationController.sortPmids(pmidArray, function(err, newPmids, existingPmids){
					assert.ok(newPmids, "not ok");
					
					done();
				});

			});
		});

		test("will pass back an array", function(done){

			stepsNeededBeforeSort(function(pmidArray){

				citationController.sortPmids(pmidArray, function(err, newPmids, existingPmids){
					
						assert.isArray(newPmids);
						done();
					
				})
			});

		});

		test("sorts newPmids from existingPmids", function(done){
			stepsNeededBeforeSort(function(pmidArray){

				citationController.sortPmids(pmidArray, function(err, newPmids, existingPmids){
					//25007843 exists in database already.
					assert.notInclude(newPmids, existingPmids[4]);
					done();
				});

			});
		})

	});


	suite("#addNewPmidsToDb", function(){

		var stepsBeforeAddingPmids;

		var seedPmid;

		var seedPmidObjectId;

		var newlyAddedPmids;

		setup(function(){

			seedPmid = 24431589//has an empty is_ref_of field, has two citations not in db

			seedPmidObjectId = ObjectId("53c27cec432e687019cc6f93");

			stepsBeforeAddingPmids = function(callback){

				async.waterfall([
				function(callback){


					citationController.fetchCitations(seedPmid, callback);

				}, function(response, callback){

					var data = response.body;

					citationController.citationsExist(data, callback);

				}, function(exist, citationLinkSet, callback){
					if(exist === false){
						callback(true, exist);
					}else{
						citationController.parseResponse(citationLinkSet, callback);
					}
				}, function(pmidArray, callback){

					citationController.sortPmids(pmidArray, callback);

				}

				], function(err, newPmids, existingPmids){

					newlyAddedPmids = newPmids;

					callback(newPmids, existingPmids);

				});

			};

		});

		teardown(function(){//remove pmids just added. Not yet populating is_ref_of field so is ok to just remove new pmids 
			ArticleModel.remove({pmid:{$in: newlyAddedPmids}}, function(err, result){
				if(err){
					console.log(err);
				}else{
					console.log("newlyAddedPmids removed status: "+ result);
				}
			});

		});


		test("adds new pmids with seedPmid ObjectId in references field", function(done){

			stepsBeforeAddingPmids(function(newPmids, existingPmids){
				citationController.addNewPmidsToDb(newPmids, seedPmidObjectId, function(err, result){
					
					//then check that seedPmidObjectId is in references field of a newPmid

					ArticleModel.find({references: seedPmidObjectId}, function(err, results){
						
						var expectedReferenceValue = results[0]["references"].pop().toString();
						assert.equal(seedPmidObjectId, expectedReferenceValue);
						done();
					});

					
					

				});
			});

			
			
			
		});


		


		
	});

	suite("#updateExistingPmids", function(){
		//23537139 has existing citations in db and a range in pubmed

		var pmidWithExistingCitations;

		var pmidWithExistingCitationsObjectId;

		var stepsBeforeUpdatingExistingPmids;



		setup(function(){

			pmidWithExistingCitations = 23537139;

			pmidWithExistingCitationsObjectId = ObjectId("53c2954da98ffe281c5122f4");

			stepsBeforeUpdatingExistingPmids = function(callback){
				async.waterfall([
				function(callback){


					citationController.fetchCitations(pmidWithExistingCitations, callback);

				}, function(response, callback){

					var data = response.body;

					citationController.citationsExist(data, callback);

				}, function(exist, citationLinkSet, callback){
					if(exist === false){
						callback(true, exist);
					}else{
						citationController.parseResponse(citationLinkSet, callback);
					}
				}, function(pmidArray, callback){

					citationController.sortPmids(pmidArray, callback);

				}

				], function(err, newPmids, existingPmids){

					newlyAddedPmids = newPmids;

					callback(newPmids, existingPmids);

				});
			};

		});

		teardown(function(){
			//remove seedPmidObjectId from references field

			//five out of six pmids in database already have the seedObjectId in references field,
			// so I want to find the one that doesn;t have and use that as my test
			// $pull seedPmidObjectId from that pmid
			ArticleModel.update({pmid: 24575121}, {$pull:{references: pmidWithExistingCitationsObjectId}}, function(err, result){
				if(err){
					console.log(err);
				}else{
			 		console.log(result);
			 	}
			 });

		});

		test("is defined", function(){
			assert.isDefined(citationController.updateExistingPmids);
		});		

		test("pushes seedPmidObjectId to references field of an existing pmid", function(done){

			stepsBeforeUpdatingExistingPmids(function(newPmids, existingPmids){

				citationController.updateExistingPmids(existingPmids, pmidWithExistingCitationsObjectId, function(err, results, objectIdToTest){
					if(!err){
						//check results appears in existingPmids
						//console.log("result from update is "+ results)
						var expectedValueInExistingPmidsReferenceField = objectIdToTest // which is actually just pmidWithExistingCitationsObjectId

						ArticleModel.find({references: expectedValueInExistingPmidsReferenceField}, "pmid", function(err, expectedResults){
							
							var expectedPmidToBeUpdated = 24575121; //24575121 should now be in expectedResults if its references field has been updated with pmidWithExistingCitationsObjectId

							var expectedPmids = _.pluck(expectedResults, "pmid"); // need to extract all pmids from here.


							
							
						
							assert.include(expectedPmids, expectedPmidToBeUpdated, "pmid's references field has not been updaed with pmidWithExistingCitationsObjectId");
							done();
						});


					
				}
					
				});

				
					
			});
			
		});


	});

	suite("count_citation field is updated", function(){
		var pmidWithExistingCitationsObjectId = ObjectId("53c2954da98ffe281c5122f4");
		test("citation_count field is updated after populateCitations has finished", function(done){

			ArticleModel.populateCitations(pmidWithExistingCitationsObjectId, function(result){
				console.log(result)
				assert.ok(result);
				done();
			})

		


		 });//might be off by +/- but should be acceptable margin of error.

	});

	suite("#upsertDocs", function(){

		var steps, pmidWithExistingCitations, pmidWithOneNewCitation, existingPmidObjectId, newPmidObjecetId;
		//after #parseResponse take the array of pmids and upsert on the array. Follow #existingPmids format.
		setup(function(){

			pmidWithExistingCitations = 23537139;
			existingPmidObjectId = ObjectId("53c2954da98ffe281c5122f4");


			pmidWithOneNewCitation = 24699266;


			steps = function(callback){
				async.waterfall([function(callback){
					citationController.fetchCitations(pmidWithExistingCitations, callback);
				}, function(response, callback){
					var data = response.body;
					citationController.citationsExist(data, callback);
				}, function(exist, citationLinkSet, callback){

					citationController.parseResponse(citationLinkSet, callback);//gettin' lazy


				}], function(err, pmids){
					if(err){
						callback(err);
					}else{
						console.log(pmids)
						callback(pmids);
					}
				});
		}	
		});

		
		test("method adds new pmid", function(done){
			steps(function(pmids){


				citationController.upsertDocs(pmids, existingPmidObjectId, function(err, results){
					console.log(results)
					assert.ok(results);
					done();

				});
			});
			
		});

		test.skip("it also updates existing pmids", function(done){

		});

	});

});