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
						response.set('Access-Control-Allow-Origin', '*')
						response.status(500).json({error: err.message});
					}else{
						response.set('Access-Control-Allow-Origin', '*')
						response.status(200).json({journal: journal} );
					}
				});
	};

	
