var citations = require("./collection_citations");
//run on 4/10/14 - citations collected on this date.
setInterval(function(){
	citations(function(err, result){
		if(err){
			console.log(err);
		}else{
			console.log(result);
		}

	});
}, 3000);