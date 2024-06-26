// -----------------------------------
// Services - API REST
// -----------------------------------
// Creación y puesta en marcha del API
// -----------------------------------

"use strict";

const express = require('express');
const jwt = require('jwt-simple');
const bodyParser = require("body-parser");

/** 
 * Módulo para la creacion de servidores REST
 * @module restServer
 */

/**
 * Confiuración del servidor REST
 * @typedef {Object} Config
 * @property {string} [login] URL para realizar login
 * @property {string} [register] URL para realizar el registro
 * @property {Object} [json] Configuración JSON para <code>express.json()</code>
 * @property {module:restServer.authorization} authorization Tipo de authorización
 * @property {Object} [jwt] Configuración de JSON Web Token (cuando <code>authoritation === "jwt"</code>)
 * @property {string} jwt.secretKey: Clave de cifrado
 * @property {string} jwt.algorithm: Algoritmo de cifrado
 * @property {number} jwt.expire Tiempo de expiración del token (en horas)
 */

/**
 * Tipos  de autorización
 * @readonly
 * @enum {string}
 */
exports.authorization = {
	/** Sin autorización, acceso libre al API */
	none: "none",
	/** Acceso mediante JSON Web Token (JWT) */
	jwt: "jwt",
}

/**
 * Crea un servidor REST (basado en express) a partir de un DAO.<br />
 * Por cada entidad del DAO crea:
 * <ul>
 * <li><code>GET urlList</code>: Lista elementos de la entidad</li>
 * <li><code>GET urlItem</code>: Obtiene un elemento de la entidad</li>
 * <li><code>SET urlItem</code>: Modifica un elemento de la entidad</li>
 * <li><code>POST ulrList</code>: Crea un nuevo elemento de la entidad</li>
 * <li><code>DELETE urlItem</code>: Elimina un elemento de la entidad</li>
 * </ul>
 * @param {module:restServer~Config} config Configuración del servidor REST
 * @param {DAOServer} dao Referencia al DAO
 * @param {function} [auth] Función de autorización: <code>auth(credentials, (userId) => {...})</code>
 * @param {Object} auth.credentials Credenciales para la autenticación
 * @param {Object} auth.userId Id de usuario o <code>null</code> si ha fallado la autenticación
 * @returns Router de express con los metodos de acceso al API REST
 * @example
 * var apiExpressRoute = require("./rest_server").restServer(config, dao, auth, register);
 */
exports.restServer = function (config, dao, auth, register, ) {
	// Base del API (ruta de acceso al API)
	var base = express.Router();

	// Cuerpo en JSON
	base.use(express.json(config.json));

	// Cuerpo en binario
	base.use(bodyParser.raw({ type: "image/*", limit: "512MB" }));

	// Debug de cada petición
	/*base.use(function (req, res, next) {
		console.log(req.method, req.url, "QUERY:", req.query, "BODY:", req.body);
		next();
	});*/

	// Registro
	if (register && config.register) {
		base.post(config.register, function (req, res) {
			register(req.body, (err, data) => {
				if (err) return res.status(401).json({ code: "BADREGISTER", text: "Register error" }); // Error en el registro de usuario
				return res.status(200).json(data);
			});
		});
	}

	// Login al sistema
	if (auth.authentication && config.login) {
		// datos: { email, password }
		base.post(config.login, function (req, res) {
			console.log("Petición de login:", req.body.email, req.body.password);

			auth.authentication(req.body, (userId) => {
				if (!userId) {
					console.warn("Bad authentication:", req.body);
					return res.status(401).json({ code: "BADAUTH", text: "Bad authentication" }); // Usuario no encontrado
				}

				console.log('Successfull login. User:', userId);

				var result = {
					code: "SUCCESSFULLLOGIN",
					text: "Successfull login",
					userId: userId,
				};

				switch (config.authorization) {
					case "jwt":
						var payload = { // payload del token
							iss: userId, // usuario
							exp: Math.round(new Date().getTime() / 1000 + config.jwt.expire * 60 * 60) // Fecha de expiración del token en seg
						};

						// Codificar token
						var token = jwt.encode(payload, config.jwt.secretKey, config.jwt.algorithm);

						// Indicar el token
						res.setHeader('x-access-token', token);
						result.token = token;
						break;
				}
				return res.status(200).send(result); // ok, dar información sobre el login
			});
		});
	}

	// Parte privada de la app. A partir de ahora se requiere token para seguir...
	console.info("REST Server: Authorization:", config.authorization);
	switch (config.authorization) {
		case "jwt":
			base.use(function (req, res, next) { // Comprobar que hay token y que es correcto
				var token = req.headers['x-access-token']; // token en una cabecera?
				if (!token) token = req.query.token; // token como query?
				if (!token) return res.status(401).send('Missing token'); // No hay token

				// Descodificamos el token para que nos devuelva el usuario y la fecha de expiración
				//console.log("--Token:", token, typeof token);
				var payload = jwt.decode(token, config.jwt.secretKey, config.jwt.algorithm);
				if (!payload || !payload.iss || !payload.exp) {
					console.error("Token error");
					return res.status(401).json({ code: "TOKENERROR", text: "Token error" });
				}
				// Comprobamos la fecha de expiración
				if (new Date().getTime() / 1000 > new Date(payload.exp)) {
					console.error("Expired token");
					return res.status(401).json({ code: "EXPIREDTOKEN", text: "Expired token" });
				}

				// Añadimos el usuario a req para acceder posteriormente.
				req.user = payload.iss;
				next(); // todo ok, continuar
			});
			break;
		default:
			console.warn("REST Server: Authorization is NO active.");
			break;
	}

	// Obtiene una descripción de las entidades para las aplicaciones
	base.get("/", function (req, res) {
		var s = {};
		for (let e in dao) {
			s[e] = {};
			for (let x in dao[e].schema) {
				if (x === "table") continue;
				if (x === "properties") {
					s[e][x] = {};
					for (let p in dao[e].schema[x]) {
						s[e][x][p] = {};
						for (let y in dao[e].schema[x][p]) {
							if (y === "table") continue;
							if (y === "field") continue;
							if (y === "fullField") continue;
							if (y === "link") continue;
							s[e][x][p][y] = dao[e].schema[x][p][y];
						}
					}
					continue;
				}
				s[e][x] = dao[e].schema[x];
			}
		}
		res.json(s);
	});

	// Analiza los parámetros y transforma los numéricos a entero
	function parseParams(params) {
		for (let p in params) {
			if (/\d+/.test(params[p])) params[p] = parseInt(params[p]);
		}
		return params;
	};

	// Obtiene un código de status a partir de un error
	function status(err) {
		var status = 200;
		if (err) {
			switch (err.code) {
				case "ERR_NOTFOUND": status = 404; break;
				default: status = 400;
			}
		}
		return status;
	}

	// Procesa las opciones de la query
	function query2options(query) {
		var options = {};
		if (query.fields) options.fields = query.fields.split(",");
		if (query.order) options.order = query.order.split(",");
		//if (query.filter) console.log("-----------", query.filter, "{" + query.filter.replace(/(\w+)\:/g, (a, b) => '"' + b + '":') + "}");
		if (query.filter) options.filter = JSON.parse("{" + query.filter.replace(/([A-Za-z_]+)\:/g, (a, b) => '"' + b + '":') + "}");
		if (query.lang) options.lang = query.lang;
		return options;
	}

	var authDef = { read: true, write: true, create: true, delete: true, auth: true };

	// Comprueba si tiene autorización para realizar una acción. Si no retorna un error
	function authorize(schema, user, params, access, allow, deny) {
		if (!user) return allow(authDef);
		auth.authorization(user, schema, params, (auth) => {
			if (!auth[access]) {
				if (typeof deny == "function") {
					deny(auth);
				} else {
					deny.status(403).json("Not allowed for " + access);
				}
			} else {
				allow(auth);
			}
		});
	}

	function authorizeReadItem(schema, user, item, allow, deny) {
		authorize(schema, user, item, "read", (auth) => {
			item.auth = auth;
			var lists = Object.keys(schema.lists);
			function process() {
				if (!lists.length) return allow();
				var list = lists.shift();
				if (item[list]) {
					authorizeReadList(dao[schema.lists[list].type].schema, user, item[list], (l) => {
						item[list] = l;
						process();
					});
				} else {
					process();
				}
			}
			process();
		}, deny);
	}

	function authorizeReadList(schema, user, list, callback) {
		var res = [];
		function process() {
			if (!list.length) return callback(res);
			setTimeout(() => {
				var item = list.shift();
				authorizeReadItem(schema, user, item, () => {
					res.push(item);
					process();
				}, process);
			}, 0);
		}
		process();
	};

	// Crear el API con las entidades de los esquemas
	for (let name in dao) {
		//console.log("*", name)
		let schema = dao[name].schema;

		// GET List
		if (schema.urlList) {
			base.get(schema.urlList, (req, res) => {
				var params = parseParams(req.params);
				dao[name].read(params, query2options(req.query), (err, list) => {
					console.info("GET:", req.url, "=>", err ? "ERR" : list);
					if (err) {
						res.status(status(err)).json(err);
						return;
					}
					authorizeReadList(schema, req.user, list, (list) => {
						res.json(list);
					});
				});
			});
		}


		// GET Item
		if (schema.urlItem) {
			base.get(schema.urlItem, (req, res) => {
				var params = parseParams(req.params);
				dao[name].read(params, query2options(req.query), (err, item) => {
					console.info("GET:", req.url, "=>", err ? "ERR:" + err : item);
					if (err) {
						res.status(status(err)).json(err);
						return;
					}
					authorizeReadItem(schema, req.user, item, () => {
						res.json(item);
					}, res);
				});
			});

			// images
			for (let f in schema.properties) {
				let p = schema.properties[f];
				if (p.type === "image") {
					base.get(schema.urlItem + "/" + f, (req, res) => {
						console.log("Imagen:", req.url)
						var opt = {
							width: parseInt(req.query.width || 0),
							height: parseInt(req.query.height || 0),
							fit: req.query.fit || "resize"
						};
						dao[name].imageGet(parseParams(req.params), f, opt, "file", (err, file) => {
							//res.set("Content-Type", p.format || "image/png").status(200).send(buff);
							res.sendFile(file)
						});
					});
				}
			}
		}

		// POST
		if (schema.post && schema.urlList) {
			base.post(schema.urlList, (req, res) => {
				var data = Object.assign({}, req.body, parseParams(req.params));
				data.creator = req.user;
				data.creation_time = new Date();
				if (!data.owner) data.owner = data.creator;
				dao[name].create(data, (err, result) => {
					console.info("POST", schema.urlList, "=>", err ? "ERR" : result);
					res.status(status(err)).json(err || result);
				});
			});
		}

		// PUT
		if (schema.put && schema.urlItem) {
			base.put(schema.urlItem, (req, res) => {
				var params = parseParams(req.params);
				console.info("PUT >>>", params, req.body);
				authorize(schema, req.user, params, "write", () => {
					dao[name].update(params, req.body, (err, result) => {
						console.info("PUT:", schema.urlItem, "=>", err ? "ERR" : result);
						res.status(status(err)).json(err || result);
					});
				}, res);
			});
		}

		// DELETE
		if (schema.delete && schema.urlItem) {
			base.delete(schema.urlItem, (req, res) => {
				var params = parseParams(req.params);
				authorize(schema, req.user, params, "delete", () => {
					dao[name].delete(params, (err, result) => {
						console.log("DELETE", res.urlItem, err ? "ERR" : "OK", err || result);
						res.status(status(err)).json(err || true);
					});
				}, res);
			});
		}
	}

	return base;
};