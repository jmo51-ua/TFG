/*
	DAO - Acceso a datos desde el cliente. Utiliza REST y WebSocket
	El acceso se encapsula en objetos de tipo Item (un único elemento) o List (una colección de elementos)
	La librería DAO es compatible tanto con Angular (utiliza $http para REST) como con NodeJS (utiliza http)
*/
(function (isNode) {
	'use strict';

	const DAOEntityClient = (isNode ? require("./dao_entity_client") : window).DAOEntityClient;
	const Evented = (isNode ? require("./evented") : window).Evented;

	/**
	 * DAO en el cliente. Utiliza REST y WebSockets para comunicarse con el servidor.
	 * @extends Evented
	 */
	class DAOClient extends Evented {
		/**
		 * Crea un DAO en el cliente
		 * @param {RESTClient} rest Referencia al REST de cliente
		 * @param {WSClient} ws Referenica al WS de cliente
		 */
		constructor(rest, ws) {
			super(); // Herencia de Evented

			Object.defineProperties(this, {
				_rest: { value: rest },
				_ws: { value: ws }
			});

			// emisiones dao remotas
			ws.on("dao-entity-emit", (entity, id, data) => {
				console.log("dao remote emit:", entity, id, ...data);
				this[entity].emit(id, ...data);
			});
		}

		/**
		 * Añade un schema al DAO
		 * @param  EntitySchema} schema Nuevo schema
		 */
		addSchema(schema) {
			this[schema.name] = new DAOEntityClient(this, schema);
		}

		/**
		 * Añade un conjunto de schemas al DAO
		 * @param {Object} schemas Diccionario con una entrada por esquema {@link EntitySchema}
		 */
		addSchemas(schemas) {
			for (let s in schemas) this.addSchema(schemas[s]);
		}
	}

	// Exportar API
	if (isNode) { // NodeJS
		exports.DAOClient = DAOClient;
		exports.daoClient = function (...args) { return new DAOClient(...args); };
	}
	else { // Browser
		if (typeof angular !== "undefined") { // AngularJS
			angular.module("daoClient", []).factory("daoClient", function () {
				return function (...args) { return new DAOClient(...args); };
			});
		} else {
			window.daoClient = function (...args) { return new DAOClient(...args); };
		}
	}
})(typeof module !== 'undefined' && module.exports);