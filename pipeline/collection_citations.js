"use strict";

var CitationController = require("../controllers/CitationController"),
	ArticleModel = require("../models/ArticleModel"), //no connection?
	async = require("async");

var citationController = new CitationController();

var ignorePmid = [0];
module.exports = function collect_citations(){

	


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
	//this condition is needed because every document has been collected as a citation or reference of another.
	//if when explicity collecting citations for current document and only one exists, this condition assumes
	// we have the citation already and so can move on. 
	if(pmids.length <= 1){//if pmids.length == current size of references field, getPmid will not move on from current pmid

		console.log("already has 1 citations, probably already have it");
		ignorePmid.push(seedPmid);
		//should set citation_count field here so getPmid ignores it.
		console.log("number of pmids to ignore "+ignorePmid.length);
		callback(true);

		}else{

	citationController.upsertDocs(pmids, seedObjectId, callback);
}
}], function(err, result){

	if(err){
		console.log("error: "+err);
	}else{
		console.log("about to populateCitations...this might take a while.")
		ArticleModel.populateCitations(seedObjectId, function(err, result){
		if(err){
			console.log(err);
		}else{
			console.log("waiting is over!")
			console(result);
		}
	});
		
	}

});


};

