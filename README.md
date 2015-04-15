# PMC reference checker #
##https://pmc-ref.herokuapp.com/##
###A prototype###

This is the implementation deployed to Heroku. The original code is here https://bitbucket.org/rsullivan/cc-browser.

Given a digital object identifier (doi) PMC reference checker will return the percentage of an article's references that are free to access in [PubMed Central](http://www.ncbi.nlm.nih.gov/pmc/). It can also return the details of the references that are free to acess. An API is also available at https://pmc-ref.herokuapp.com/api. PMCrc is still very much in alpha.

### Who is this for? ###

* For researchers who would like freely accessible research.


###Set up###

pmc-ref requires [Node.js](https://nodejs.org/download/) 0.10+ and  [MongoDB](http://www.mongodb.org/downloads) 2.4.9 or above.



##Loading test data into MongoDB##

Once Node and MongoDB are installed download and unzip data from [here](https://drive.google.com/file/d/0B3AgUDfIExOnNExTdmtjdjgxNk0/view).

In a terminal start mongod running with `mongod` and in a new terminal navigate to the unzipped files.

From there run the command 

`mongorestore --collection articlemodels --db pmcref articlemodels.bson`

followed by

`mongorestore --collection journalmodels --db pmcref journalmodels.bson`

Start an instance of mongo with the `mongo` command and check there is some data!

`db.articlemodels.find({"doi":"10.1038/nature10158"})`

`db.journalmodels.find({"title":"Nature"})`



###Getting started###

Once the test data has been loaded, clone this repo locally and run `npm install` to install the dependencies found in package.json.

If installing on Windows these instructions might be useful for deciphering install errors https://github.com/TooTallNate/node-gyp#installation


##Up and running##

For Windows users:

- Start the mongod server: `mongod`

- In a new terminal cd to the project directory which will contain main.js and set the following:

`set MONGOOSE_HOST=mongodb://localhost/`,
`set MONGOOSE_DB=pmcref`,
`set SERVER_PORT=1337`,

- run the command

`node main.js %MONGOOSE_HOST% %MONGOOSE_DB% %SERVER_PORT%`

- open browser at [http://localhost:1337/](http://localhost:1337/)



###Running tests###

Some attempt at TDD was made with this project and it was very much a learn-as-you-go approach.

Subsequently there is no way to run all the tests with a single command.

Some tests are being skipped and some are failing, possibly due to defunct methods.

Run tests with caution and consideration...I've opened an [issue](https://github.com/RobSullivan/pmc-ref/issues/7).

If you would like to see what happens though a good place to start is 

tests\pipeline\tests with the command 

`mocha --ui tdd -R list document.controller.unit.tests.js`

###Using the pipeline to collect more data###

To update

###Deploying to Heroku###

require("newrelic"); has been removed from line 1 of app.js to avoid having to install Heroku and use foreman to run the app locally.




