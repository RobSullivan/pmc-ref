"use strict";
var ArticleModel = require("../models/ArticleModel"),
	request = require("request"),
	XmlDocument = require("xmldoc").XmlDocument,
	ObjectId = require("mongoose").Types.ObjectId,
	_ = require("underscore"),
	err = new Error;


var ignorePmid = [0];

var seedPmidObjectId;
var pmid;

var ReferencesController = function(){

	
};

ReferencesController.prototype.getPmid = function(ignorePmid, callback){


	/**
		need to retrieve one pmid that meets the condition of not having a title but without any references
	
	*/
	
	this.ignorePmid = ignorePmid;
	ArticleModel.findOne({group:"base",pmid: {$nin: ignorePmid}, references:{$size:0}}, "pmid", function(err, results){
		if(err){
			callback(null, err);			
		} 
		
		pmid = results["pmid"]
		//ignorePmid.push(pmid); instead of it being here ignorePmid should be updated when referencesExist sends back false
		seedPmidObjectId = results["_id"]

		callback(null, results);
	});
	
};

ReferencesController.prototype.fetchReferences = function(pmid, callback){

		this.pmid = pmid;

		
		var options = {
			url: "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?",
			qs : {
				dbfrom : "pubmed",
				db: "pubmed",
				id: this.pmid,
				email: "robertjsullivan.esq@gmail.com",
				project:"ccbrowser"
			}
			

		};
		
		
		request(options, function(err, response, body){
			if(err){
				callback(err);//where is the err handled then?
			}else{
				callback(err, response);//and why am I passing it back regardless. Shouldn't first arg be null?
			}
		})


	
};

ReferencesController.prototype.referencesExist = function(data, callback){

	this.data = data;

	var jsXml = new XmlDocument(this.data);

	var linkSet = jsXml.childNamed("LinkSet");

	var refCheck = false;
	var refPmids;

	//check each link set db if it matches pubmed_pubmed_refs
	linkSet.eachChild(function(linkSetDb){

		if(linkSetDb.valueWithPath("LinkName") == "pubmed_pubmed_refs"){
			refCheck = true;
			refPmids = linkSetDb;

		}

	});
	if(refCheck == false){
		ignorePmid.push(this.pmid)
	}

	callback(null, refCheck, refPmids);//is this callback ever called before eachChild finishes? 



};

ReferencesController.prototype.parseResponse = function(refPmids, callback){

	this.data = refPmids.childrenNamed("Link");//returns an array of objects
	var pmids = [];
	for(var i =0, l = this.data.length; i < l; i++){
		var pmid = parseInt(this.data[i].firstChild.val, 10); //
		pmids.push(pmid);
	}
	
	callback(null, pmids);


};



ReferencesController.prototype.upsertDocs = function(pmids, seedObjectId, callback){

	var cbErr;
	var finalCbResult;
	var timeoutCallback = callback;
	var self = this;
	
	


	
	
	for(var i = 0, l = pmids.length; i<l; i++){
					console.log("updating/adding: "+pmids[i])
					ArticleModel.findOneAndUpdate({pmid: pmids[i]}, {$addToSet: {is_ref_of: seedObjectId}}, {upsert:true}, function(err, result){
						if(err){
							cbErr = err;
						}else{
							finalCbResult = result;
						}
							
							
					})
				}

	setTimeout(function(timeoutCallback){
		
		callback(null, finalCbResult, seedObjectId);
	}, 1500);//give it 1.5s for pmids to be added before calling back out of this. 

}


	

module.exports = ReferencesController;