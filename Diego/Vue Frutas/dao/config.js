"use strict";

/**
 * Módulo para la gestión de la configuración.<br />
 * La configuración puede ser obtenida de archivos JSON.<br />
 * Permite extender una configuración con la otra configuración.
 * @module config
 */

const fs = require("fs");

// Extiende las propiedades de una lista de objetos en un objeto destino de forma recursiva
function deepExtend(target, ...sources) {
	sources.forEach(function (source) {
		for (const f in source) {
			if (source[f] && typeof source[f] === "object") { // es un objeto, extender de forma recursiva
				if (!target[f]) target[f] = Array.isArray(source[f]) ? [] : {};
				deepExtend(target[f], source[f]);
			} else { // no es un objeto
				target[f] = source[f];
			}
		}
	});

	return target;
}

/**
 * Lee y parsea un archivo JSON
 * @param {string} file Nombre del archivo
 * @returns {Object} Objeto con la configuración leida
 * @example
 * const config = require("./config");
 * var cfg = config.readJSON("myconfig.json");
 */
exports.readConfigFile = function (file) {
	var json = fs.readFileSync(file);
	try {
		return JSON.parse(json);
	} catch(err) {
		return null;
	}
}

/**
 * Extiende la configuración del destino con la configuración del origen
 * @param {Object} target Configuración destino
 * @param {Object|string} src Configuración origen. si es un string lo carga de archivo
 * @returns {Object} Configuración resultante (destino)
 * @example
 * const config = require("./config");
 * var cfg = config.readJSON("myconfig.json");
 * config.extends(cfg, "otherconfig.json");
 */
exports.extends = function (target, src) {
	if (typeof src === "string") src = exports.readConfigFile(src);
	return deepExtend(target, src);
};
