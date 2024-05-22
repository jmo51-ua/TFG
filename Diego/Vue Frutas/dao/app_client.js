(function (isNode) {
	"use strict";

	var restClient = null;
	var wsClient = null;
	var daoClient = null;

	/**
	 * Aplicación Cliente
	 */
	class AppClient {
		constructor() {
			this.origin = null;
			this.config = null;
			this.rest = restClient();
			this.ws = wsClient();
			this.dao = daoClient(this.rest, this.ws);;
			this.userId = null;
		}

		/**
		 * Obtiene la configuración del cliente
		 * @param {*} origin Dirección del servidor (http://server:port)
		 * @param {*} [url="/config"]  Path para obtener la configuración
		 */
		getConfig(origin, url = "/config") {
			console.log("Get client config from:", origin, url);
			this.rest.urlBase = origin;
			this.rest.resend = 0;
			return this.rest.get(url).then(
				(config) => { // obtener configuración del servidor
					console.log("Client config:", config);
					this.origin = origin;
					this.config = config;
					this.rest.resend = config.rest.resend;
					this.rest.urlBase += this.config.rest.url;
					return config;
				},
				(err) => {
					console.error("Can't obtain client configuration from '" + url + "'");
					return Promise.reject(err);
				}
			);
		}

		/**
		 * Realiza un login, tanto en REST como en WS
		 * @param {Object} credentials Datos para el login
		 */
		login(credentials) {
			console.log("login:", credentials);
			return this.rest.login(this.config.rest.login, credentials).then(
				(userId) => {
					console.log("login: REST login OK:", userId);
					var u = new URL(this.origin);
					var wsURL = (u.protocol === "https:" ? "wss" : "ws") + "://" + u.host + this.config.websocket.url;
					console.log("login: websocket URL:", wsURL);
					return this.ws.connect({ base: wsURL, protocol: this.config.websocket.protocol, reconnect: this.config.websocket.reconnect }, credentials).then(() => {
						return this.rest.get("/").then(
							(schemas) => {
								console.log("login: OK:", userId);
								this.dao.addSchemas(schemas);
								this.userId = userId;
								return userId;
							}, () => {
								console.error("Unable to obtain schemas from server");
								return Promise.reject("Unable to obtain schemas from server");
							}
						);
					});
				}, () => {
					console.warn("login: Bad credentials", credentials);
					return Promise.reject("Bad credentials");
				}
			);
		}

		/**
		 * Registra un usuario. Si todo va bien realiza el login
		 * @param {Object} userData 
		 */
		register(userData) {
			console.log("register:", userData);
			return this.rest.post(this.config.rest.register, userData).then(() => {
				return this.login(userData);
			});
		}

		/**
		 * Realiza un logut, tanto en REST como WS
		 */
		logout() {
			console.log("logout");
			this.userId = null;
			this.ws.close();
			return this.rest.logout();
		}

		/**
		 * Indica si el usuario tiene acceso a una sección
		 * @param {Integer|String} section Sección (nombre o código). Asume que elementType es un staticData
		 * @param {Function} callback Función de finalización: callback({read, write, create, delete, auth})
		 */
		accessSection(section, callback) {
			//if (typeof section === "string") section = this.dao.elementType.staticData("code")[section].id
			this.dao.system.read({ id: 0 }).then((et) => {
				callback(et.auth.lists[section]);
			}, () => {
				callback({ read: false, write: false, create: false, delete: false, auth: false });
			});
		};
	}

	if (isNode) { // NodeJS
		restClient = require("./rest_client").restClient;
		wsClient = require("./ws_client").wsClient;
		daoClient = require("./dao_client").daoClient;

		exports.AppClient = AppClient;
		exports.appClient = function (...args) { return new AppClient(...args); };
	} else { // Browser
		if (typeof angular !== "undefined") { // AngularJS
			angular.module("appClient", ["restClient", "wsClient", "daoClient"]).factory("appClient", ["restClient", "wsClient", "daoClient", function (rest, ws, dao) {
				restClient = rest;
				wsClient = ws;
				daoClient = dao;
				return function () { return new AppClient(); };
			}]);
		} else {
			restClient = window.restClient;
			wsClient = window.wsClient;
			daoClient = window.daoClient;
			window.appClient = function (...args) { return new AppClient(...args); };
		}
	}
})(typeof module !== 'undefined' && module.exports);