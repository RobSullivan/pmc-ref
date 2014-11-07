var ArticleModel = require("../models/ArticleModelNoConnection"),
	ObjectId = require("mongoose").Types.ObjectId;


module.exports = function(request, response, mongoose){


	var query = request.query;
	var doi = query.doi;
	var errors = [];

	ArticleModel.find({doi: doi})
				.populate({
					path: "references",
					match: {free_access: true},
					select:"-_id -is_ref_of -__v -references -abstract -journal"
				})
				.populate({path: "journal", select: "title"})
				.select("-_id -is_ref_of -__v")
				.exec(function(error, article){
					if(error){
						response.json(500, {error: error.message});
					} else{
						response.json(200, {article: article});
					}
				});
		
	  

	if(errors.length > 0) return response.json(400, {errors: errors});


}