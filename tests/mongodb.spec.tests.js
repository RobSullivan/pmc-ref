var assert = require('chai').assert, 
	expect = require('chai').expect,
	should = require('chai').should();

//http://code.tutsplus.com/tutorials/build-a-complete-mvc-web-site-with-expressjs--net-34168 
describe('mongoose', function() {
    it('gets a pending connection to articles database. Implies mongodb is running.', function(next) {
        var mongoose = require('mongoose');
        mongoose.connect('mongodb://127.0.0.1:27017/test', function(err){
        	
			assert.isUndefined(err, 'error occured when connecting');
			next();
       
          
        });
    });
});


