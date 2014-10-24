var mongoose = require("mongoose");
var connection = mongoose.connect("mongodb://localhost/test")//remove connectino when move into app

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var journalSchema = new Schema({

	//use default ObjectId
	title : {type: String, index: true},
	mapping: {type: String, index: true},
	free_access: Boolean,
	publisher: String,
	articles: [{type: ObjectId, ref: 'ArticleModel'}],
	issn : String
});

journalSchema.statics.addJournal = function(journalTitle, callback){

	var JournalModel = mongoose.model("JournalModel");

	this.create({title: journalTitle}, function(err, result){
		if(err){
			console.log(err);
		}else{
			callback(result);
		}
	})

};

var JournalModel = connection.model("JournalModel", journalSchema);



module.exports = JournalModel;

//this contains publisher info and acts as a reference for journal title in ArticleModel