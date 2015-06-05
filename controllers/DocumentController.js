	"use strict";

var request = require("request"),
	util = require("util"),
	async = require("async"),
	mongoose = require("mongoose"),
	XmlDocument = require("xmldoc").XmlDocument,
	JournalModel = require("../models/JournalModel"),//can only have one model with a connection
	ArticleModel = require("../models/ArticleModelNoConnection");



var DocumentController = function(){
 	//any constructor needed?
 	//what about initialising queue of pmids
 	var pmidQueue = [];

 	




 	return {
 		pmidQueue : pmidQueue,
 		getPmid: this.getPmid,
 		initQueue : this.initQueue,
 		getQueue: this.getQueue,
 		fetchArticleData: this.fetchArticleData,
 		toHash: this.toHash,
 		createDocument: this.createDocument,
 		checkJournalTitle: this.checkJournalTitle,
 		updateDocument: this.updateDocument,
 		validate : this.validate
 	}
 	

	

};

DocumentController.prototype.initQueue = function(callback){
	console.log("hitting initQue")
		//queue consists of docs that do not have title fields.
		//ignore pmid = 0 because it means no data in pubmed.
		ArticleModel.findOne({year: {$exists: false}}, "pmid", function(err, arrayResult){
				if(err){
					callback(err);
				}else{
					//arrayResult contains objects with pmid and _id keys.
					callback(null, arrayResult);
				}
		});

}



DocumentController.prototype.getQueue = function(callback) {
	console.log("hitting getQue")
	//needs some initalisation so can be emptied
	//what will be in the queue? Should the pmid's ObjectId be there too?
	//how am I linking these pmids as references or citations?
	var pmidArray = [];

	this.initQueue(function(nullObj, pmidObjectArray){//I don't like this nullObj business being passed.
		
		pmidArray.push(pmidObjectArray["pmid"])
		// for(var i = 0, l = pmidObjectArray.length; i < l; i++){
		// 		var pmidObj = pmidObjectArray.pop()
		// 		pmidArray.push(pmidObj["pmid"]);
		// }
		callback(null, pmidArray);
	});
	
	
};


DocumentController.prototype.getPmid = function(callback){

	ArticleModel.findOne({title:{$exists:false}}, "pmid", function(err, result){
		if(err) console.log(err);
		console.log("pmid is: "+ result["pmid"]);
			callback(null, result["pmid"])
	});


	console.log("hitting getPmid")

		//var activePmidArray = [];//everytime getPmid is called this array goes down one
		//when array is empty, more pmids are sought from getQueue -> initQueue
		//

		// this.getQueue(function(nullObj, pmids){
		// 	console.log("remaining pmids to gather data for: "+ pmids.length)
		// 	var num = pmids.pop();

		// 	callback(null, num);
		// });
};

DocumentController.prototype.fetchArticleData = function(pmid, callback){
	
	this.pmid = pmid;

	var options = {
		url: "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?",
		qs: {
			db: "pubmed",
			id: this.pmid,
			retmode: "xml",
			email: "robertjsullivan.esq@gmail.com",
			project:"ccbrowser"

		}
	};
	
	
	request(options, function(err, response, body){
		if(!err){
		callback(null, response);//adding null in here because of async.waterfall sig - don't fully understand.
	}
	});
	

	
};




DocumentController.prototype.createDocument = function(callback){

	//get first item from queue.
	//send off request
	//"hash" the response
	//provide the doc to the callback
	//this.pmid = pmid;
	//var data;
	var self = this;
	var getQueue = this.getQueue;
	//var fetchArticleData = this.fetchArticleData;

	//async waterfall of functions
	async.waterfall([
		function(cb){
			self.getPmid(cb)// instead of getting the whole queue, how about a getPmid()?
		},
		function(pmid, cb){
			//var pmid = array.pop()
			console.log("pmid: " + pmid )
			self.fetchArticleData(pmid, cb);
		}, function(data, cb){
			self.toHash(data, cb);
		}], callback);
		
	
};
//rename
DocumentController.prototype.toHash = function(data, callback){
	
	this.data = data.body;
	var xmlResponse = new XmlDocument(this.data);
	var	doc = {};
	//journal ObjectId biz
	var ObjectId = mongoose.Types.ObjectId;
	var journalId;
	var journalObjectId;
	
	//extract sections
	var pubMedArticle = xmlResponse.childNamed("PubmedArticle");
	
	var medlineCitation = pubMedArticle.childNamed("MedlineCitation");
	
	var pubMedData = pubMedArticle.childNamed("PubmedData");

	var articleIdList = pubMedData.childNamed("ArticleIdList");
	
	//article fields - just assign. Assumes all these values are present
	//in XML. how to handle it is they are not?
	var title = medlineCitation.valueWithPath("Article.ArticleTitle")
	
	if(articleIdList.childWithAttribute("IdType", "doi") === undefined){
		var doi = undefined;
	}else{
		doi = articleIdList.childWithAttribute("IdType", "doi").val;
	}

	
	
	var pmid = articleIdList.childWithAttribute("IdType", "pubmed").val;
	if(articleIdList.childWithAttribute("IdType", "pmc") === undefined){
		var pmcid = undefined;
	}else{
		pmcid = pmcid = articleIdList.childWithAttribute("IdType", "pmc").val;
	}
	
	var abstract = medlineCitation.valueWithPath("Article.Abstract.AbstractText");

	var articleDate = medlineCitation.valueWithPath("Article.ArticleDate.Year"); //not alwasy present either.
	var author = medlineCitation.valueWithPath("Article.AuthorList.Author.LastName"); //surname only. first author in list taken
	var pubDate = medlineCitation.valueWithPath("Article.Journal.JournalIssue.PubDate.Year") || "0000";

	//now to add journal title
	var journalTitle = medlineCitation.valueWithPath("Article.Journal.ISOAbbreviation")

	
	//checkJournalTitle
	this.checkJournalTitle(journalTitle, function(result){
			//if any of these fields are undefined...?

			journalId = result["_id"].toString();
			journalObjectId = ObjectId(journalId);

			doc["title"] = title;
			doc["doi"] = doi;
			doc["pmid"] = pmid; //already have this because taking pmid from queue
			doc["pmcid"] = pmcid;
			
			doc["abstract"] = abstract;//if not undefined	
			
			
			doc["year"] = pubDate;
			doc["author"] = author;
			doc["journal"] = journalObjectId;
			//remove any undefined fields after the fact?
			
			callback(doc);



	})

	
	

};


DocumentController.prototype.checkJournalTitle = function(journalTitle, callback){

	
	
	

	JournalModel.find({title: journalTitle})
					.select("ObjectId title")
					.exec(function(err, journal){
						if(err){
							console.log(err);
						}else if (journal.length === 0){//results array is empty
							
							
							JournalModel.addJournal(journalTitle, function(err, result){
								if(err){
									callback(err);
								}else{
								

									callback(result);
								}
							});
						}else{
							//passback the journalObj because a search result is an array.
							var journalObj = journal.pop();
							
							callback(journalObj);
						}
					});

	

};

DocumentController.prototype.validate = function(doc, callback){
	//not mongoose validate because that appears to be done in findOneAndUpdate op.
	//just want to check each required value is defined.
	//if not it needs to be removed from doc.
	//also set boolean value if pmcid exists.
	var vDoc;

	for(var i in doc){
		if(doc.hasOwnProperty(i)){
			if(doc[i] === undefined){
				delete doc[i];

				
			}
			
		}
		
	};
	console.log(doc)
	callback(doc)

	

		
	
}

DocumentController.prototype.updateDocument = function(doc, callback){
	//works and doesn't overwrite existing pmid but be careful
	//findONeAndUpdate calls mongo's findAndModify which returns the doc to app




	ArticleModel.findOneAndUpdate({pmid: doc["pmid"]}, doc, function(err, result){
		if(err){
			callback(err);
		}else{
			callback(result)
		}
	});

};




module.exports = DocumentController;