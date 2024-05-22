'use strict'

const DAOEntityServer = require("./dao_entity_server").DAOEntityServer;
const Evented = require("./evented").Evented;

/**
 * Clase para el acceso a datos (Data Access Object) en el servidor.<br />
 * Función de forma simila al DAO del cliente ({@link DAOClient})<br />
 * Es un diccionario de {@link DAOEntityServer}.<br />
 * Por cada esquema se crea una propiedad en el DAO con un API de acceso específico para cada entidad.
 * @extends Evented
 */
class DAOServer extends Evented {
	/**
	 * Crea un DAO en el cliente
	 * @param {Object} schemas Diccionario con los esquemas de entidad ({@link EntitySchema})
	 * @param {Database} db Database
	 * @param {Object} config Configuración del DAO
	 * @param {string} config.blobs Ruta (directorio) donde se almacenan los blobs
	 * @example
	 * var dao = new DAOServer(schemas, db, ws, config);
	 * dao.user.read((users) => { ... });
	 */
	constructor(schemas, db, ws, config) {
		super(); // Herencia de Evented
		for (let s in schemas) { // crear una entrada por cada esquema
			let schema = schemas[s];
			this[schema.name] = new DAOEntityServer(this, schema, db, ws, config);
		}
	};
}

// Exportar
exports.DAOServer = DAOServer;
exports.daoServer = function (...args) { return new DAOServer(...args); };