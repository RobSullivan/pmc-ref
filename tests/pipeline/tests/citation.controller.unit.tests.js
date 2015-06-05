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



		test("extracts pmids from pubmed_pubmed_citedin section to an array", function(done){
				

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
					

				});
				done()
			});
			
		});

		
	});

});