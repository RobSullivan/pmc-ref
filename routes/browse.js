
/*
*	GET browse page
*
*/

var fs = require('fs'),
	SparqlModel = require('../models/SparqlModel'),
	spqlEndPointMockUp = {};

exports.oaArticles = function(req, res){

	//would data normally come via a Model object 
	// that retrievs it from the db? 

	
	//go directly to the SparqlModel instead of the file
	//response of GET browse is 304 but still takes 8304ms
	var spqlModel = new SparqlModel(spqlEndPointMockUp);

	spqlModel.dataInitialisation(function(response){

		
		//response is a JSON results object so just pass it straight through to the view
		//transform the response 
		//write it to file "resultsobjecttransform.json" in the public folder

		//[I think the view will load the file when the page loads on the browser.
		//This is not good.]

		var resultsobjecttransformed = "public/resultsobjecttransformed.json";
		var byncsa = {name : "byncsaArticles", children: []}

		for(var i in response.results.bindings){
			if(response.results.bindings.hasOwnProperty(i)){

				var article = response.results.bindings[i];
				var articleTitle = article.title.value;
				var doi = article.doi.value;
				byncsa.children[i]={}; //can this be done in one line?
				byncsa.children[i].title = articleTitle;
				byncsa.children[i].doi = doi;	

			}
		}


		fs.writeFile(resultsobjecttransformed, JSON.stringify(byncsa, null, 4), function(err){
			if(err){
				console.log(err);
			} else{
				console.log("JSON saved");
			}
		})

		res.render('browse');





	})



	
};

