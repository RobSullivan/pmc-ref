var ArticleModel = require("../models/ArticleModelNoConnection"),
	ObjectId = require("mongoose").Types.ObjectId;


module.exports = function(request, response, mongoose){

	//might have to parse the url string first to creat the doi param
	//var doi = request.body;
	//VALIDATE THE DOI WITH REGEXP \b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])[[:graph:]])+)\b
	//see p147 of JavaScript Testing Recipes 

	var doi = request.params.doi,
		free = request.query.free,  // to use without doi param if want all free articles
		references = request.query.references,
		count = request.query.count,
		citations = request.query.citations
		errors = [];

	
	//need to populate journal path with journal title.
	if(doi && references && count==="percent"){//this condition at the top because checking doi and refs will be matched before it ever gets to count.
		
		
		ArticleModel.find({doi:doi}, "references" ,function(err, result){
			if(err) console.log(err);
			if(result[0] === undefined){
				response.json(200,{result:"doi not found"})
				//should add logging to find what dois people are submitting.

			}else{
				var totalRefCount = result[0].references.length;

			//count free articles that are refs of ObjectId(doi)
				ArticleModel.count({$and:[{is_ref_of: ObjectId(result[0]._id.toString())}, {free_access:true}]}, function(error, data){
				if(error) {
					response.set('Access-Control-Allow-Origin', '*')
					response.json(500, {error:error.message});
				}else{
					var freeRefCount = data;

					var percentage = Math.round((freeRefCount / totalRefCount) * 100);
					response.set('Access-Control-Allow-Origin', '*')
					response.json(200,{doi: doi, total_refs: totalRefCount, free_access_refs: freeRefCount, percentage: percentage});
				}

			})

			}
			
		})
		
	}else if(doi && references ==="free"){
		ArticleModel.find({doi: doi})
				.populate({
					path: "references",
					match: {free_access: true},
					select:"-_id -is_ref_of -__v -references -abstract"
				})
				.populate({path: "journal", select: "title"})
				.select("-_id -is_ref_of -__v")
				.exec(function(error, article){
					if(error){
						response.set('Access-Control-Allow-Origin', '*')
						response.json(500, {error: error.message});
					} else{
						response.set('Access-Control-Allow-Origin', '*')
						response.json(200, {article: article});
					}
				});
	} else if(doi && citations ==="free"){
		ArticleModel.find({doi: doi})
				.populate({
					path: "is_ref_of",
					match: {free_access: true},
					select:"-_id -references -is_ref_of -__v"
				})
				.select("-_id -references -__v")
				.exec(function(error, article){
					if(error){
						response.set('Access-Control-Allow-Origin', '*')
						response.json(500, {error: error.message});
					} else{
						response.set('Access-Control-Allow-Origin', '*')
						response.json(200, {article: article});
					}
				});
	} else if(doi){
		ArticleModel.find({doi: doi})
					.populate("references", "-_id -is_ref_of -__v")
					.populate("journal", "-_id title")
					.select("-_id -is_ref_of -__v")
					.exec(function(error, article){
					if(error){
						response.set('Access-Control-Allow-Origin', '*')
						response.json(500, {error: error.message});
					} else{
						response.set('Access-Control-Allow-Origin', '*')
						response.status(200).json({article: article});
					}
				});
	}  //how to contend with a doi but the wrong query?

	if(errors.length > 0) return response.json(400, {errors: errors});


}