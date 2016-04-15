# How to contribute

Hello and thank you for taking the time to be here. I'm very happy that you'd like to contribute, I could do with some help!

Here are a set of guidelines that outline how you can contribute.

This project has a code of conduct which can be read at https://github.com/RobSullivan/pmc-ref/CODE_OF_CONDUCT.md.

Issues can be reported to me at robertjsullivan.esq@gmail.com.


### Table of contents

- [How you can help](#how-you-can-help)
- [Getting started](#getting-started) 
- [Tests](#tests)
- [Issues and bugs](#issues-and-bugs)
- [Pull requests](#pull-requests)
- [The wiki](#the-wiki) (bits and pieces of how the code works)
- [Other resources](#other-resources)

### How you can help
 
There's a lot I need help with, not just coding. So if you have enthusiasm, experience or aspirations for any of the following, please jump in:

 -  User Experience (user interface and user design)
 -  Accessibility (see https://pages.18f.gov/accessibility/)
 -  Suggesting features
 -  Advocacy (if you just think this is just the absolute best thing ever made, tell ur friends!)
 -  Improve knowledge base (documentation)
 -  Make suggestions to improve code (code review)
 -  Or even go ahead and refactor the code!
 -  Improve test coverage
 -  Code review - tell me where I can improve!


### Getting Started
 
Here are the instructions for getting the code and getting the application working on your machine.


#### Set up

pmc-ref uses [Node.js](https://nodejs.org/download/), [MongoDB](http://www.mongodb.org/downloads) and [Heroku Toolbelt](https://toolbelt.heroku.com/). Heroku isn't necessary to get this up and running locally. Versions used are Node 4.2.6 and Mongo 3.2. 


#### Loading test data into MongoDB

With Node, MongoDB and Heroku installed download and unzip the current data set data from [here](https://drive.google.com/file/d/0B3AgUDfIExOnY1h6aUlRZkk4UTg/view) (64MB).

In a terminal start mongod running with `mongod` and in a new terminal navigate to the unzipped files.

From there run the command 

`mongorestore -d [desired name of database] path/to/unzipped/data/`

Start an instance of mongo with the `mongo` command and check there is some data.

`db.articlemodels.find({"doi":"10.1038/nature10158"})`

`db.journalmodels.find({"title":"Nature"})`

Log an issue if you need help.

#### Up and running

Once the test data has been loaded, clone or fork this repo and run `npm install` from the root. There are some known issues with node-gyp and Kerberos which are related to Mongo and/or Mongoose but it  "should" be ok.

If installing on Windows these instructions might be useful for deciphering install errors https://github.com/TooTallNate/node-gyp#installation too.

Check the mongod process is still running.

###### With Heroku
Create a .env file in the root of the project and add a couple of lines like this
`MONGOOSE_HOST=mongodb://localhost/pmcref`
`SERVER_PORT=5000`

Then either use `heroku local` or `heroku local web -f Procfile.test`

###### Without Heroku

`MONGOOSE_HOST=mongodb://localhost/pmcref SERVER_PORT=5000 node main.js`


Open the browser at localhost:5000.



On Windows:

- Start the mongod server: `mongod`

- In a new terminal cd to the project directory which will contain main.js and set the following:

`set MONGOOSE_HOST=mongodb://localhost/`,
`set MONGOOSE_DB=pmcref`,
`set SERVER_PORT=5000`,

- run the command

`node main.js %MONGOOSE_HOST% %MONGOOSE_DB% %SERVER_PORT%`

- open browser at [http://localhost:5000/](http://localhost:5000/)


### Tests

Here's where you can find out more information on running and writing tests.

pmc-ref using the [Mocha](https://mochajs.org/) and a bit of [Chai](http://chaijs.com/) to write and run tests. 

Tests can be run using the command:

`npm test`

### Issues and bugs

 There are lots of issues and bugs! Have a look, raise or report here https://github.com/RobSullivan/pmc-ref/issues

### Pull requests
 
 
### The wiki
 
Read more about how things work over on the [wiki](https://github.com/RobSullivan/pmc-ref/wiki)

 
### Other resources

JavaScript Testing Recipes https://jstesting.jcoglan.com/

