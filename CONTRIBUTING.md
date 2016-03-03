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
 
Here are the instructions for getting the code and getting the application working on your machine (coming soon).


####Set up####

pmc-ref requires [Node.js](https://nodejs.org/download/) and [MongoDB](http://www.mongodb.org/downloads). Latest versions of both are being used (they are Node X and Mongo 3.2)


####Loading test data into MongoDB####

Once Node and MongoDB are installed download and unzip data from [here](https://drive.google.com/file/d/0B3AgUDfIExOnNExTdmtjdjgxNk0/view).

In a terminal start mongod running with `mongod` and in a new terminal navigate to the unzipped files.

From there run the command 

`mongorestore --collection articlemodels --db pmcref articlemodels.bson`

followed by

`mongorestore --collection journalmodels --db pmcref journalmodels.bson`

Start an instance of mongo with the `mongo` command and check there is some data!

`db.articlemodels.find({"doi":"10.1038/nature10158"})`

`db.journalmodels.find({"title":"Nature"})`

####Create indexes####
A few indexes are needed. (Are they?)

I've found adding indexes to pmid, references and is_ref_of fields help.

To add an index to a field use the command `db.articlemodels.createIndex({pmid: 1})

Adding multikey indexes to the references and is_ref_of field does mean the size of the indexes gets quite large.

[Read more about the data on the wiki](https://github.com/RobSullivan/pmc-ref/wiki/Schemas)

####Up and running####

Once the test data has been loaded, clone this repo locally and run `npm install` to install the dependencies found in package.json.

If installing on Windows these instructions might be useful for deciphering install errors https://github.com/TooTallNate/node-gyp#installation

For Windows users:

- Start the mongod server: `mongod`

- In a new terminal cd to the project directory which will contain main.js and set the following:

`set MONGOOSE_HOST=mongodb://localhost/`,
`set MONGOOSE_DB=pmcref`,
`set SERVER_PORT=1337`,

- run the command

`node main.js %MONGOOSE_HOST% %MONGOOSE_DB% %SERVER_PORT%`

- open browser at [http://localhost:1337/](http://localhost:1337/)

For Mac:

`MONGOOSE_HOST=mongodb://localhost/pmcref SERVER_PORT=1337 node main.js`



#### Some known install issues ####

 - Used homebrew install mongodb and then https://gist.github.com/adamgibbons/cc7b263ab3d52924d83b to get mongod process
 - kerberos and node-gyp errors (oh boy)

### Tests

Here's where you can find out more information on running and writing tests (coming soon).

Mocha...api endpoint tests...unit tests

Tests can be run using the command:

`npm test`

### Issues and bugs

 There are lots of issues and bugs! Have a look, raise or report here https://github.com/RobSullivan/pmc-ref/issues

### Pull requests
 
 
### The wiki
 
Read more about how things work over on the [wiki](https://github.com/RobSullivan/pmc-ref/wiki)

 
### Other resources


