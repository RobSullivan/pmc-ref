"use strict";

var ReferencesController = require("../controllers/ReferencesController"),
	ArticleModel = require("../models/ArticleModel"), //no connection?
	async = require("async");


var referencesController = new ReferencesController();
var ignorePmid = [0];

module.exports = function collect_references(){


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

	// if(pmids.length <= 30){//if pmids.length == current size of references field, getPmid will not move on from current pmid
	// 	console.log("no new citations to add");
	// 	ignorePmid.push(seedPmid);//second case where pmid needs to be ignored
	// 	callback(true);
	// }else{
	// 	referencesController.upsertDocs(pmids, seedObjectId, callback);
	// }

	referencesController.upsertDocs(pmids, seedObjectId, callback);



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

}