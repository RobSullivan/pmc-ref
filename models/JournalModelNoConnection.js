var mongoose = require("mongoose");

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

var JournalModel = mongoose.model("JournalModel", journalSchema);

module.exports = JournalModel;

//this contains publisher info and acts as a reference for journal title in ArticleModel