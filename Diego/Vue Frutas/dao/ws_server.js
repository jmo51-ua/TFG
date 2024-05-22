'use strict'

// Librerias
const WebSocketServer = require('websocket').server; // Servidor de WebSockets

const wsSession = require('./ws_session').wsSession;
const Evented = require('./evented').Evented;

/**
 * Configuración para un {@link WSServer}
 * @typedef {Object} WSServer~Config
 * @property {integer} port WS server port
 * @property {string} protocol WS server protocol
 * @property {integer} timeout Tiempo de espera en segundos para que una sesion desconectada sea cerrada
 */

/**
 * Clase que encapsula el servidor de Web Sockets.<br />
 * Por cada conexión se crea una sesión ({@link WSSession}).<br />
 * Si se pierde la conexión y el mismo cliente se conecta (mismo id de sesión) se continúa con la anterior sesión.<br />
 * Mientras no hay conexión los eventos emitidos son almecenados para enviarlos despues.<br />
 * El servidor comienza asignando id's de forma aleatoria.<br />
 * Cuando una sesión lanza un evento, el servidor lanza el mismo evento con el prefijo "session-" y un primer argumento que es la sesión.
 * @extends Evented
 * @example
 * // Crear un servidor de WS
 * var server = new WSServer(cfg, server, auth);
 * // Subscribirse a la creación de sesiones
 * server.on("session-create", (session) => { ... });
 */
class WSServer extends Evented {
	/**
	 * Crea un nuevo servidor de Web Sockets
	 * @param {WSServer~Config} config Configuracion: { port, protocol, timeout }
	 * @param {webserver} server Referencia al servidor web
	 * @param {function} auth Función que autentica el usuario: auth(credentials, (userId) => {});
	 */
	constructor(config, server, auth) {
		super() // herencia de Evented
		this.sessions = {}; // sesiones creadas
		var idConn = Math.round(Math.random() * 100000); // identificador de sesiones. Es aleatorio para evitar conflictos con sesiones abiertas

		// Crea un nuevo servidor HTTP
		//var server = http.createServer().listen(config.port);
		//console.info("WS server listen on port", config.port)

		// Crear un servidor WS
		this.wsServer = new WebSocketServer({
			httpServer: server,
			autoAcceptConnections: false
		});

		this.wsServer.on('request', (request) => { // Solicitud de conexión por parte de un cliente
			console.log("WS request>", "Resource:", request.resource, "Protocols:", request.requestedProtocols, "RA:", request.remoteAddress);
			if (request.resource !== config.url) {
				console.warn("Web Socket path is not correct:", request.resource, config.path);
				request.reject(404, "Incorrect Web Socket path");
				return;
			}
			if (request.requestedProtocols.indexOf(config.protocol) < 0) {
				console.warn("Web Socket protocol not supported:", ...request.requestedProtocols);
				request.reject(404, "Web Socket protocol not supported");
				return;
			}
			var connection = request.accept(config.protocol, request.origin);
			var session = null;

			// Nada mas conectar el cliente envia un objeto con {id, credential}
			// Esto permite loguear la sesión y reconectar a sesiones ya creadas (si id no es null)
			var connect = (message) => {
				connection.off("message", connect); // solo se espera este mensaje

				var data = JSON.parse(message.utf8Data);
				console.log("New connection:", data);

				auth(data.credentials, (userId) => {
					if (!userId) {
						console.warn("Error de autenticación con:", credential);
						connection.close();
						return;
					}

					var id = data.id;
					if (id) {
						if (this.sessions[id]) {
							console.log("Reconecting session", id);
							if (userId !== this.sessions[id].userId) {
								console.warn("Reconection error. User is not the shame", userId, this.session[id].userId);
								id = null;
							} else {
								session = this.sessions[id]; // mantener sesión
							}
						} else {
							console.warn("Session for reconection don't exists", id);
							id = null;
						}
					}
					if (!id) { // sesión nueva, crear
						id = ++idConn;
						console.log("New session", id);
						session = wsSession(this, id, userId);
						this.sessions[id] = session; // almacenar session
					}
					session.setConnection(connection);
					connection.send(JSON.stringify({ id: id, userId: userId }));
					session.on("close", () => {
						console.info("Detectado cierre de sesión", id);
						delete this.sessions[id];
						connection.close();
						session.setConnection(null);
					});
				});
			}
			connection.on('message', connect); // capturar el primer mensaje (con id de sesion y credenciales)
			connection.on("close", () => { // cuando se cierra la sessión eliminamos la session
				if(session == null) return; // Falló en alguna ocasión esporádica, cerrando el backend. [Fran]
				if (!this.sessions[session.id]) return; // sesion cerrada
				console.log("Detectado cierre de conexión. Programar el cierre de la sesion:", config.timeout)
				setTimeout(() => {
					console.log("Pasado el tiempo no se ha reconectado el cliente. Quitar la sesion")
					delete this.sessions[session.id];
				}, config.timeout * 1000);
			});
		});
	}
}

// Exportar
/** Clase {@link WSServer} */
exports.WSServer = WSServer;
/**
 * Factoria para la creación de un {@link WSServer}
 * @param {...*} params Parametros del constructor de {@link WSServer}
 * @returns {WSServer}
 */
exports.wsServer = function (...args) { return new WSServer(...args); }; // factoría