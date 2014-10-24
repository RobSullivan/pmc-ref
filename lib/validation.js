//validate doi, references=true

//based entirely on node/services/lib/validation.js from JavaScript Testing Recipes, 2014, James Coglan.

module.exports = {

	VALID_DOI: /\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])[[:graph:]])+)\b/, //regex yoinked from http://stackoverflow.com/questions/27910/finding-a-doi-in-a-document-or-page

	checkDoi: function(){}
}