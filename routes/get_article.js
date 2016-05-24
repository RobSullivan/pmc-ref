var ArticleModel = require("../models/ArticleModelNoConnection"),
	ObjectId = require("mongoose").Types.ObjectId;


module.exports = function(request, response, mongoose){

		var doi = request.params.doi,
			errors = []

		ArticleModel.find({doi: doi})
					.populate("references", "-_id -is_ref_of -__v")
					.populate("journal", "-_id title")
					.select("-_id -is_ref_of -__v")
					.exec(function(error, article){
					if(error){
						response.set('Access-Control-Allow-Origin', '*')
						response.status(500).json({error: error.message});
					} else{
						response.set('Access-Control-Allow-Origin', '*')
						response.status(200).json({article: article});
					}
				});
	

	if(errors.length > 0) return response.status(400).json({errors: errors});


}