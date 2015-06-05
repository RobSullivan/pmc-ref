var DocumentController = require("../../../controllers/DocumentController"),
	assert = require("chai").assert,
	mongoose = require("mongoose"),
	ValidationError = require("mongoose/lib/error/validation"),
	JournalModel = require("../../../models/JournalModel");

suite("DocumentController", function(){
	var documentController;
	var pmid = 24800237;

	setup(function(){
		documentController = new DocumentController();
	});

	// teardown(function(){
	// 	documentController = undefined;
		

	// });

	test("has a toHash method", function(){

		assert.isFunction(documentController.toHash, "turns xml2js object to hash object")

	});

	test("get an xml response", function(done){

		var tempObj;

		documentController.fetchArticleData(pmid, function(data){
			
			

			
			assert.isDefined(data, "xml has been defined")
			done();
		});
	});

	test.only("return journal title from XML response", function(done){

		var articleJournal;
		console.log(pmid)
		
		documentController.fetchArticleData(pmid, function(nullObj, data){

			this.xml = data;
			
			documentController.toHash(this.xml, function(articleJournal){
			assert.equal(articleJournal["journal"], "53f8a9de982e72481b718d57");//ObjectId for Biomed Res Int oh yeah
			done();

			});

			

		});

	
		
		
	});


	test("checkJournalTitle handles if journal is not in database", function(done){

		var journalTitle = "BioMed Res Int";
		var actualUndefinedJournal = 0;

		documentController.checkJournalTitle(journalTitle, function(result){
			actualUndefinedJournal = result;

			assert.notEqual(actualUndefinedJournal.length, 0, "oops, journal is actually in db");
			done();

		});

		

	});



		

		

		test("maintain a queue of pmids to work from", function(done){
			var pmidQueue;
			done();
		})



		suite("#getQueue", function(){

			test("creates an array of just pmids from the intialised queue", function(done){
					/**
						

					*/
					documentController.getQueue(function(obj, pmidArray){
						
							assert.isArray(pmidArray, "pmidArray is not array");
							assert.isNumber(pmidArray[0], "expected a pmid in pmidArray");
							done();	
					});
					
			});

		});

		suite("#getPmid pops a pmid from array created in #getQueue", function(){
				test("just one pmid, please", function(done){
					documentController.getPmid(function(err, pmid){
						assert.isNumber(pmid, "a pmid!");
						//assert length is less, somehow
						done();
					})
				})

		});



});









suite("#createDocument", function(){
	var pmid = 24800237;
	var documentController;

	setup(function(){
		documentController = new DocumentController();

	});

	// teardown(function(){
	// 		JournalModel.remove({title:"Biomed Res Int"}, function(err, result){
	// 		if(err){
	// 			console.log(err);
	// 		}else{
	// 			console.log("test journal removed", result);
	// 		}
	// 	});
	// 	});

	test.skip("method creates document for entry to database", function(done){

		var expectedDoc = {};

		documentController.createDocument(function(newDoc){

			expectedDoc = newDoc;
			assert.propertyVal(expectedDoc, "title", "Human pluripotent stem cell-derived cardiomyocytes as research and therapeutic tools.", "doc doesn't have title property or expected value");
			assert.propertyVal(expectedDoc, "doi", "10.1155/2014/512831", "doc doesn't have doi property or expected doi")
			done();

		});
				

	});

	test("successfully calls #checkJournalTitle", function(done){
			var expectedDoc = {};
			var ObjectId = mongoose.Types.ObjectId;
			documentController.createDocument(function(newDoc){
				expectedDoc = newDoc;
				
				assert.instanceOf(expectedDoc.journal, ObjectId, "journal is an ObjectId");
				done();
			});

	});

	test("check new document for undefined properties before adding it to db", function(done){
		var expectedDoc = {};

		documentController.createDocument(function(newDoc){
			expectedDoc = newDoc;
			documentController.validate(expectedDoc, function(result){
				assert.notProperty(result, "undefined");//of course doesn't work when abstract IS defined.
				done();
			})
		})
	})

	test("update doc in database", function(done){
		//Validation occurs when a document attempts to be saved, after defaults have been applied
		

		//if there isn't an abstract the value is undefined so it cannot be added to database because of error
		documentController.createDocument(function(newDoc){
			
			var toValidate = newDoc;

			documentController.validate(toValidate, function(validatedDoc){

				var toSave = validatedDoc

				documentController.updateDocument(toSave, function(result){//update doc passes one object, either err or result
					//console.log(result)
					assert.isString(result.title);
					done();
				})
			
			});

			

		});
		
	})
	

});

