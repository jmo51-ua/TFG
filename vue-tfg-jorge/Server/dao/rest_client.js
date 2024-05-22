(function (isNode, Promise) {
	"use strict";

	var httpREST = null; // Función que realiza las peticiones HTTP para REST (depende de la plataforma)

	/**
	 * Cliente REST.<br />
	 * Permite el acceso a servicios REST.<br />
	 * Utiliza el formato de datos JSON.<br />
	 * Compatible con NodeJS y Angular.<br />
	 * Permite, en caso de desconexión temporar, almacenar y reenviar peticiones. Se controla mediante la propiedad [resend]{@link RESTClient#resend}.<br />
	 * En caso de necesiar login previo usar el método [login()]{@link RESTClient#login}.
	 * Métodos básicos (compatibles con callback y Promise):
	 * <ul>
	 * <li>[get()]{@link RESTClient#get}: Realiza una petición GET.</li>
	 * <li>[post()]{@link RESTClient#post}: Realiza una petición POST.</li>
	 * <li>[put()]{@link RESTClient#put}: Realiza una petición PUT.</li>
	 * <li>[delete()]{@link RESTClient#delete}: Realiza una petición DELETE.</li>
	 * </ul>
	 * @example
	 * rest = new RestClient();
	 * rest.login("http://example.com/api", "/login", credentials).then() => { // realiza login
	 *   rest.get("/user").then((user) => { ... }); // obtiene los datos de un usuario
	 * });
	 */
	class RESTClient {
		/**
		 * Crea un nuevo objeto REST
		 */
		constructor() {
			/**
			 * URL base para la peticiónes. Actua como un prefijo a todas las URL de las solicitudes.
			 * @type {string}
			 */
			this.urlBase = "";

			/**
			 * Objeto con los datos de las credenciales usadas en el login
			 * @type {Object}
			 */
			this.credentials = null; // credenciales para autenticación

			/**
			 * Si la autorización es basada en tokens almacena el token obtenido en el login
			 * @type {string}
			 */
			this.token = null; // tocken de autenticación

			/**
			 * Identificador de usuario obtenido en el login
			 * @type {number}
			 */
			this.userId = null; // usuario logueado

			/**
			 * Indica si hay que reenviar una petición si no se contacta con el servidor.<br />
			 * Establece el tiempo a esperar en ms. Si se indica 0 no se reintenta
			 * @type {number}
			 */
			this.resend = 0;

			// Buffer de peticiones no enviadas
			this._requestBuffer = [];
		}

		/**
		 * Indica si el servidor REST está conectado (no hay peticiones pendientes)
		 */
		connected() {
			return this._requestBuffer.length == 0;
		}

		/**
		 * Encapsula una petición REST.<br />
		 * Si la petición no se puede enviar es almacenada en un buffer.<br />
		 * Si se invoca el método request sin argumentos se intenta vaciar el buffer.
		 * @param {string} method Método HTTP
		 * @param {string} url URL relativa a la urlBase establecida
		 * @param {Object} data Datos para algunos métodos (PUT,POST...)
		 * @param {function} [callback] Función de finalización: callback(err, res)
		 * @returns {Promise} Promesa de finalización
		 */
		request(method, url, data, callback) {
			var promise = null;
			if (arguments.length > 0) {
				//if (url.substr(0, 1) !== "/") url = "/" + url;
				url = this.urlBase + url;
				promise = new Promise((resolve, reject) => {
					this._requestBuffer.push({ method, url, data, resolve, reject, callback });
				});
				if (this._requestBuffer.length > 1) return promise; // el buffer tenia datos, ya se vaciará...
			}
			if (!this._requestBuffer.length) return promise; // buffer vacio
			let b = this._requestBuffer[0];
			console.log(b.method, method ? ">>>" : ">R>", b.url, b.data);
			httpREST.call(this, b.method, b.url, b.data).then(
				(response) => { // OK
					console.log(b.method, "<<<", b.url, "->", response.status, response.data);
					this._requestBuffer.shift();
					b.callback && b.callback(null, response.data);
					b.resolve(response.data);
					if (this._requestBuffer.length) { this.request(); }
				}, (response) => { // error
					console.warn(b.method, "<E<", b.url, "->", response.status, response.data);
					if (response.status <= 0 && this.resend) {
						console.log("Reenviar petición en:", this.resend)
						setTimeout(() => { this.request(); }, this.resend); // es un fallo de conexión / timeout. Reintentar
					} else {
						b.callback && b.calblack(response);
						b.reject(response); // es un fallo indicado por el servidor
						this._requestBuffer.shift();
						if (this._requestBuffer.length) this.request();
					}
				}
			);
			return promise;
		}

		/**
		 * Realiza un REST GET
		 * @param {string} url URL de la petición
		 * @param {function} [callback] Función de finalización: callback(err, res)
		 * @return {Promise} Promesa de finalización
		 * @example
		 * rest.get("/user").then(...); // con Promise
		 * rest.get("/user", (err, res) => {...}); // con callback
		 */
		get(url, callback) {
			return this.request("GET", url, "", callback);
		}

		/**
		 * Realiza un REST POST
		 * @param {string} url URL de la petición
		 * @param {Object} data Datos de la petición
		 * @param {function} [callback] Función de finalización: callback(err, res)
		 * @return {Promise} Promesa de finalización
		 * @example
		 * rest.post("/user", { name: "Jonh" }).then(...); // con Promise
		 * rest.post("/user", { name: "Jonh" }, (err, res) => {...}); // con callback
		 */
		post(url, data, callback) {
			return this.request("POST", url, data, callback);
		}

		/**
		 * Realiza un REST PUT
		 * @param {string} url URL de la petición
		 * @param {Object} data Datos de la petición
		 * @param {function} [callback] Función de finalización: callback(err, res)
		 * @return {Promise} Promesa de finalización
		 * @example
		 * rest.put("/user/2", { name: "Jonh" }).then(...); // con Promise
		 * rest.put("/user/2", { name: "Jonh" }, (err, res) => {...}); // con callback
		 */
		put(url, data, callback) {
			return this.request("PUT", url, data, callback);
		};

		/**
		 * Realiza un REST DELETE
		 * @param {string} url URL de la petición
		 * @param {function} [callback] Función de finalización: callback(err, res)
		 * @return {Promise} Promesa de finalización
		 * @example
		 * rest.delete("/user/2").then(...); // con Promise
		 * rest.delete("/user/2", (err, res) => {...}); // con callback
		 */
		delete(url, callback) {
			return this.request("DELETE", url, "", callback);
		}

		/**
		 * Realiza un login para REST
		 * @param {string} url URL relativa para el login
		 * @param {Object} credentials Datos del login
		 * @return {Promise} Promesa de finalización
		 */
		login(url, credentials) {
			console.log("login:", url, credentials);
			return this.post(url, credentials).then(
				(data) => {
					if (!data || !data.userId) {
						console.warn("No login data", data);
						return Promise.reject("No login data");
					}
					this.credentials = credentials;
					this.token = data.token || null;
					this.userId = data.userId;
					console.log("Login correcto:", data);
					return data.userId;
				},
				(response) => {
					console.warn("Login incorrecto");
					return Promise.reject(response);
				}
			);
		}

		/**
		 * Realiza un logout
		 */
		logout() {
			this.token = null;
			this.userId = null;
			this.credentials = null;
			console.log("Logout realizado");
		}
	}

	// Exportar el API según la plataforma
	if (isNode) { // versión NodeJS
		const http = require('http');
		const urlParser = require('url');
		httpREST = function (method, url, data) {
			if (typeof data != "string") data = JSON.stringify(data);

			return new Promise((resolve, reject) => {
				var dataHost = urlParser.parse(url, true); // analizar el path
				var options = { // Opciones HTTP
					method,
					hostname: dataHost.hostname,
					port: dataHost.port,
					path: dataHost.path,
					cache: false,
					headers: {
						'x-access-token': this.token || "",
						'Content-Type': "application/json; charset=utf-8"
					}
				};

				// Tamaño de los datos
				if (data) options.headers['Content-Length'] = data.length;

				// Peticion HTTP
				const req = http.request(options, (res) => {
					res.data = ''; // datos de la respuesta que se irán acumulando
					res.setEncoding('utf8');

					// Recepción de datoas
					res.on('data', (chunk) => { // acumular un trozo mas
						res.data += chunk;
					});
					res.on('end', () => { // fin de los datos
						// Compatibilidad con $http
						res.status = res.statusCode;

						// Content-Type
						var ct = res.headers["Content-Type"] || res.headers["content-type"] || res.headers["Content-type"];
						if (ct.substr(0, 16) != "application/json") {
							console.warn("Bad response content type", ct);
							return reject(res);
						}

						// Data -> JSON
						try {
							res.data = JSON.parse(res.data);
						} catch (err) {
							console.warn("Error parseando JSON", res.data)
						}

						// Status Code
						if (res.status < 200 || res.status >= 300) { // recibido codigo de error
							console.warn("Bad HTTP response status code", res.status);
							return reject(res);
						}

						// Todo OK
						resolve(res);
					});
				});

				req.on('error', (err) => { // detección de errores
					console.warn("HTTP response error", err);
					reject({ code: -1, data: err });
				});

				if (data) req.write(data); // si hay datos (POST/PUT) mandarlos
				req.end(); // terminar la solicitud
			});
		};

		exports.RESTClient = RESTClient;
		exports.restClient = function () { return new RESTClient(); };
	} else { // Browser
		if (typeof angular !== "undefined") { // Versión AngularJS
			angular.module("restClient", []).factory("restClient", function ($http, $q) {
				Promise = $q;
				httpREST = function (method, url, data) {
					var opt = {
						method: method,
						url: url,
						cache: false,
						headers: {
							'x-access-token': this.token || ""
						}
					};
					if (data) opt.data = data; // data (POST / PUT)
					return $http(opt);
				};
				return function () { return new RESTClient(); };
			});
		} else {
			window.restClient = function () { return new RESTClient(); };
			httpREST = function (method, url, data) {
				method = method.toUpperCase(); // método en mayúsculas
				if (data && typeof data !== "string") data = JSON.stringify(data); // datos en texto formato JSON
				var xhr = new XMLHttpRequest();
				xhr.open(method, url, true);
				xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8"); // el tipo de la petición es JSON
				//if (token) xhr.setRequestHeader("Authorization", "Bearer " + token);
				//console.log(">>>", method, url, data);
				return new Promise(function (resolve, reject) {
					xhr.onload = xhr.onerror = () => {
						var responseType = xhr.getResponseHeader("Content-type");
						if (responseType) responseType = responseType.split(";")[0];
						//console.log("<<<", xhr.status, responseType, xhr.response);

						var { response, status } = xhr;
						if (response && responseType.substr(0, 16) === "application/json") response = JSON.parse(response);
						if (status >= 200 && status < 300) {
							resolve({ data: response, status });
						} else {
							reject({ data: response, status });
						}
					};
					xhr.send(data); // Enviar datos
				});
			}
		}
	}
})(typeof module !== 'undefined' && module.exports, Promise);