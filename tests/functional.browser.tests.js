var chai = require('chai'),
	assert = chai.assert,
	expect = chai.expect,
	webdriverjs = require('webdriverjs/index');

//start of BDD test



describe ('cc-browser', function(){

	this.timeout(9999999);
	var client = {};

	//set up

	before(function(){
		client = webdriverjs.remote({ desiredCapabilities: {browserName: 'chrome'} });
		client.init();
	});
	//user should go to the web page and see they are on the correct page

	it('should have correct title', function(done){
		client
			.url('http://localhost:3000')
			.getTitle(function(err, title){
				expect(err).to.be.null;
				//uses assert in a BDD context
				assert.strictEqual(title, 'npg cc-browser');
			})
			.call(done);
	});

	//user sees a button that says 'Get CC articles'

	it('should have a button labelled "Browse CC articles"', function(done){
		client//getTagName gets the tag name of a dom obj found by the css selector
			.getTagName('button', function(err, button){
				expect(err).to.be.null;
				assert.strictEqual(button, 'button');
			})
			.getText('button', function(err, button){
				expect(err).to.be.null;
				assert.strictEqual(button, 'Start browsing');
			})
			.call(done);
	});

	//on clicking the button they are taken to a new page called 'data' and see a list of articles
	

	it('and the Browse CC articles button should take the user to path /data.', function(done){
		client
			.buttonClick('button', function(err, button){

				expect(err).to.be.null;
				client
					.url('http://localhost:3000/data')
					.getTitle(function(err, title){
						expect(err).to.be.null;
						assert.strictEqual(title, 'open access articles')
					})
					//.call(done);			
				
			})
			.call(done);
	});

	//next test to implement
	//it('should display a list of articles on a new page after the button has been pressed')

	//'tear' down, so to speak
	after(function(done){
		client.end(done);
	});
});