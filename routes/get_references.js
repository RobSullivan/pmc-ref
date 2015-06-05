var ArticleModel = require("../models/ArticleModelNoConnection")


module.exports = function(request, response, mongoose){

	//might have to parse the url string first to creat the doi param
	//var doi = request.body;


	var doi = request.params.doi,
		free = request.query.free, // will be a boolean if free is present. changes query to use.
		errors = [];

	//do some checking on doi format
	//do some checking on free
	if(errors.length > 0) return response.json(400, {errors: errors});

	// response.json(200, {doi: doi,
	// 					free: free,
	// 					errors: errors,
	// 					percentage: percentage});

	ArticleModel.findOne({doi: doi})
				.populate("references")
				.exec(function(error, refs){
					if(error){
						response.set('Access-Control-Allow-Origin', '*')
						response.json(500, {error: error.message});
					} else{
						response.set('Access-Control-Allow-Origin', '*')
						response.json(200, {refs: refs});
					}
				});

	//
	
	
}

// trying to have 10.1038/nature11413 as a the doi param does not work because express thinks thinks
// is  a different route. It's seeing `references/:doi/anotherRoute`