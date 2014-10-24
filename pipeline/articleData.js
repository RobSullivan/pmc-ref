var DocumentController = require("../controllers/DocumentController")

var documentController = new DocumentController();

var batch = 0;

var self = this;
	


module.exports = function batch_insert_article_data(){
			documentController.createDocument(function(newDoc){
			
			var toValidate = newDoc;

			documentController.validate(toValidate, function(validatedDoc){

				var toSave = validatedDoc
				

					documentController.updateDocument(toSave, function(result){});

				
				
			
			});

			

		});
}





