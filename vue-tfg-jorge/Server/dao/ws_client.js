// Módulo para la comunicación por WebSocket (cliente)
// Es compatible con NodeJS y Browser

(function (isNode) {
	'use strict';

	var WebSocket = isNode ? require('websocket').w3cwebsocket : window.WebSocket; // API para WebSocket
	var Evented = (isNode ? require("./evented") : window).Evented;
	var apply = function () { }; // para compatibilidad con $scope.$apply() de AngularJS

	/**
	 * Clase que encapsula un cliente de Web Socket.<br />
	 * Compatible con NodeJS y Browser.<br />
	 * Si la conexión se pierde (evento disconnect), es capaz de reconectar y restablecer la sesión (evento connect).<br />
	 * El objeto trabaja mediante eventos:
	 * <ul>
	 * <li>emit() envia un evento al servidor.</li>
	 * <li>on() realiza una subscripción a eventos, tanto locales como remotos.</li>
	 * <li>off() elimina una subscripción a evento.</li>
	 * </ul>
	 * <pre>
	 * CLIENT                                       SERVER
	 * wsClient.emit("event1", data) ---------------> wsSession.on("event1", function (data) {...});
	 * wsClient.on("event2", function (data) {}) <--- wsSession.emit("event2", data);
	 * </pre>
	 * @extends Evented
	 * @emits WSClient#connect
	 * @emits WSClient#disconnect
	 * @emits WSClient#close
	 */
	class WSClient extends Evented {
		/**
		 * Crea un nuevo cliente de WS
		 */
		constructor() {
			super(); // herencia de Evented

			// Datos internos
			this._socket = null; // socket de comunicacion
			this._eventBuffer = []; // eventos pendientes de ser enviados (se acumulan mientras no hay conexión)

			/**
			 * Id de sesion (obtenido del servidor)
			 * @type {integer}
			 */
			this.id = null;

			/**
			 * Id de usuario (obtenido del servidor)
			 */
			this.userId = null;
		}

		// Debug con datos de la sesion
		debug(...args) {
			console.log("(" + this.id + "/" + this.userId + ")", ...args);
			return this;
		}

		// Emite un evento de forma local
		localEmit(...args) {
			super.emit(...args);
			//apply();
		}

		/**
		 * Envia un evento por WS<br />
		 * Si no se puede enviar por falta de conexión, lo almacena en un buffer para enviarlo al reconectar.<br />
		 * Si se invoca sin argumentos, intenta enviar los comandos pendientes.
		 * @param {string} [name] Nombre del evento
		 * @param {...*} [data] Datos del evento
		 */
		emit(name, ...data) {
			if (name) {
				this.debug(name, '>>>', ...data);
				var c = name + JSON.stringify(data); // crear evento
				this._eventBuffer.push(c); // almacenar
			}
			// vaciar buffer si hay conexión
			while (this._eventBuffer.length && this._socket && this._socket.readyState === WebSocket.OPEN) {
				this._socket.send(this._eventBuffer.shift());
			}
			return this;
		};

		/**
		 * Conecta el web socket y realiza el login
		 * @param {object} options Opciones de conexión: { base, protocol, reconnect }
		 * @param {object} credentials Credenciales de acceso (email y password)
		 * @returns {Promise} Promesa de finalización del proceso de conexión
		 */
		connect(options, credentials) {
			return new Promise((resolve, reject) => {
				var connect = () => {
					if (!credentials) return;
					this.debug('Conecting...', options);
					this._socket = new WebSocket(options.base, options.protocol);

					// Cuando se inicia la conexión damos de alta los eventos que estaban ya subscritos
					this._socket.addEventListener('open', (event) => {
						this.debug("Conected");
						this._socket.send(JSON.stringify({ id: this.id, credentials })); // enviar id y credenciales
						var link = (msg) => {
							this._socket.removeEventListener("message", link);
							var data = JSON.parse(msg.data);
							this.debug("link:", data);
							if (!data.userId) {
								console.error('Auth incorrect:', credential);
								this.close();
								reject('Auth incorrect');
							}
							this.userId = data.userId;
							this.id = data.id;
							this.debug("Sesion logueada");
							this.emit(); // por si hay eventos pendientes
							resolve();
							this.localEmit("connect")

							// Mensajes (eventos) recibidos por el servidor
							this._socket.addEventListener('message', (msg) => {
								this.debug("message:", msg);
								var x = msg.data.indexOf("[");
								var name = msg.data.substr(0, x);
								var data = JSON.parse(msg.data.substr(x));
								this.debug(name, '<<< ', ...data);
								this.localEmit(name, ...data);
							});
						};
						this._socket.addEventListener("message", link); // primer mensaje de linkado
					});

					// Detectar el cierre
					this._socket.addEventListener('close', (reason) => {
						this._socket = null;
						this.debug("Socket closed. Reason:", reason);
						this.localEmit("disconnect", reason);
						if (options.reconnect && this.id) {
							this.debug("Reconnect in:", options.reconnect)
							setTimeout(function () {
								connect();
							}, options.reconnect * 1000);
						}
					});
				}

				connect(); // conectar por primera vez
			});
		};

		/**
		 * Indica si el socket está conectado
		 */
		connected() {
			return this._socket !== null;
		}

		/**
		 * Cierra la conexión con el servidor.
		 * @emits close
		 */
		close() {
			this.debug("close");
			this.emit("close");
			this.localEmit("close");
			this.id = null;
			this.userId = null;
			if (this._socket.readyState !== WebSocket.CLOSED) this._socket.close();
		}
	}

	if (isNode) { // NodeJS
		exports.WSClient = WSClient;
		exports.wsClient = function (...args) { return new WSClient(...args); }
	} else { // Bowser
		if (typeof angular !== "undefined") { // AngularJS
			angular.module("wsClient", []).factory("wsClient", function ($rootScope) {
				apply = $rootScope.$apply.bind($rootScope);
				return function (...args) { return new WSClient(...args); };
			});
		} else {
			window.wsClient = function (...args) { return new WSClient(...args); };
		}
	}
})(typeof module !== 'undefined' && module.exports);