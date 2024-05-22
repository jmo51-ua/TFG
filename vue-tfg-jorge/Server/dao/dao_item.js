(function (isNode) {
	"use strict";

	const utils = isNode ? require("./utils") : window.utils;
	const DAOElement = (isNode ? require("./dao_element") : window).DAOElement;

    /**
     * Item de una entidad en el DAO. Encapsula los datos de un item y automatiza los procesos de guardado.<br />
     * El item tiene una propiedad [data]{@link DAOItem#data} con los datos del elemento.<br />
	 * Esta propiedad es la parte pública del item, sobre el que el usuario puede trabajar, leyendo y cambiando los datos (propiedades y arrays).<br />
	 * El método [load()]{@link DAOItem#load} permite obtener los datos de un item del servidor.<br />
	 * Adicionalmente el item lleva un registro interno que le permite saber que es lo que el usuario ha modificado del item. El estado interno se codifica en [src]{@link DAOItem#src} para las propiedades y [lists]{@link DAOItem#lists} para las listas (arrays).<br />
     * Si se modifican los datos, mediante el método [sync()]{@link DAOItem#sync} se guardan los datos cambiados en el servidor.<br />
	 * En la actualización se tendrán también en cuenta los cambios realizados en arrays del item.<br />
	 * Este control se realiza exclusivamente de las propiedades definidas en el esquema del item. Se pueden incluir otras propiedades en data, pero estas no seran tenidas en cuenta en los procesos de actualización.<br />
	 * <ul>
	 * <li><strong>Propiedades</strong>
	 * <ul>
	 * <li>[data]{@link DAOItem#data}: Datos públicos del item (propiedades y arrays). Pueden ser modificados por el usuario.</li> 
	 * <li>[src]{@link DAOItem#src}: Propiedades internas del item (último estado guardado).</li>
	 * <li>[lists]{@link DAOItem#lists}: Listas internas del item (asociadas a los arrais de data).</li>
	 * </ul>
	 * </li>
	 * <li><strong>Métodos</strong>
	 * <ul>
	 * <li>[load()]{@link DAOItem#load}: Carga datos del item.</li>
	 * <li>[sync()]{@link DAOItem#sync}: Guarda los datos cambiados del item.</li>
	 * <li>[delete()]{@link DAOItem#delete}: Borra el item.</li>
	 * <li>[changed()]{@link DAOItem#changed}: Indica si un item ha sido modificado (tiene datos pendientes de ser guardados).</li>
	 * <li>[set()]{@link DAOItem#set}: Establece los datos del item, dejando el item sin cambios pendientes.</li>
	 * <li>[params()]{@link DAOItem#params}: Obtiene el valor de los parámetros de un item.</li>
	 * <li>[is()]{@link DAOItem#is}: Indica si un item se corresponde con unos datos.</li>
	 * <li>[list()]{@link DAOItem#list}: Obtiene / crea una lista asociada al item.</li>
	 * </ul>
	 * </li>
	 * <li><strong>Eventos</strong>
	 * <ul>
	 * <li>[load]{@link DAOItem#event:load}: Carga de datos
	 * <li>[load-error]{@link DAOItem#event:load-error}: Carga de datos
	 * </ul>
	 * </li>
	 * <li><strong>Propiedades estáticas</strong>
	 * <ul>
	 * <li>[debug]{@link DAOItem.debug}: Muestra / oculta los mensajes de depuración
	 * </ul>
	 * </li>
	 * </ul>
     * @extends DAOElement
     * @example
     * var user = new DAOItem(user); // crea un usuario nuevo
	 * user.data =  { name: "Jonh" }; // establece unos datos 
	 * user.sync(); // lo guarda
     */
	class DAOItem extends DAOElement {
        /**
         * Crea un item
         * @param {DAOEntityClient} entity Entidad
         */
		constructor(entity) {
			super(entity);

			/**
			 * Propiedades internas del item. Comparadas con las de data, permite saber que ha cambiado en el objeto desde que se cargó o se guardó por ultima vez
			 * @type {Object}
			 */
			this._src = {};
			/**
			 * Diccionario de objetos tipo {@link DAOList} asociados a los arrays del item
			 */
			this._lists = {};
		}

		/**
		 * Muestra un mensaje de depuración
		 * @param {string} method Método
		 * @param  {...any} args Valores
		 */
		debug(method, ...args) {
			var params = this.params();
			if (!params) {
				params = "*";
			} else {
				let fields = Object.keys(params);
				if (fields.length === 1) {
					params = params[fields[0]];
				} else {
					params = JSON.stringify(params);
				}
			}
			if (DAOItem.debug) console.log("[DAO item] " + this.entity.schema.name + "{" + params + "}." + method + ":", ...args);
			return this;
		}

		/**
		 * Datos públicos del item. Pueden ser consultados o cambiados por el usuario. Un item interno (un item dentro de una lista de un item) no tiene.
		 * @name data
		 * @type {Object}
		 * @memberof DAOItem
		 * @instance
		 */

		/**
		 * Obtiene los params de un item (o null si es nuevo)
		 * @return {Object|null} Valores de los parámetros (si están todos asignados en src) o null (un item nuevo)
		 * @example
		 * var u = new DAOItem(user);
		 * u.data = { name: "Paul" };
		 * u.params(); // null (new user)
		 * u.sync().then(() => {
		 *   u.params(); // { id: 107 }
		 * });
		 */
		params() {
			return this.entity.paramsItem(this._src);
		}

		/**
		 * Indica si los params del item se corresponden a los datos indicados en data.
		 * @param {Object} data Datos a comparar con los param del item
		 * @return {Boolean} Indica si es ese item. Si es nuevo (params no completos) retorna false
		 */
		is(data) {
			for (let i = 0; i < this.entity.schema.paramsItem.length; i++) {
				let p = this.entity.schema.paramsItem[i];
				if (data[p] === undefined) return false;
				if (data[p] !== this._src[p]) return false;
			}

			return true;
		}

        /**
         * Obtiene los datos del servidor
         * @param {Object} options Opciones para el GET
		 * @return {Promise} Promesa de finalización
		 * @emits DAOItem#load
		 * @emits DAOItem#load-error
         */
		load(options) {
			this.debug("load", options);
			this.data = {};
			return this.entity.read(this.params(), options).then((data) => {
				this.debug("load", "datos leidos:", data);
				this.data = data;
				this.set(data);
				/**
				 * Evento de carga de datos. Emitido por el método load() cuando se han obtenido los datos.
				 * @event DAOItem#load
				 * @prop {Object} data Datos (públicos) de item
				 * @example
				 * item.on("load", (data) => {...});
				 * item.load("*");
				 */
				this.emit("load", data);
				return data;
			}, (err) => {
				console.error("load: ERROR", err);
				/**
				 * Evento de error carga de datos. Emitido por el método load() cuando ha fallado el read.
				 * @event DAOItem#load-error
				 * @prop {Object} err Error producido
				 * @example
				 * item.on("load-error", (err) => {...});
				 * item.load("*");
				 */
				this.emit("load-error", err);
				return Promise.reject(err);
			});
		}

        /**
         * Enlaza actualizaciones del Item mediante WS para obtener cambios
		 * @param {Boolean} [status] Indica si se linka (true) o se unlinka (false). Si no se indica retorna el estado de linkado
		 * @returns {Boolean} Estado de linkado
		 * @emits DAOItem#update
		 * @emits DAOItem#delete
         */
		link(status) {
			if (status !== undefined) {
				if (status) { // linkar
					if (!this._wsOns) this._wsOns = [];
					if (this._wsOns.length) return true; // ya linkado
					var params = this.params();
					if (!params) return true; // es nuevo y aun no se puede enlazar
					this._wsOns.push(this.entity.on("update", params, (data) => {
						this.debug("link", "ws update", data);
						this.set(data); // actualizar datos
						this.emit("update", data);
					}));
					this._wsOns.push(this.entity.on("delete", params, () => {
						this.debug("link", "ws delete", data);
						this._src = {};
						this.emit("delete");
					}));
					this.debug("link", "Enlazado:", this._wsOns);
				} else { // unlink
					if (!this._wsOns) return false;
					if (this._wsOns.length) {
						this.debug("link", "Desenlazar:", this._wsOns)
						this._wsOns.forEach((id) => { this.entity.off(id); });
					}
					delete this._wsOns;
					this.debug("link", "Desenlazado");
				}
				for (let l in this._lists) this._lists[l].link(status); // propagar a las listas
			}
			return "_wsOns" in this;
		}

		/**
		 * Elimina el item
		 * @returns {Promise} Promesa de finalización
		 */
		delete() {
			this.debug("delete", this.data);
			var params = this.params();
			if (!params) return Promise.reject("No se puede borrar, no hay params");
			this.entity.delete(params).then(() => {
				this.link(false);
				//this.set({});
				this.debug("Item eliminado");
			}, (err) => {
				return Promise.reject(err);
			});
			return this;
		}

		/**
		 * Indica si se ha modificado algo del item (hay datos pendientes de guardar)
		 * @param {Object} [data] Si se indica un dato, realiza la comparación con el (en vez de con this.data)
		 * @returns {boolean} true si hay cambios, false si no ha cambiado nada
		 * @example
		 * var user = new DAOItem(dao.user);
		 * user.changed(); // true (is a new user)
		 * user.load(".").then(() => {
		 *   user.changed(); // false
		 *   user.data.name = "New name";
		 *   user.changed(); // true (data changed)
		 * });
		 */
		changed(data) {
			if (!data) data = this.data;
			if (!data) return false;

			// Un item sin params (item nuevo) está pendiente de guardar
			if (!this.params()) return true;

			// recorrer las propiedades de la entidad
			for (let f in this.entity.schema.properties) {
				if (data[f] === undefined) continue; // el campo no está en data
				let p = this.entity.schema.properties[f]; // definición de la propiedad
				if (!p.write) continue; // este campo no se actualiza (ignorar)
				console.log("changed", f, this._src[f], data[f])
				if (!utils.equals(this._src[f], data[f])) { this.debug("*** dist", f); return true; }
			}

			// recorrer las listas de la entidad
			for (let f in this.entity.schema.lists) {
				if (!data[f]) continue; // la lista no está en data
				if (!this._lists[f]) return true; // la lista aun no ha sido creada
				if (this._lists[f].changed(data[f])) { this.debug("*** sub", f); return true; } // la lista ha sido modificada
			}

			return false; // no se ha encontrado ningún cambio
		}

		/**
		 * Obtiene una lista para el item. Si no existe se crea.
		 * @param {string} name Nombre de la lista (campo)
		 * @return {DAOList|null} Lista. Si no se puede crear retorna null
		 */
		list(name) {
			if (this._lists[name]) return this._lists[name];
			let ldef = this.entity.schema.lists[name];
			if (!ldef) {
				console.error("ERROR: No se puede crear una lista (no definida):", name);
				return null;
			}
			// obtener los params para la lista
			let params = {};
			for (let p in ldef.params) {
				let x = ldef.params[p];
				if (this._src[x] !== undefined) { params[p] = this._src[x]; continue; }
				console.error("ERROR: No se ha podido resolver los parametros de un sub", f, p, "->", x);
				return null;
			}
			this._lists[name] = new DAOElement.DAOList(this.entity.dao[ldef.type], params);
			if (this.link()) this._lists[name].link(true);

			return this._lists[name];
		}

		/**
		 * Establece los datos del item (lo deja sin cambios pendientes)
		 * @param {Object} [data] Datos a establecer (cambiar). Si no se indica se usa this.data
		 */
		set(data) {
			if (!data) {
				if (!this.data) return this;
				data = this.data;
			}

			this.debug("set", data);

			var params = this.params();

			// src
			for (let f in this.entity.schema.properties) {
				if (data[f] === undefined) continue;
				this._src[f] = utils.copy(data[f]);
				if (this.data && data !== this.data) this.data[f] = data[f];
			}
			this.debug("set", "new src:", this._src);

			// lists
			for (let f in this.entity.schema.lists) {
				if (!data[f]) continue; // no hay datos para esa lista
				this.list(f).set(data[f]) // establecer datos para la lista
			}

			this.emit("set", data);

			// si era nuevo y ahora tiene params, linkar si hay que linkar
			if (!params && this.link() && this.params()) this.link(true);

			return this;
		}

		/**
		 * Guarda los datos del item (lo deja sin cambios pendientes).<br />
		 * Si se indica data establece los datos publicos y privados con data.<br />
		 * Si no se indica data se actualizan los cambios con el servidor utlizando REST.
		 * @param {Object} [data] Datos a guardar. Si no se indica se usa this.data
		 * @returns {Promise} Promesa de finalización
		 */
		sync(data) {
			if (!data) data = this.data;
			if (!data) return this; // nada que actualizar

			this.debug("sync", "data:", data, "src:", this._src);

			// Obtener cambios realizados en la propiedades
			var changes = {}; // campos cambiados
			var changed = false; // algun cambio
			for (let f in this.entity.schema.properties) { // recorrer las propiedades de la entidad
				if (data[f] === undefined) continue; // el campo no está en data
				let p = this.entity.schema.properties[f]; // definición de la propiedad
				if (!p.write) continue; // este campo no se actualiza (ignorar)
				if (p.mandatory && (data[f] === undefined || data[f] === null)) {
					console.warn("sync: ERROR: field mandatory:", f);
					return Promise.reject({ code: "FIELDMANDATORY", field: f, text: "Field mandatory: " + f });
				}
				if (this._src && utils.equals(data[f], this._src[f])) continue; // campo no modificado (ignorar)
				changes[f] = data[f];
				changed = true;
			}
			var params = this.params();
			this.debug("sync", "Changes:", changes, changed, params ? "UPDATE" : "CREATE");

			return (this.params() ? ( // actualizar (PUT). Realizar solo si hay cambios
				changed ? this.entity.update(params, changes) : Promise.resolve()
			) : ( // nuevo (POST)
					this.entity.create(changes)
				)).then((dt) => {
					if (dt) {
						this.set(dt); // establecer datos internos del Item
						Object.assign(data, dt); // establecer los datos publicos (por datos que cambian en el servidor, como autos)
					}
					this.debug("sync", "Fin del sync de los datos basicos", dt);

					var subs = [];
					for (let name in this.entity.schema.lists) { // recorrer las listas de la entidad
						if (!data[name]) continue;
						this.debug("sync", "Sincronizar lista:", name, data[name]);
						subs.push(this.list(name).sync(data[name]));
					}
					return Promise.all(subs).then(() => {
						this.debug("sync", "OK (datos y sub)", data, this._src);
						this.emit("sync", data);
						return data;
					});
				}, (err) => {
					console.error("sync: Error actualizando el item", err);
					return Promise.reject(err);
				});
		}
	}

	/**
	 * Establece si se muestran o no los mensajes de depuración
	 * @type {Boolean}
	 * @static
	 * @name DAOItem.debug
	 * @example
	 * DAOItem.debug = true; // show debug messages
	 * DAOItem.debug = false; // hide debug messages
	 */
	DAOItem.debug = false;

	// Exportar
	DAOElement.DAOItem = DAOItem;

})(typeof module !== 'undefined' && module.exports);
