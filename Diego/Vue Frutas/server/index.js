"use strict"

const app = require("../dao/app_server");

app.basePath(__dirname);

const info = {
	color: "cyan",
	banner: "./banner.txt",
	title: "Playas server 1.0",
	foot: "(c) 2020"
};

app.info(info, true);
var config = app.config("./profiles");

app.dao(config, (err, dao) => {
	if (err) return;

	//var auth = require("./auth").create(config, dao);
	var auth = {
		authentication: function (credentials, callback) { callback(1); }, // siempre retorno que el usuario es el 1
	}

	app.server(config, dao, auth, function (err, server) {
		if (err) return;
		console.info("Server started!");
	});
});