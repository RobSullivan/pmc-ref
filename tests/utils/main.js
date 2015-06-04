var app = require("../../app"),
	env = process.env;

var server = app({
	mongoose: {
		host: 'mongodb://localhost/',
		port: 1337,
		db: 'test'
	}
})

server.listen(env.SERVER_PORT)