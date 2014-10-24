"use strict";

var CitationController = require("../controllers/CitationController"),
	ArticleModel = require("../models/ArticleModel"), //no connection?
	async = require("async");

var citationController = new CitationController();

var ignorePmid = [0];
module.exports = function collect_citations(){

	//update getPmid method to search for pmids with 1+ is_ref_of values


	var seedObjectId;
	var seedPmid;
	var globalNewPmids;
	

async.waterfall([function(callback){

	citationController.getPmid(ignorePmid, callback);

}, function(pmid, callback){

	seedPmid = pmid.pmid;
	seedObjectId = pmid._id;

	console.log("collecting citations for "+seedPmid);

	citationController.fetchCitations(seedPmid, callback);

}, function(response, callback){
	var data = response.body;

	citationController.citationsExist(data, callback);


}, function(exist, citePmids, callback){
	if(exist === false){
		console.log("no citations");
		ignorePmid.push(seedPmid);
		
		console.log("number of ignored pmids"+ ignorePmid.length)
		callback(true);
	}else{

		
			citationController.parseResponse(citePmids, callback);
		


		
	}
}, function(pmids, callback){

	if(pmids.length <= 34){//if pmids.length == current size of references field, getPmid will not move on from current pmid
		console.log("already has 13 citations, probably already have it");
		ignorePmid.push(seedPmid);
		console.log("number of pmids to ignore "+ignorePmid.length);
		callback(true);

		}else{

	citationController.upsertDocs(pmids, seedObjectId, callback);
}
}], function(err, result){

	if(err){
		console.log("error: "+err);
	}else{

		ArticleModel.populateCitations(seedObjectId, function(err, result){
		if(err){
			console.log(err);
		}else{
			console(result);
		}
	});
		
	}

});


};

