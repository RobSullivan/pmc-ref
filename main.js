var app = require("./app"),
	env = process.env;

var server = app({
	mongoose: {
		host: env.MONGOOSE_HOST,
		port: env.MONGOOSE_PORT,
		db: env.MONGOOSE_DB
	}
})

server.listen(env.SERVER_PORT)// env.SERVER_PORT for local foreman start