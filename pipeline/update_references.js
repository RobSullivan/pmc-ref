"use strict";

var ReferencesController = require("../controllers/ReferencesController"),
	ArticleModel = require("../models/ArticleModel"), //no connection?
	async = require("async");


var referencesController = new ReferencesController();
var ignorePmid = [0];

module.exports = function collect_references(){


//the order of the updateExisting and addNew presumes some exist and some are new.


	var seedObjectId;
	var seedPmid;

	var globalNewPmids;



async.waterfall([function(callback){
	console.log("ignoring "+ignorePmid.length+" pmids");
	referencesController.getPmid(ignorePmid, callback);

}, function(pmid, callback){

	seedPmid = pmid.pmid;
	seedObjectId = pmid._id;
	console.log("collecting references for "+seedPmid);
	referencesController.fetchReferences(seedPmid, callback);	

}, function(response, callback){

	var data = response.body;
	referencesController.referencesExist(data, callback);


}, function(exist, refPmids, callback){

	if(exist === false){

		console.log("no references");
		ignorePmid.push(seedPmid);

		callback(true); //break the waterfall chain https://github.com/caolan/async/issues/11

	}else{
		//console.log("exist: "+exist)
		referencesController.parseResponse(refPmids, callback);

	}




}, function(pmids, callback){

	if(pmids.length <= 30){//if pmids.length == current size of references field, getPmid will not move on from current pmid
		console.log("no new citations to add");
		ignorePmid.push(seedPmid);//second case where pmid needs to be ignored
		callback(true);
	}else{
		referencesController.upsertDocs(pmids, seedObjectId, callback);
	}



}], function(err, result){
	if(err){
		console.log("error: "+ err);
	}else{
		ArticleModel.populateReferences(seedObjectId, function(err, result){
			if(err){
				console.log(err);
			}else{
				console.log("populateReferences status: "+ result);
			}

		});
	}
});





// async.waterfall([function(callback){

// 	referencesController.getPmid(callback);

// }, function(pmid, callback){

// 	seedPmid = pmid["pmid"];

// 	seedObjectId = pmid["_id"];

// 	console.log("getting data for: "+seedPmid);

// 	referencesController.fetchReferences(seedPmid, callback);

// }, function(response, callback){

// 	var data = response.body;

// 	referencesController.referencesExist(data, callback);

// }, function(exist, refPmids, callback){

// 	if(exist === false){

// 		ignorePmid.push(seedPmid);

// 		callback(true); //break the waterfall chain https://github.com/caolan/async/issues/11

// 	}else{
// 		//console.log("exist: "+exist)
// 		referencesController.parseResponse(refPmids, callback);

// 	}
// }, function(pmidArray, callback){


// 	referencesController.sortPmids(pmidArray, callback);

// }, function(existingPmids, newPmids, callback){

	

// 	globalNewPmids = newPmids;

// 	referencesController.updateExistingPmids(existingPmids, seedObjectId, callback);
// 	//discard the results of updateExistingPmids

// }, function(discard, seedObjectId, callback){

// 	console.log("globalNewPmids: "+globalNewPmids);
// 	referencesController.addPmidsToDb(globalNewPmids, seedObjectId, callback);

// }, function(fin, callback){

// 	ArticleModel.populateReferences(seedObjectId, function(err, result){
// 		if(err){
// 			callback(null, err);
// 		}else{
// 			callback(null, result);
// 		}
// 	});
// }], function(err, result){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log(result);
// 	}
// });

}