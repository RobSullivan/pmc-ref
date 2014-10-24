var ArticleModel = require("../models/ArticleModel");


ArticleModel.find({is_ref_of:{$size:1}}, "ObjectId", function(err, result){

	for(var i = 0, l = result.length; i < l; i++){
		ArticleModel.findOne({_id: result[i]["_id"], is_ref_of: result[i]["_id"]}, function(err, result){
			if(result !== null){
				console.log(result["pmid"])	
				//ArticleModel.update({_id: result["_id"]}, {$pull:{references: result["_id"]}}, function(err, result){
					//if(err) console.log(err);
					//console.log(result)
				//})
			}
			
		})
	}

	
});