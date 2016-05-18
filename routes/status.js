var ArticleModel = require("../models/ArticleModelNoConnection"),
	ObjectId = require("mongoose").Types.ObjectId;


module.exports = function(request, response, mongoose){

	//might have to parse the url string first to creat the doi param
	//var doi = request.body;
	//VALIDATE THE DOI WITH REGEXP \b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])[[:graph:]])+)\b
	//see p147 of JavaScript Testing Recipes 

	var query = request.query
	var doi = query.doi

		
	var	errors = [];

	//do some checking on doi format?
	//do some checking on references. For example can pass false and it will give all refs.
	//can make parameters optional. :free? default is to show all.

	

	// response.json(200, {doi: doi,
	// 					free: free,
	// 					errors: errors,
	// 					percentage: percentage});
	
	//choose query to run based on condtions of params and query...bleugh.
	//need to populate journal path with journal title.
	//this condition at the top because checking doi and refs will be matched before it ever gets to count.
		//need to refactor this asap.
		//get ObjectId from doi
		ArticleModel.find({doi:doi}, "references" ,function(err, result){
			if(err) console.log(err);
			if(result[0] === undefined){
				response.set('Access-Control-Allow-Origin', '*')
				response.status(200).json({result:"doi not found"})

			}else{
				var totalRefCount = result[0].references.length;

			//count free articles that are refs of ObjectId(doi)
				ArticleModel.count({$and:[{is_ref_of: ObjectId(result[0]._id.toString())}, {free_access:true}]}, function(error, data){
				if(error) {
					response.set('Access-Control-Allow-Origin', '*')
					response.status(500).json({error:error.message});
				}else{
					var freeRefCount = data;

					var percentage = Math.round((freeRefCount / totalRefCount) * 100);
					
					response.set('Access-Control-Allow-Origin', '*')
					response.status(200).json({doi: doi, total_refs: totalRefCount, free_access_refs: freeRefCount, percentage: percentage});
				}

			})

			}
			
		})
		
	  //how to contend with a doi but the wrong query?

	if(errors.length > 0) return response.status(400).json({errors: errors});


}