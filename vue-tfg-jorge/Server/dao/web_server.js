"use strict";

/**
 * Módulo para la creación de un servidor web basado en Node Express.<br />
 * Para el servidor web crea una homepage y enlaza un conjunto de sitios estáticos.
 * @module webServer
 */

const express = require("express");
const expressProxy = require('express-http-proxy')
const fs = require("fs");
const Path = require("path");

/**
 * Configuración de un servidor web
 * @typedef {Object} Config
 * @property {string} [hostname] Nombre del servidor web
 * @property {integer} [http] Puerto del servidor HTTP (si no se indica no se inicia el servidor HTTP)
 * @property {integer} [https] Puerto del servidor HTTPS (si no se indica no se inicia el servidor HTTPS)
 * @prop {string} [key] Nombre del archivo con la clave SSL
 * @prop {string} [cert] Nombre del archivo con el certificado SSL
 * @property {string} [title] Título de la homepage. Si no se indica no se crea homepage
 * @property {Object[]} [static] Definición de sitios estáticos
 * @property {string} static.url URL de acceso en la web
 * @property {string} static.path Ruta donde se encuentra el sitio estático
 * @property {Object} [static.options] Opciones para express.static()
 * @property {string} [static.description] Descripción del sitio
 */

/**
 * Crea un servidor web
 * @param {module:webServer~Config} [config] Configuración del servidor web
 * @param {string} base Path base para los directorios
 * @param {function} callback Función callback que se invoca cuando el servidor está en marcha
 * @returns App de express
 */
module.exports.webServer = function (config, base, callback) {
	console.info("Starting web server...");
	if (!config) config = {};

	var webServer = { servers: [] };

	var app = webServer.app = express(); // crear la app de express


	// Debug de cada petición
	/*app.use(function (req, res, next) {
		console.log(req.method, req.url, "QUERY:", req.query, "BODY:", req.body);
		next();
	});*/

	// Web estática. Es un array de objetos con:
	// - url: URL de acceso que se añade a la URL base de http.url
	// - path: Directorio donde se encuentran los archivos
	// - options: opciones para express.static
	// - description: descripción del recurso
	var staticHTMLDescription = "";
	if (config.static && Array.isArray(config.static)) {
		config.static.forEach((stt) => {
			if (stt.path !== null && stt.url !== null) {
				let url = config.url + stt.url;
				let path = Path.resolve(base, stt.path);
				app.use(url, express.static(path, stt.options || {}));
				staticHTMLDescription += "<li>" + stt.description + ": <a href='" + url + "'>" + url + "</a></li>";
				console.info(" - Static web: '" + url + "' from '" + path + "'.");
			}
		});
	}

	// Proxy
	if (config.proxy && Array.isArray(config.proxy)) {
		config.proxy.forEach((proxy) => {
			let url = config.url + proxy.url;
			app.use(url, expressProxy(proxy.server + proxy.path, {
				proxyReqPathResolver: function (req) { return proxy.path + req.url; }
			}));
			console.info(" - Proxy: '" + url + "' to '" + proxy.server + proxy.path + "'.");
		});
	}

	// Home page
	if (config.title) {
		console.info(" - Home page for '" + config.title + "'.");
		app.get("/", function (req, res) {
			res.status(200).send("\
			<!doctype html>\
			<html>\
				<body>\
					<h1>" + config.title + "</h1>\
					<h2>Static resources</h2>\
					<ul>" + staticHTMLDescription + "</ul>\
				</body>\
			</html>\
		");
		});
	}

	// Configuración de CORS para accesos desde fuera del servidor
	app.use(function (req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", req.get('Origin') || "*");
		//res.setHeader("Access-Control-Allow-Credentials", "true");
		res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, DELETE");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-access-token");
		//res.setHeader("Access-Control-Expose-Headers", "x-access-token");
		if (req.method === 'OPTIONS') {
			res.end();
		} else {
			next();
		}
	});

	var pending = 0;
	function end() {
		pending--;
		if (!pending && callback) callback();
	}

	// Servidor HTTP
	if (config.http) {
		// port / hostname
		let httpCnf = [config.http];
		if (config.hostname) httpCnf.push(config.hostname);
		// server
		webServer.servers.push(webServer.httpServer = require("http").createServer(app));
		pending++;
		webServer.httpServer.listen(...httpCnf, () => {
			console.info("HTTP server is running on", ...httpCnf);
			console.log
			end();
		});
	}

	// Servidor HTTPS
	if (config.https) {
		// port / hostname
		let httpsCnf = [config.https];
		if (config.hostname) httpsCnf.push(config.hostname);
		// ssl
		let sslOpt = {};
		// key
		sslOpt.key = fs.readFileSync(Path.resolve(base, config.key));
		if (!sslOpt.key) console.error("Can't read ssl key file '" + config.ssl + "'.");
		// cert
		sslOpt.cert = fs.readFileSync(Path.resolve(base, config.cert));
		if (!sslOpt.cert) console.error("Can't read ssl cert file '" + config.cert + "'.");
		// server
		webServer.servers.push(webServer.httpsServer = require("https").createServer(sslOpt, app));
		pending++;
		webServer.httpsServer.listen(...httpsCnf, () => {
			console.info("HTTPS server is running on", ...httpsCnf);
			end();
		});
	}

	return webServer;
};