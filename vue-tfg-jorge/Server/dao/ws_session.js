"use strict"

const Evented = require("./evented").Evented;

/**
 * Clase que encapsula una sesion Web Socket (conexión de un cliente con el servidor).<br />
 * Es persistente, si se corta la conexión, se reconecta automáticamente.<br />
 * Cuando se crea emite el evento {@link WSSession#create} y cuando se cierra el evento {@link WSSession#close}.<br />
 * La sesion puede perder la conexión ({@link WSSession#disconnect}) y volver a reconectarse ({@link WSSession#connect}).<br />
 * Funciona enviando y recibiendo eventos remotos.</br>
 * Si no hay conexión, los eventos emitidos se almacenan para enviarlos al reconectar.<br />
 * Estos eventos también son emitidos desde el servidor, pero con el prefijo "session-" y un primer argumento que es la sessión.<br />
 * @extends Evented
 * @emits WSSession#create
 * @emits WSSession#close
 * @emits WSSession#connect
 * @emits WSSession#disconnect
 */
class WSSession extends Evented {
	/**
	 * @param {WSServer} wsServer Servidor WS
	 * @param {integer} id Id de la sesión
	 * @param {integer} userId Id de usuario
	 */
	constructor(wsServer, id, userId) {
		super(); // herencia de evented

		this.conn = null; // conexion

		/**
		 * Referencia al servidor de WS
		 * @type {WSServer}
		 */
		this.wsServer = wsServer;

		/**
		 * Id de la sesión
		 * @type {integer}
		 */
		Object.defineProperty(this, "id", { value: id });

		/**
		 * Identificador de usuario
		 * @type {integer}
		 */
		Object.defineProperty(this, "userId", { value: userId });

		// datos internos
		this._eventBuffer = []; // buffer de eventos no enviados

		this.debug("WS Session created");
		this.localEmit("create");
	}

	debug(...args) {
		console.log("[WSS]", "(" + this.id + "/" + this.userId + ")", ...args);
		return this;
	}

	/**
	 * Envía un evento. Si no hay conexión lo almacena hasta que puede ser enviado.<br>
	 * Si se invoca sin argumentos intenta vaciar el buffer.
	 * @param {string} [name] Nombre del evento
	 * @param {...*} [data] Datos del evento
	 * @example
	 * session.emit("myEvent", data); // send a event
	 * session.emit(); // try to flush event buffer
	 */
	emit(name, ...data) {
		if (name) {
			this.debug(name, ">>>", ...data);
			this._eventBuffer.push(name + JSON.stringify(data));
		}
		while (this._eventBuffer.length && this.conn) {
			this.conn.sendUTF(this._eventBuffer.shift());
		}
		return this;
	}

	/**
	 * Cierra la sesión. Al cerrar se cancelan todas las subscripciones a eventos que hubiera.
	 */
	close() {
		this.localEmit("close");
		return this;
	}

	/**
	 * Establece la conexión WS de la sesión. Usado por el servidor para actualizar la conexión en caso de reconexión.
	 * @param {Object} conn Objeto conexión
	 */
	setConnection(conn) {
		var onMessage = (message) => {
			var endOp = message.utf8Data.indexOf("[")
			var name = endOp < 0 ? message.utf8Data : message.utf8Data.substr(0, endOp);
			var data = endOp < 0 ? {} : JSON.parse(message.utf8Data.substring(endOp));
			this.debug(name, "<<<", ...data)
			this.localEmit(name, ...data); // emite el evento
		}

		var onClose = (reasonCode, description) => {
			this.debug("Sesion desconectada");
			this.localEmit("disconnect", reasonCode, description);
		}

		if (this.conn) { // quitar antiguos manejadores
			this.conn.off("message", onMessage);
			this.conn.off("close", onClose);
		}

		this.conn = conn; // anotar nueva conexión
		if (!conn) return this;

		// Vaciar buffer por si hay eventos pendientes
		this.emit();

		// establecer manejadores
		conn.on("message", onMessage);;
		conn.on("close", onClose);

		this.localEmit("connect");

		return this;
	}

	/**
	 * Por cada evento que emite la sesión, el servidor tambien emite el mismo evento con el prefijo "session-" y con un primer argumento que es la sesision
	 * @param {string} name Nombre del evento
	 * @param  {...any} data Datos
	 * @example
	 * // Emite en el objeto session -> "test": 7
	 * // Emite en el objeto servidor -> "session-test": session, 7
	 * session.emit("test", 7);
	 */
	localEmit(name, ...data) {
		super.emit(name, ...data);
		this.wsServer.emit("session-" + name, this, ...data);
	}
}

/**
 * Se lanza cuando se crea una sesión
 * @event WSSession#create
 */

/**
 * Se lanza cuando se conecta una sesión
 * @event WSSession#connect
 */

/**
 * Se lanza cuando se desconencta una sesión
 * @event WSSession#disconnect
 */

/**
 * Se lanza cuando se cierra una sesión
 * @event WSSession#close
 */

exports.WSSession = WSSession; // exportar la clase
exports.wsSession = function (...args) { return new WSSession(...args); }; // exportar una factoria