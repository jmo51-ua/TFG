(function (isNode) {
	"use strict";

	const DAOEntity = (isNode ? require("./dao_entity") : window).DAOEntity;

	// Compone una URL a partir de un template y unos parámetros
	// getUrl("/user/:id", { id: 7 }) -> "/user/7"
	function getUrl(url, params) {
		if (!url) return null;
		for (let p in params) {
			url = url.replace(":" + p, params[p]);
		}
		if (url.indexOf(":") >= 0) {
			//console.error("No se ha podido resolver el path", base, "con", params, "->", url);
			return null;
		}
		return url;
	}

	/**
	 * Entidad del DAO del cliente.<br />
	 * Hereda de {@link DAOEntity}.<br />
	 * Funciona de la misma forma que el DAO en el servidor ({@link DAOEntityServer}).<br />
	 * Para el CRUD utiliza {@link RESTClient}.<br />
	 * Para los eventos utiliza {@link WSClient}.
	 * @extends DAOEntity
	 */
	class DAOEntityClient extends DAOEntity {
		/**
		 * Crea una nueva entidad
		 * @param {DAOClient} dao Referencia al DAO
		 * @param {EntitySchema} schema Definición de la entidad
		 */
		constructor(dao, schema) {
			super(dao, schema);
		}

		debug(...data) {
			console.log("[DAO EC] " + this.schema.name + ":", ...data);
		}

		readDo(params, options) {
			var url = getUrl(this.schema.urlItem, params);
			if (!url) {
				url = getUrl(this.schema.urlList, params);
				if (!url) {
					console.warn("No se puede leer de la entidad. Parámetros incompletos", this.schema.name, params);
					return Promise.reject({ code: "MISSING_PARAMS", text: "Missing params to construct path" });
				}
			}
			var sep = "?";
			if (options.fields) {
				url += sep + "fields=" + options.fields.join(",");
				sep = "&";
			}
			if (options.order) {
				url += sep + "order=" + options.order.join(",");
				sep = "&";
			}
			if (options.filter) {
				url += sep + "filter=" + Object.entries(options.filter).map((f) => f[0] + ":" + JSON.stringify(f[1])).join(",");
				sep = "&";
			}
			return this.dao._rest.get(url).then((data) => {
				// Transformación de tipos no soportados por JSON
				var typeProcess = (type, data) => {
					if (!data) return;
					if (Array.isArray(data)) return data.forEach((dt) => { typeProcess(type, dt); }); // si es un array recorrer
					var schema = this.dao[type].schema;
					for (let f in data) { // recorrer los campos
						if (schema.properties[f]) { // es una propiedad
							if (schema.properties[f].type == "datetime" && data[f]) data[f] = new Date(data[f]);
							continue;
						}
						if (schema.lists[f]) { // es una lista
							typeProcess(schema.lists[f].type, data[f]);
						}
					}
				}
				typeProcess(this.schema.name, data);
				return data;
			});
		};

		createDo(data) {
			if (!data) data = {};
			var url = getUrl(this.schema.urlList, data);
			if (!url) {
				console.error("No se puede construir el path para hacer un POST", this.schema.urlList, data);
				return Promise.reject({ code: "MISSING_PARAMS", text: "Missing params to construct path" });
			}

			return this.dao._rest.post(url, data);
		}

		updateDo(params, data) {
			var url = getUrl(this.schema.urlItem, params);
			if (!url) {
				console.error("No se puede construir el path para hacer un PUT", this.schema.urlItem, params);
				return Promise.reject({ code: "MISSING_PARAMS", text: "Missing params to construct path" });
			};

			return this.dao._rest.put(url, data);
		}

		deleteDo(params) {
			var url = getUrl(this.schema.urlItem, params);
			if (!url) {
				console.error("No se puede construir el path para hacer un GET");
				return Promise.reject({ code: "MISSING_PARAMS", text: "Missing params to construct path" });
			}

			return this.dao._rest.delete(url);
		}

		/**
		 * Realiza una subscripción remota a un evento
		 * @param {string} name Nombre del evento
		 * @param {Object} filter Filtros
		 * @param {function} callback Función callback
		 * @returns {number} Identificación de la subscripción
		 */
		on(name, filter, callback) {
			if (typeof filter === "function") {
				callback = filter;
				filter = null;
			}
			var id = super.on(name, filter, callback); // subscripcion local
			this.debug("on:", name, filter, id);
			this.dao._ws.emit("dao-entity-on", this.schema.name, id, name, filter);
			return id;
		}

		/**
		 * Elimina un subscripción remota a evento. El id es el retornado por on
		 * @param {number} id Id de la subscripción (retornado por on())
		 */
		off(id) {
			this.debug("off:", id);
			this.dao._ws.emit("dao-entity-off", this.schema.name, id);
			return super.off(id);
		}

		/**
		 * Crea una URL para un campo de tipo image de la entidad
		 * @param {Object} params Parámetros de la entidad
		 * @param {String} field Campo de tipo image
		 * @param {number} width Ancho de la imagen
		 * @param {number} height Alto de la imagen
		 * @param {number} [fit="cover"] Tipo de ajuste: resize (puede deformar la imagen)  cover (cubre todo el ancho y alto, no deforma, puede recortar) contain (no deforma, puede incluir márgenes)
		 */
		imageURL(params, field, width, height, fit = "cover") {
			return this.dao._rest.urlBase + this.urlItem(params) + "/" + field + "?width=" + width + "&height=" + height + "&fit=" + fit + "&token=" + this.dao._rest.token;
		}
	}

	if (isNode) { // NodeJS
		exports.DAOEntityClient = DAOEntityClient;
	} else { // Browser
		window.DAOEntityClient = DAOEntityClient;
	}
})(typeof module !== 'undefined' && module.exports);