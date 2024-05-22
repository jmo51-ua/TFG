"use strict";

/**
 * Módulo para la creación de un servidor.<br />
 * Permite la configuración del servidor mediante el método [config()]{@link appServer#config}.</br>
 * @module appServer
 */
var appServer = exports;
const configProfile = require("./config");

const path = require("path"); // gestión de paths en archivos
const fs = require("fs"); // gestión de archivos
const debug = require("./debug");
exports.debug = debug;

var basePath = "";

/**
 * Establece una ruta base de aplicación para todas las rutas establecidas en la configuración
 * @param {string} path Nueva ruta base
 * @example
 * appServer.basePath(__dirname); // establece la ruta base con el directorio del módulo
 */
exports.basePath = function (path) {
	basePath = path;
}

/**
 * Muestra informacion sobre el servidor
 * @param {Object} info Configuración de la información a mostrar
 * @param {string} [info.color="white"] Color de referencia para la información (banner y fondos)
 * @param {string} [info.banner] Nombre del archivo que contiene el banner a mostrar
 * @param {string} [info.title] Título de la aplicación
 * @param {string} [info.foot] Texto adicional de la aplicación (copyright...)
 * @param {boolean} system Indica si se muestra información de sistema
 */
exports.info = function (info, system) {
	if (info) {
		// Banner
		let color = info.color || "white";
		let width = 50;
		if (info.banner) {
			let banner = fs.readFileSync(path.resolve(basePath, info.banner)) + "";
			if (banner) {
				debug.out();
				debug.out(info.color || "white", banner);
				debug.out();
				width = Math.max.apply(null, banner.split("\n").map((x) => x.length));
			}
		}
		if (info.title) debug.out("black/" + color + "/center/" + width, info.title);
		if (info.foot) debug.out("black/" + color + "/center/" + width, info.foot);
		debug.out();
	}

	// Mostrar datos de sistema
	if (system) {
		debug.out("white/red/right/21", "System ");
		debug.out("red/right/20", "Time", "white", ": " + (new Date()).toLocaleString());
		debug.out("red/right/20", "Architecture", "white", ": " + process.arch);
		debug.out("red/right/20", "Node.js version", "white", ": " + process.version);
		debug.out("red/right/20", "Working directory", "white", ": " + process.cwd());
		debug.out("red/right/20", "Base path", "white", ": " + basePath);
		debug.out("red/right/20", "PID", "white", ": " + process.pid);
		debug.out();
	}
};

/**
 * Muestra una ayuda sobre el uso del servidor
 */
exports.help = function () {
	console.info("Use: node " + process.argv[1] + " [options]");
	console.info("Options:");
	console.info("  -h: Show this help.");
	console.info("  -p <name>: Apply a config profile (profiles are in 'profiles' folder).");
	console.info("  -v: Show all messages.");
	console.info("  -d: Show all messages with debug information.");
	console.info("  -s: Silent mode (only warnigns and errors).");
};

/**
 * Obtiene la conifguración por defecto (perfil 'default')
 */
exports.defaultConfig = function (profilePath) {
	return configProfile.readConfigFile(path.resolve(basePath, profilePath, "default.json"));
}

/**
 * Establece la configuración del servidor a partir de un conjunto de archivos de configuración (profiles).<br />
 * Utiliza la linea de comandos para establecer la configuración.
 * @param {string} profilePath Ruta del directorio donde están los perfiles
 */
exports.config = function (profilePath) {
	// Muestra ayuda sobre la aplicación y termina la ejecución
	function err(err) {
		if (err) console.error(err);
		appServer.help();
		process.exit(0)
	}

	debug.level("INFO", false); // por defecto nivel INFO y sin depuración
	// Obtener la configuración para ese perfil
	var config = appServer.defaultConfig(profilePath); // iniciar configuración con el perfil "default"

	// Perfil de configuración de la variable de entorno CRONOS_PROFILE. También se puede establecer con una opcion
	if (process.env.CRONOS_PROFILE) configProfile(config, profileDir + process.env.CRONOS_PROFILE + ".json");

	// Analizar la línea de comandos
	for (let i = 2; i < process.argv.length;) {
		let opt = process.argv[i++]; // opción
		let val = null; // valor (opcional)
		if (i < process.argv.length && process.argv[i].substr(0, 1) !== "-") val = process.argv[i++];
		switch (opt) {
			case "-h":
				err();
				break;

			case "-p":
				if (!val)
					err("Missing profile name");
				else
					configProfile.extends(config, path.resolve(basePath, profilePath, val + ".json"));
				break;

			case "-v":
				debug.level("LOG", false);
				break;

			case "-d":
			case "--debg":
				debug.level("LOG", 10, 3, 15);
				break;

			case "-s":
				debug.level("WARN", false);
				break;

			default:
				err("Option error: " + opt);
				break;
		}
	}

	// Logs to file
	debug.logFile(config.logs.level, path.resolve(basePath, config.logs.filename));

	return config;
};

/**
 * Crea un DAO de acceso a datos. Para ello carga los schemas y se conecta con la base de datos
 * @param {Object} config Configuración del DAO
 * @param {Object} config.schemas Configuración de los esquemas
 * @param {Object} config.database Configuración de la base de datos
 * @param {function} callback Función callback: callback(error, dao, database, schemas)
 */
exports.dao = function (config, callback) {
	// Error en el proceso de creación del DAO
	function error(msg) {
		console.error("Error creating DAO: " + msg + ".");
		callback(msg, null)
	}

	// Validación de la configuración
	if (!config.schemas) return error("Missing schemas configuration");
	if (!config.database) return error("Missing database configuration");

	// Obtener los esquemas de las entidades
	var schemas = require("./entity_schema").loadDirectory(path.resolve(basePath, config.schemas));
	if (!schemas) return error("Can't read schemas");

	// Crear la BD
	var database = require("./database").database(config.database, (err) => {
		if (err) return error("Error connecting database");

		// Crear el DAO
		var dao = require("./dao_server").daoServer(schemas, database, { blobs: path.resolve(basePath, config.blobs) });

		// Establecer comportamientos para las entidades
		if (config.dao_scripts) {
			console.info()
			fs.readdirSync(path.resolve(basePath, config.dao_scripts)).forEach((file) => {
				if (path.extname(file) != ".js") return;
				var entity = path.basename(file, ".js");
				Object.assign(dao[entity], require(path.resolve(basePath, config.dao_scripts, file)));
			});
		}

		callback && callback(null, dao, database, schemas);
	});
};

/**
 * Crea y lanza una aplicación servidor en base a una configuración y un dao
 * @param {Object} config Configuración del servidor
 * @param {Object} dao
 * @param {Object} auth API de auth
 * @param {function} resgister Función de registro de usuario: register(err, userId)
 * @param {function} callback Se ejecuta cuando el servidor está en marcha o tiene error: callback(err, server)
 */
exports.server = function (config, dao, auth, callback) {
	var server = {
		dao: dao,
		webServer: null,
		webSocket: null,
		api: null,
	};

	// Error en el proceso de creación del server
	function error(msg) {
		console.error("Error creating server: " + msg + ".");
		callback(msg, null)
	}

	// Servidor web
	server.webServer = require("./web_server").webServer(config.web.server, basePath, (err) => {
		if (err) return error("Error creating web server");

		// WebSockets
		if (config.web.socket) {
			// Crear WS
			server.webSocket = require("./ws_server").wsServer(config.web.socket, server.webServer.servers, auth.authentication);

			// Establecer mediante WS subscripciones remotas a eventos del dao. Esto permite que un evento de DAO en el servidor se transporte a los clientes de DAO que realicen un 'on'
			// Eventos remotos
			var remoteListeners = {}; // relaciona los id de listeners remotos con los locales: remoteListeners[entity][remoteId] = localId
			for (let entity in dao) remoteListeners[entity] = {};
	
			// Eventos remotos a la entidad
			server.webSocket.on("session-dao-entity-on", (session, entity, remoteId, name, filter) => {
				console.log("remote on", entity, remoteId, name, filter);
				var localId = dao[entity].on(name, filter, (...data) => {
					// Le mandamos el id del listener que tiene que ejecutar, los datos del evento lanzado por el dao y los parametros que han hecho que salten ese evento.
					console.log("remote emit:", entity, remoteId, ...data)
					session.emit("dao-entity-emit", entity, remoteId, data);
				});
				remoteListeners[entity][remoteId] = localId;
			});
	
			server.webSocket.on("session-dao-entity-off", (session, entity, remoteId) => {
				console.log("remote off", entity, remoteId);
				dao[entity].off(remoteListeners[entity][remoteId]); // eliminar la subscripcion local
				if (remoteListeners[entity][remoteId] === undefined) {
					//throw new Error("Hubo un error en el off, no está definido el id " + remoteId);
					console.warn("Hubo un error en el off, no está definido el id " + remoteId);
				} else {
					delete remoteListeners[entity][remoteId];
				}
			});
		}


		// Configuración para los clientes
		server.webServer.app.get("/config", (req, res) => {
			res.json({
				rest: {
					url: config.web.rest.url,
					login: config.web.rest.login,
					register: config.web.rest.register,
					resend: config.web.rest.resend,
					authorization: config.web.rest.authorization
				},
				websocket: {
					url: config.web.socket.url,
					protocol: config.web.socket.protocol,
					reconnect: config.web.socket.reconnect
				}
			});
		});

		// Servicios REST
		server.api = require("./rest_server").restServer(config.web.rest, server.dao, auth);
		server.webServer.app.use(config.web.rest.url, server.api);
		console.info("REST API on '" + config.web.rest.url + "'.");
		
		// Documentación de REST
		server.apiDoc = require("./rest_doc").restDoc(config.web.rest, server.dao);
		server.webServer.app.use(config.web.rest.url + "/doc/", server.apiDoc);
		console.info("REST API documentation on '" + config.web.rest.url + "/doc/" + "'.");

		// RAML
		server.raml = require("./rest_doc").raml(config.web.rest, server.dao);
		server.webServer.app.use(config.web.rest.url + "/raml", server.raml);
		console.info("RAML on '" + config.web.rest.url + "/raml" + "'.");

		callback && callback(null, server);
	});

	return server;
};