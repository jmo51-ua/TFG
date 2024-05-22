(function (isNode) {
	'use strict';

	const Evented = (isNode ? require("./evented") : window).Evented;
	if (isNode) {
		require("./dao_item");
		require("./dao_list");
	}
	const DAOElement = (isNode ? require("./dao_element") : window).DAOElement;

	/**
	 * Entidad en el DAO .<br />
	 * Funciona igual tanto en el cliente ({@link DAOEntityClient}) como en el servidor ({@link DAOEntityServer}).<br />
	 * Permite hacer un CRUD sobre las entidades (compatibles con callback y Promise):
	 * <ul>
	 * <li>[create()]{@link DAOEntity#create}: Crea un elemento.</li>
	 * <li>[read()]{@link DAOEntity#read}: Obtiene elemento(s).</li>
	 * <li>[update()]{@link DAOEntity#update}: Actualiza un elemento.</li>
	 * <li>[delete()]{@link DAOEntity#delete}: Elimina un elemento.</li>
	 * </ul>
	 * Gestión de eventos:
	 * <ul>
	 * <li>[on()]{@link DAOEntity#on}: Subscripción a un evento de entidad.</li>
	 * <li>[off()]{@link DAOEntity#off}: Eliminación de subscripción.</li>
	 * </ul>
	 * Gestión avanzada de datos:
	 * <ul>
	 * <li>[item()]{@link DAOEntity#item}: Crea un objeto de tipo {@link DAOItem}.</li>
	 * <li>[list()]{@link DAOEntity#list}: Crea un objeto de tipo {@link DAOList}.</li>
	 * </ul>
	 * Utilidades:
	 * <ul>
	 * <li>[dao]{@link DAOEntity#dao}: Acceso al DAO del cliente.</li>
	 * <li>[schema]{@link DAOEntity#schema}: Definición de la entidad.</li>
	 * <li>[staticData()]{@link DAOEntity#staticData}: Gestión de datos estáticos.</li>
	 * </ul>
	 * Eventos:
	 * <ul>
	 * <li>[create]{@link DAOEntity#event:create}</li>
	 * <li>[update]{@link DAOEntity#event:update}</li>
	 * <li>[delete]{@link DAOEntity#event:delete}</li>
	 * </ul>
	 * @extends Evented
	 */
	class DAOEntity extends Evented {
		/**
		 * Evento que se lanza cuando se crea un elemento de esta entidad
		 * @event DAOEntity#create
		 * @param {Object} data Datos de la entidad creada (incluye autoincrementales)
		 * @example
		 * dao.user.on("create", (data) => { console.log(data); }); // shows: { id: 20, name: "Peter" }
		 * dao.user.create({ name: "Peter"}); // fires a "create" event
		 */

		/**
		 * Evento que se lanza cuando actualiza un elemento de esta entidad
		 * @event DAOEntity#update
		 * @param {Object} data Datos modificados (inlcluye los params del update)
		 * @example
		 * dao.user.on("update", (data) => { console.log(data); }); // shows: { id: 1, name: "New name" }
		 * dao.user.update({ id: 1 }, { name: "New name" }); // fires a "update" event
		 */

		/**
		 * Evento que se lanza cuando se elimina una elemento de una entidad 
		 * @event DAOEntity#delete
		 * @param {Object} params Parámetros del elemento eliminado
		 * @example
		 * dao.user.on("delete", (user) => { console.log(user); }); // shows: { id: 1 }
		 * dao.user.delete({ id: 1 }); // fires a "delete" event
		 */

		/**
		 * Crea una nueva entidad
		 * @param {DAO} dao Referencia al DAO
		 * @param {Object} schema Definición de la entidad
		 */
		constructor(dao, schema) {
			super(); // Herencia de Evented

			/**
			 * Acceso al DAO
			 * @type {DAOClient}
			 */
			this.dao = dao;

			/**
			 * Definición de la entidad
			 * @type {Object}
			 */
			this.schema = schema;

			// Datos estáticos almacenados
			this._staticData = { data: [], index: {} };
		}

		/**
		 * Obtiene los parámetros de la entidad
		 * @param {*} data Aplica los parámetros sobre los datos pasados
		 * @return {Object|null} Retorna un objeto con los parámetros o null si falta alguno en data
		 * @example
		 * dao.user.paramsItem(user); // retorna { id: 8 }
		 */
		paramsItem(data) {
			var params = {};
			for (let i = 0; i < this.schema.paramsItem.length; i++) {
				var f = this.schema.paramsItem[i];
				if (data[f] === undefined) return null;
				params[f] = data[f];
			}
			return params;
		}

		/**
		 * Crea la URL para un item de la entidad
		 * @param {Object} data Datos de los que obtener los parámetros
		 */
		urlItem(data) {
			var url = this.schema.urlItem;

			for (let p = 0; p < this.schema.paramsItem.length; p++) {
				let param = this.schema.paramsItem[p];
				if (data[param] === undefined) return null;
				url = url.replace(":" + param, data[param]);
			};

			return url;
		}

		/**
		 * Obtiene un elemento (item) o una colección de elementos (list) de esta entidad del DAO.<br />
		 * Es compatible con callback y con promesas
		 * @method DAOEntity#read
		 * @param {object|number} params Parámetros para el GET
		 * @param {Object|array|string} options Opciones para el GET
		 * @param {function} [callback] Función de finalización: callback(err, res)
		 * @returns {Promise} Promesa con los datos obtenidos
		 * @example
		 * dao.user.read("."); // obtiene todos los usuarios
		 * dao.user.read({ id: 8 }, "."); // obtiene el usuario con id 8
		 * dao.user.read(9, "."); // obtiene el usuario con id 9
		 * dao.chapter.read({ book: 3 }, "*"); // obtiene los capítulos del libro 3
		 * dao.chapter.read({ id: 5 }); // obtiene el capítulo con id 5
		 * dao.chapter.read(8); // obtiene el capítulo 8
		 */

		read(params, options, callback) {
			// params
			if (typeof params === "number") params = { id: params }; // read(7,...) -> read({id:7},...)
			if (params === undefined || typeof params === "string" || typeof params === "function") { // read([options], [callback]) -> read({}, options, callback)
				callback = options;
				options = params;
				params = {};
			}

			// options
			if (options === undefined || typeof options === "function") { // read(params, [callback]) -> read(params, {}, callback)
				callback = options;
				options = {};
			}

			// callback
			if (typeof callback === "function") {
				return this.read(params, options).then((data) => { callback(null, data); return data; }, (err) => { callback(err, null); });
			}

			// autocompletar options
			if (!options) options = {};
			if (typeof options === "string") options = { fields: options };
			if (!options.fields) options.fields = ".";
			if (typeof options.fields === "string") options.fields = options.fields.trim().split(",");
			if (typeof options.order === "string") options.order = options.order.trim().split(",");

			// analisis previos
			var err = this.readPre(params, options);
			if (err) return Promise.reject(err);

			// efectuar la lectura
			return this.readDo(params, options).then((data) => {
				// analisis post
				err = this.readPost(data, params, options);
				if (err) return Promise.reject(err);

				// Todo ok
				return data;
			});
		}

		readPre() { }
		readDo() { }
		readPost() { }

		/**
		 * Crea un elemento en esta entidad del DAO
		 * @method DAOEntity#create
		 * @param {Object} data Datos del nuevo elemento
		 * @param {function} [callback] Función de finalización: callback(err, res)
		 * @returns {Promise} Promesa con los datos creados (incluye autoincrementales)
		 * @fires DAOEntity#create
		 * @example
		 * dao.user.create({ name: "Peter" });
		 */
		create(data, callback) {
			// data
			if (data === undefined || typeof data === "function") {
				callback = data;
				data = {};
			}

			// callback
			if (typeof callback === "function") {
				return this.create(data).then((data) => { callback(null, data); return data; }, (err) => { callback(err, null); });
			}

			// analisis previos
			var err = this.createPre(data);
			if (err) return Promise.reject(err);

			// efectuar la lectura
			return this.createDo(data).then((data) => {
				// analisis post
				err = this.createPost(data);
				if (err) return Promise.reject(err);

				// Todo ok
				return data;
			});
		}

		createPre() { }
		createPost() { }

		/**
		 * Actualiza un elemento de esta entidad del DAO
		 * @method DAOEntity#update
		 * @param {Object|number} params Parámetros del elemento
		 * @param {Object} data Datos a actualizar
		 * @param {function} [callback] Función de finalización: callback(err, res)
		 * @returns {Promise} Promesa con los datos creados (incluye los parámetros)
		 * @fires DAOEntity#update
		 * @example
		 * dao.user.update({ id: 19, { name: "new name" }); // actualiza el usuario con id 19
		 * dao.user.update(45, { ... }); // actualiza el usuario con id 45
		 */
		update(params, data, callback) {
			// callback
			if (typeof callback === "function") return this.update(params, data).then((data) => { callback(null, data); return data; }, (err) => { callback(err, null); });

			//params
			if (typeof params === "number") params = { id: params };

			// analisis previos
			var err = this.updatePre(params, data);
			if (err) return Promise.reject(err);

			// efectuar la lectura
			return this.updateDo(params, data).then((data) => {
				// analisis post
				err = this.updatePost(data, params);
				if (err) return Promise.reject(err);

				// Todo ok
				return data;
			});
		}

		updatePre() { }
		updatePost() { }

		/**
		 * Elimina un elemento de esta entidad del DAO
		 * @method DAOEntity#delete
		 * @param {object} params Parámetros para el DELETE
		 * @param {function} [callback] Función de finalización: callback(err, res)
		 * @returns {Promise} Promesa con lo parámetros del elemento borrado
		 * @fires DAOEntity#delete
		 * @example
		 * dao.user.delete({ id: 9 }, (err, res) => { ... }); // elimina el user con id 9
		 * dao.user.delete(88).then(() => { ... }); // elimina el user con id 88
		 */
		delete(params, callback) {
			// callback
			if (callback) return this.delete(params).then((res) => { return callback(null, res); }, (err) => { callback(err, null); });

			// analisis previos
			var err = this.deletePre(params);
			if (err) return Promise.reject(err);

			// efectuar la eliminación
			return this.deleteDo(params).then((data) => {
				// analisis post
				err = this.deletePost(data, params);
				if (err) return Promise.reject(err);

				// Todo ok
				return data;
			});

		}

		deletePre() { }
		deletePost() { }

		/**
		 * Carga o recupera datos estáticos (colecciones que no cambian durante la ejecución).<br />
		 * Evita tener que realizar consultas asincronas (con read).
		 * @param {String|Boolean} [field] undefined|false: recupera datos almacenados como array, true: carga datos, string: retorna un objeto que indexa el array por ese campo
		 * @returns {array|Object} Datos de la collección
		 * @example
		 * // Cargar o recargar datos standard
		 * dao.standard.staticData(true);
		 * 
		 * // Recuperar datos de standard (array)
		 * var st = dao.standard.staticData();
		 * 
		 * // Obtener los datos indexado por "name" (objeto)
		 * var st = dao.standard.staticData("name");
		 */
		staticData(field) {
			if (!field) return this._staticData.data; // obtener el array

			if (field === true) { // cargar los datos del servidor
				console.log("Loading static data...", this.schema.name);
				return this.read({}, "*").then(
					(dt) => {
						this._staticData.data.splice(0, this._staticData.data.length); // vaciar datos
						this._staticData.index = {}; // vaciar los indexados
						this._staticData.data.push(...dt); // cargar datos
						console.log("Loaded static data", this.schema.name, dt);
						return this._staticData.data;
					}, () => {
						alert("Error loading static data: " + this.schema.name);
						return Promise.reject("Error loading static data: " + this.schema.name);
					}
				);
			}

			if (!this._staticData.index[field]) { // aun no se ha indexado por ese campo
				this._staticData.index[field] = {};
				this._staticData.data.forEach((v, i) => { this._staticData.index[field][v[field]] = v; });
			}

			return this._staticData.index[field];
		}

		/**
		 * Crea un elemento de tipo [Item]{@link DAOItem}
		 * @param {Object|number} data Datos de un item nuevo (si no hay options) o parámetros de un item existente (si hay options)
		 * @param {*} [options] Opciones. Si se indica, se realiza un load(options) sobre el item.
		 * @param {function} callback Función callback para cuando el item está cargado (tiene dcata)
		 * @returns {DAOItem} Item creado
		 * @example
		 * dao.book.item({ name: "New Book" }); // libro nuevo (pendiente de guardar)
		 * dao.book.item({ id: 7 }, "*"); // carga el libro  7
		 * dao.book.item(4, "."); // carga el libro  4
		 */
		item(data, options, callback) {
			var item = new DAOElement.DAOItem(this);
			if (isFinite(data)) data = { id: data };
			item.data = data;
			if (!callback) callback = () => { };
			if (options) {
				item.set(data);
				item.load(options).then(() => { callback(item.data); });
			} else {
				setTimeout(() => callback(data), 0);
			}
			//item.link(true);
			this.emit("item", item);
			this.dao.emit("item", item);
			return item;
		}

		/**
		 * Crea un elemento de tipo [List]{@link DAOList}
		 * @param {*} params Parámetros de la lista
		 * @param {*} [options] Opciones o datos de una nueva lista
		 * @param {function} callback Función callback para cuando la lista está cargada (tiene data)
		 * @return {DAOList} Lista creada
		 * @example
		 * dao.book.list(); // crea una lista de libros vacia
		 * dao.book.list("*"); // carga la lista de libros
		 * dao.chapter.list({ book: 9 }); // crea una lista de capitulos del libro 7 vacia
		 * dao.chapter.list({ book: 2 }, [...]); // crea una lista para el libro 7
		 * dao.chapter.list({ book: 7 }, "*"); // carga una lista de capitulos del libro 7
		 */
		list(params, options, callback) {
			if (!arguments.length) params = {};
			if (arguments.length === 1 && (typeof params === "string" || Array.isArray(params))) {
				callback = options;
				options = params;
				params = {};
			}
			var list = new DAOElement.DAOList(this, params);
			if (!callback) callback = () => { };
			if (options) {
				if (Array.isArray(options)) {
					list.data = options;
					callback(list.data)
				} else {
					list.data = [];
					list.load(options).then((data) => { callback(data); });
				}
			}
			//list.link(true);
			this.emit("list", list);
			this.dao.emit("list", list);
			return list;
		}
	}

	// Exportar
	(isNode ? exports : window).DAOEntity = DAOEntity;

})(typeof module !== 'undefined' && module.exports);