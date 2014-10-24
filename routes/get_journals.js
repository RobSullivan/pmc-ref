var JournalModel = require("../models/JournalModelNoConnection");

module.exports = function(request, response, mongoose){

	var title = request.params.title;
		// references = request.query.references,
		// count = request.query.count;


	JournalModel.find({title: title})
				.populate({path: "articles",
							select: "title author doi free_access pmcid -_id"})
				.select("-_id -__v")
				.exec(function(err, journal){
					if(err){
						response.json(500, {error: err.message});
					}else{
						response.json(200, {journal: journal} );
					}
				});
	};

	
