// -----------------------------------
// Services - API REST
// -----------------------------------
// Creación y puesta en marcha del API
// -----------------------------------

"use strict";

const express = require('express');

/** 
 * Módulo para la creacion de servidores REST
 * @module restDoc
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
 * @returns Router de express con los metodos de acceso al API REST
 * @example
 * var apiExpressRoute = require("./rest_server").restServer(config, dao, auth, register);
 */
exports.restDoc = function (config, dao) {

	function label(name, attrs, ...contents) {
		var html = "\n<" + name;
		if (Object.prototype.toString.call(attrs) === '[object Object]') {
			for (let f in attrs) {
				html += " " + f;
				if (attrs[f] !== false) html += '="' + attrs[f] + '"';
			}
		} else {
			contents.unshift(attrs);
		}
		html += ">";

		if (contents.length == 1 && contents[0] === false) return html;
		contents.forEach((content) => {
			if (typeof content === "funtion") content = content();
			html += content;
		});
		html += "</" + name + ">";
		return html;
	}

	function html(title, content) {
		return label("!doctype", { html: false }, false) +
			label("html",
				label("head",
					label("meta", { charset: "utf8" }, false),
					label("title", title),
					label("style", "\
					body { font-family: Courier; }\
					table { border-spacing: 0; }\
					table, td, th { border: 1px solid #aaa; }\
					td, th { padding: 4px; }\
					")
				),
				label("body",
					label("h1", title),
					content
				)
			);
	}

	// Base del API (ruta de acceso al API)
	var base = express.Router();

	base.get("/", function (req, res) {
		var body = ""
		for (let entity in dao) {
			let schema = dao[entity].schema;
			body += label("tr", label("td", label("a", { href: entity }, schema.name)), label("td", schema.title));
		}
		body = label("table", body);
		res.send(html("REST API Documentation", body));
	});

	for (let entity in dao) {
		let schema = dao[entity].schema;
		base.get("/" + entity, function (req, res) {
			res.send(html("REST API Documentation: " + entity,
				label("table",
					label("tr",
						label("th", "Name"),
						label("td", schema.name)
					),
					label("tr",
						label("th", "Title"),
						label("td", schema.title)
					),
					label("tr",
						label("th", "Description"),
						label("td", schema.description)
					),
				) +
				label("table",
					label("tr",
						label("th", "Property"),
						label("th", "Type"),
						label("th", "Table"),
						label("th", "Field")
					),
					Object.keys(schema.properties).reduce(function (row, f) {
						var p = schema.properties[f];
						return row + label("tr",
							label("td", f),
							label("td", p.type),
							label("td", p.table),
							label("td", p.field),
						);
					}, "")
				)
			));
		});
	}

	return base;
};

exports.raml = function (config, dao) {
	// Base del RAML
	var base = express.Router();

	base.get("/", function (req, res) {
		var raml = "";
		raml += "#%RAML 1.0\n";
		//raml += "title: \n";
		//raml += "baseUri: " + config.url + "\n";
		raml += "\n";

		var paths = {}; // conjunto de endponits
		raml += "types:\n";
		for (let entity in dao) {
			let schema = dao[entity].schema;
			raml += "  " + entity + ":\n";
			raml += "    type: object\n";
			if (schema.title) raml += "    displayName: " + schema.title + "\n";
			if (schema.description) raml += "    description: " + schema.description + "\n";
			raml += "    properties:\n";
			for (let p in schema.properties) {
				raml += "      " + p + ": " + schema.properties[p].type + "\n";
			}
			for (let p in schema.lists) {
				raml += "      " + p + ": " + schema.lists[p].type + "[]\n";
			}

			var xx = [];
			if (schema.urlList) xx.push({ url: schema.urlList, type: "list" });
			if (schema.urlItem) xx.push({ url: schema.urlItem, type: "item" });
			xx.forEach((y) => {
				let x = paths;
				y.url.substr(1).split("/").forEach((p) => {
					if (p.substr(0, 1) == ":") p = "{" + p.substr(1) + "}";
					if (x[p] === undefined) x[p] = {};
					x = x[p]
				});
				x._schema = schema;
				x._type = y.type;;
			});
		}
		raml += "\n";

		function endpoint(path, level) {
			for (var p in path) {
				if (p.substr(0, 1) == "_") continue;
				let pp = path[p];
				raml += level + "/" + p + ":\n";
				if (pp._schema) {
					raml += level + "  get:\n"
					raml += level + "    description: Get a " + pp._type + " of '" + pp._schema.name + "'\n";
					raml += level + "    responses:\n"
					raml += level + "      200:\n"
					raml += level + "        body:\n"
					raml += level + "          application/json:\n"
					raml += level + "            type: " + pp._schema.name + (pp._type == "list" ? "[]" : "") + "\n"
					if (pp._schema.post) {
						raml += level + "  post:\n"
						raml += level + "    description: Create a new '" + pp._schema.name + "'\n";
						raml += level + "    body:\n"
						raml += level + "      application/json:\n"
						raml += level + "        type: " + pp._schema.name + "\n"	
						raml += level + "    responses:\n"
						raml += level + "      200:\n"
						raml += level + "        body:\n"
						raml += level + "          application/json:\n"
						raml += level + "            type: " + pp._schema.name + "\n"	
					}
					if (pp._schema.put) {
						raml += level + "  put:\n"
						raml += level + "    description: Update a '" + pp._schema.name + "'\n";
						raml += level + "    body:\n"
						raml += level + "      application/json:\n"
						raml += level + "        type: " + pp._schema.name + "\n"	
						raml += level + "    responses:\n"
						raml += level + "      200:\n"
						raml += level + "        body:\n"
						raml += level + "          application/json:\n"
						raml += level + "            type: " + pp._schema.name + "\n"	
					}
					if (pp._schema.delete) {
						raml += level + "  delete:\n"
						raml += level + "    description: Delete a '" + pp._schema.name + "'\n";
						raml += level + "    responses:\n"
						raml += level + "      200:\n"
						raml += level + "        body:\n"
						raml += level + "          application/json:\n"
						raml += level + "            type: " + pp._schema.name + "\n"	
					}
				}
				endpoint(pp, level + "  ");
			}
		}

		endpoint(paths, "");

		res.set("Content-Type", "text/plain").send(raml);
	});

	return base;
};
