var Model = require('../models/Base'),
	SparqlModel = require('../models/SparqlModel'),
	expect = require('chai').expect,
	spqlEndPointMockUp = {}; // mock up of sparql endpoint

describe("Models", function(){
	it("should create a new model", function(next){
		var model = new Model(spqlEndPointMockUp);
		expect(model.spql).to.exist;
		expect(model.extend).to.exist;
		next();
	});
	it('should be extendable', function(next){
		var model = new Model(spqlEndPointMockUp);
		var OtherTypeOfModel = model.extend({
			myCustomModelMethod : function(){}
		});
		var model2 = new OtherTypeOfModel(spqlEndPointMockUp);
		expect(model2.spql).to.exist;
		expect(model2.myCustomModelMethod).to.exist;
		next();
	});
});

