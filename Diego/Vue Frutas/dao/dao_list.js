(function (isNode) {
	'use strict';

	const DAOElement = (isNode ? require("./dao_element") : window).DAOElement;

	/**
	 * Lista de elementos del DAO del cliente.<br />
	 * Los objetos lista tienen una propiedad [data]{@link DAOElement#data} con los datos públicos de la lista (un array).<br />
	 * Estos datos pueden ser modificados directamente por el usuario, modificando, añadiendo y quitando elementos del array.<br />
	 * Cuando se invoca al método [sync()]{@link DAOList#sync} la lista se actualiza en el servidor.<br />
	 * El método [changed()]{@link DAOList#changed} permite saber si una lista ha sido modificada (tiene cambios pendientes de guardar).<br />
	 * El método [load()]{@link DAOList#load} permite cargar una lista con datos del servidor.
	 * @extends DAOElement
	 * @example
	 * var list = new DAOList(chapter, { book: 89 }); // create a list of chapters (for book 89)
	 * list.load("*").then(() => {
	 *   list.changed(); // false
	 *   list.data.push({ title: "Chapter 1" }); // add a chapter
	 *   list.changed(); // true
	 *   list.sync(); // save 
	 * });
	 */
	class DAOList extends DAOElement {
		/**
		 * Crea una nueva lista
		 * @param {DAOClienteEntity} entity Entidad
		 * @param {Object} [params] Parámetros de la lista
		 */
		constructor(entity, params) {
			super(entity); // herencia de DAOElement
			this.params = params || {}; // parametros de la lista
			this.items = []; // Objetos Items de cada entrada de la lista
		}

		// función interna de utilería para mostrar mensages de depuración
		debug(method, ...args) {
			if (! DAOList.debug) return this;
			console.info("list." + this.entity.schema.name + "." + JSON.stringify(this.params) + "[" + this.items.length + "]" + (this.data ? "<" + this.data.length + ">" : "")  + (method === true ? "" : "." + method) + ":", ...args);
			if (this.data && method === true) {
				this.item(this.data, (item, dt) => {
					console.info(" -", "item:", item ? item.src : "NUEVO", "dt:", dt ? dt : "BORRADO");
				});
			}
			return this;
		}

		/**
		 * Gestiona los items de la lista.<br>
		 * item(obj | item) -> Busca un item y retorna su indice en this.items o -1 si no lo encuentra.<br>
		 * item(obj, true) -> Inserta un nuevo item y lo retorna.<br>
		 * item(obj | item | index, false) -> Busca el item, si no se encuentra retorna null.<br>
		 * item(obj | item | index, null) -> Busca el item asociado al objeto data, si lo encuentra lo quita de items y lo deslinka.<br>
		 * item(data, callback) -> Compara el array data con los items. Invoca la función callback con los argumentos:
		 *  * callback(item, data, indexItem, indexData) -> item encontrado
		 *  * callback(null, data, -1, indexData) -> item no encontrado en this.items (nuevo)
		 *  * callback(item, null, indexItem, -1) -> item no encontrado en data (borrado)
		 * Si el callback retorna false se detiene el recorrido (y se retorna un false)<br>
		 * Si el callback retorna true:<br>
		 *  * Si item es null crea un nuevo item
		 *  * Si item no es null elimina el item
		 * @param {Object|array|DAOItem|number} data Referencia a los datos, item o indice del item. Si se indica una función en callback es un array
		 * @param {function|boolean|null} [callback] Callback para recorrer el array o opción.
		 */
		item(data, callback) {
			var index, item;

			if (typeof callback === "function") {
				let items = []; // para contar los items procesados
				for (let i = 0; i < data.length; i++) {
					let dt = data[i];
					index = this.item(dt);
					item = null;
					if (index >= 0) {
						items[index] = true;
						item = this.items[index];
					}
					let res = callback(item, dt, index, i);
					if (res === false) return false;
					if (res) {
						index = this.items.length;
						item = this.item(true);
						items[index] = true;
						callback(item, dt, index, i);
					}
				}
				for (index = 0; index < this.items.length; index++) { // buscar items no procesados
					if (!items[index]) {
						let res = callback(this.items[index], null, index, -1)
						if (res === false) return false;
						if (res === true) {
							this.item(index, null);
							items.splice(index, 1);
							index--;
						}
					}
				}
				return true;
			}

			if (data === true) { // item(true) -> crea un item vacio
				item = new DAOElement.DAOItem(this.entity);
				if (this.link()) item.link(true);
				this.items.push(item);
				return item;
			}

			if (callback === true) { // item(obj, true) -> crea un item con los datos pasados
				item = this.item(true);
				item.set(data);
				return item;
			}

			// Resolver index e item
			if (typeof data === "number") { // item(index, ?)
				index = data;
				item = this.items[index] || null;
				//data = callback;
			} else if (data instanceof DAOElement.DAOItem) { // item(item, ?)
				item = data;
				index = this.items.indexOf(item);
			} else { // item(obj, ?)
				index = this.items.findIndex((item) => item.is(data));
				item = index < 0 ? null : this.items[index];
			}

			// Accion establecida en callback
			if (callback === undefined) return index; // item(obj | item) -> index | -1
			if (callback === false) return item; // item(obj | item | index) -> item | null
			if (callback === null) { // item(obj | item | index, null) -> quita un item
				item.link(false);
				this.items.splice(index, 1);
				return item;
			}
		}

		/**
		 * Indica si la lista ha cambiado (tiene cosas pendientes de guardar)
		 * @param {Array} [data] Si se indica un array se compara con este array
		 * @returns {Boolean} true si la lista ha cambiado (modificación, eliminación o creación de items) o false si no
		 */
		changed(data) {
			if (!data) data = this.data;
			if (!data) return false;

			/*			var items = [], n = 0; // para contar los items procesados
						for (let i = 0; i < data.length; i++) {
							let index = this.items.findIndex((item) => item.is(data[i]));
							if (index < 0) { this.debug("*** nuevo", data[i]); return true; } // no encontrado item (item nuevo)
							if (this.items[index].changed(data[i])) return true; // item cambiado
							if (!items[index]) {
								items[index] = true;
								n++;
							}
						}
						if (n != this.items.length) { this.debug("*** borr", n, this.items.length); return true; } // algun item ha sido borrado*/

			if (this.item(data, (item, dt) => {
				//console.log("- - - changed>", "item:", item, "data:", dt);
				if (!item) return false;
				if (!dt) return false;
				if (item.changed(dt)) return false;
			}) === false) return true;

			return false;
		}

		/**
		 * Obtiene los datos de una lista.<br />
		 * Una vez obtenidos los datos la lista queda sin modificaciones pendientes.<br />
		 * @param {Object} options Opciones para el GET
		 * @return {Promise} Promesa de finalización
		 * @example
		 * var list = new DAOList(chapter, { book: 7 });
		 * list.load("*").then((data) => { ... }); // data also available in list.data
		 */
		load(options) {
			this.debug("load", options);
			return this.entity.read(this.params, options).then((data) => {
				this.data = data;
				this.set(data);
				return data;
			}, (err) => {
				console.warn("Error cargando lista", err);
				return Promise.reject(err);
			});
		}

		/**
		 * Establece los datos del la lista.<br />
		 * @param {array} data Nuevo array a establecer (si nos e indica se usa this.data)
		 */
		set(data) {
			if (!data) data = this.data;
			this.debug("set", data);
			if (!data) return;

			// items
			this.item(data, (item, dt) => {
				if (!item) {
					this.debug("set", "Insertar nuevo item...", dt);
					return true;
				} else if (!dt) {
					this.debug("set", "Quitar item...", item)
					return true;
				} else {
					item.set(dt);
				}
			});
		}

		/**
		 * Guarda los datos del la lista.<br />
		 * Si no se indica nada en data, se buscan los cambios y se aplican con REST.<br />
		 * En cualquier caso, despues de sync la lista estará como no modificada.
		 * @param {Array} [data] Datos a establecer (si no se indica se usa this.data)
		 * @returns {Promise} Promesa de finalización
		 * @example
		 * var list = new DAOList(user, {}, []);
		 * list.sync([{id: 1, name: "U1"}, {id: 2, name: "U2"}]); // set the content of the list
		 * list.data[0].name = "new name"; // change an item
		 * list.sync(); // save data in server
		 */
		sync(data) {
			if (!data) data = this.data;
			this.debug("sync", data);
			if (!data) {
				console.error("No data to sync");
				return Promise.reject();
			}

			var proc = [];

			this.item(data, (item, dt) => {
				if (!dt) {
					this.debug("sync", "Detectado item eliminado", item.src);
					proc.push(item.delete());
					return true;
				}
				if (dt.$nosync) return; // no sincronizar ese item
				if (!item) {
					this.debug("sync", "Detectado nuevo item", dt);
					return true;
				}
				this.debug("sync", "Sincronizar item:", dt);
				Object.assign(dt, this.params); // completar los datos con los parametros de la lista
				if (!item) item = this.item(dt, true);
				proc.push(item.sync(dt));
			});

			this.debug("sync", "Guardar cambios en items:", proc.length)
			if (!proc.length) return Promise.resolve();
			return Promise.all(proc).then(() => {
				this.debug("sync", "Fin de los sync de items");
			});
		}

		/**
		 * Enlaza una lista para detectar eventos de cambio
		 * @param {Boolean} [status] Estado de linkado. Si no se indica solo retorna el estado. Si es true enlaza la lista y si es false la desenlaza.
		 * @returns {Boolean} Estado de linkado
		 */
		link(status) {
			if (status !== undefined) {
				if (status) {
					if (this._wsOns) return true;
					this.debug("link", "Enlazar");
					this._wsOns = [
						this.entity.on("create", this.params, (data) => {
							this.debug("link", "ws create", data);
							this.emit("create", data);
						}),
						this.entity.on("delete", this.params, () => {
							this.debug("link", "ws delete");
							this.emit("delete", data);
						})
					];
				} else {
					if (!this._wsOns) return false;
					this.debug("unlink:", "Desenlazar");
					this._wsOns.forEach((id) => { this.entity.off(id); });
					delete this._wsOns;
				}
				this.items.forEach((i) => { i.link(status); });
			}
			return "_wsOns" in this;
		}
	}

	/**
	 * Establece si se muestran o no los mensajes de depuración
	 * @type {Boolean}
	 * @static
	 * @name DAOListdebug
	 * @example
	 * DAOList.debug = true; // show debug messages
	 * DAOList.debug = false; // hide debug messages
	 */
	DAOList.debug = false;

	// Exportar
	DAOElement.DAOList = DAOList;

})(typeof module !== 'undefined' && module.exports);
