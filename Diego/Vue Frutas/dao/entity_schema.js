"use strict";

/**
 * Módulo para la gestión de los esquemas de entidades.<br />
 * El esquema de una entidad define los atributos de una entidad para la generación automática del DAO y de los servicios REST.<br />
 * @module entitySchema
 */
var entitySchema = exports;

/**
 * Esquema de una entidad. Atributos que definen como es una entidad para automatizar la creación del DAO y de los servicios REST.
 * @typedef {Object} EntitySchema
 * @global
 * @prop {string} name Nombre del esquema. Por este nombre se referencia a la entidad en el dao. Si no se indica y se carga el esquema de un archivo, se toma el nombre del archivo como nombre del esquema
 * @prop {string} title Título del esquema
 * @prop {string} description Descripción del esquema
 * @prop {string|string[]} [table] Tabla(s) a las que está asociada la entidad
 * @prop {integer} [limit=0] Establece un limite de registros en las SELECT
 * @prop {boolean} [distinct=false] Recupera de la SELECT sólo registros distintos 'SELECT DISTINCT'. 0 indica todos
 * @prop {string} [urlItem] URL para el acceso REST a un elemento (item)
 * @prop {string} [urlList] URL para el acceso REST a una lista (list)
 * @prop {boolean} [put] Indica si se puede hacer PUT sobre la entidad. Por defecto true si hay urlItem
 * @prop {boolean} [post] Indica si se puede hacer POST sobre la entidad. Por defecto true si hay urlList
 * @prop {boolean} [delete] Indica si se puede hacer DELETE sobre la entidad. Por defecto toma el valor de put
 * @prop {string} [extends] Extiende la entidad de otra (herencia). Al extender se copian las propiedades y listas de la clase extendida
 * @prop {Object} [properties] Objeto con las propiedades de la entidad. El valor de cada propiedad es de tipo {@link module:entitySchema~EntitySchemaProperty}
 * @prop {Object} [lists] Objeto con las listas de la entidad (sub entidades). El valor de cada lista es de tipo {@link module:entitySchema~EntitySchemaList}
 */

/**
 * Propiedad de un esquema. Atributos que definen como es cada propiedad del esquema.
 * @typedef {Object} EntitySchemaProperty
 * @prop {module:entitySchema.propertyType} [type="string"] Tipo del campo
 * @prop {string} [table] Tabla donde se almacena el campo. Si no se indica se usa la primera tabla del esquema
 * @prop {string} [field] Campo de la tabla. Si no se indica se usa el nombre de la propiedad el campo properties del esquema
 * @prop {boolean} [autoincremental=false] Campo autoincremental en la base de datos
 * @prop {boolean} [read=true] El campo puede ser leido
 * @prop {boolean} [write=true] El campo se puede modificar
 * @prop {boolean} [mandatory=false] Campo obligatorio. Al crear debe tener valor, al actualizar no puede ser quitado
 * @prop {integer} [order=0] Indica que en las selects se ordena por este campo (el valor es la posición). Un valor positivo es ascendente y uno negativo descendente. 0 indica que no se ordena por este campo
 * @prop {*} [value] Indica un valor para el campo. En las SELECTS será un valor fijo para el WHERE. En los INSERT/UPDATE un valor a establecer
 * @prop {Object} [link] Enlaza este campo con otro (table.field). Valido para cruzar 2 tablas en una SELECT o para pasar campos de una tabla a otra en un UPDATE
 * @prop {string} link.table Tabla a la que enlaza la propiedad
 * @prop {string} link.field Campo al que enlaza la propiedad
 */

/**
 * Lista de un esquema. Atributos que definen como es una lista (array de sub-entidad) de un esquema.
 * @typedef {Object} EntitySchemaList
 * @prop {string} type Nombre de otro tipo de entidad del DAO
 * @prop {Object} params Objeto con los parámetros de la lista (tantos como parámetros tenga la urlList)
 */

const fs = require("fs");

// Pasa una nombre a nombre SQl con las comillas '`'
function sqlName(name) {
	if (!name || typeof name !== "string") return name;
	if (name.substr(0, 1) !== "`") name = "`" + name + "`";
	return name;
}

// Obtiene los parámetros de una url (los parámetros empiezan por ':')
function params(url) {
	if (!url) return null;
	url = url.split("/");
	var params = [];
	url.forEach((x) => {
		if (x.substr(0, 1) == ":") params.push(x.substr(1));
	});
	return params;
}

/**
 * Completa un esquema con los atributos por defecto.<br />
 * También completa los atributos de las propiedades.<br />
 * Si la propiedad está definida con una cadena la interpreta para crear el objeto que define la propiedad.<br />
 * La cadena comienza opcionalmente con <code>table.field</code> (si no se indica se toma como tabla la primera tabla del esquema y como campo el nombre de la propiedad) y a contiunación los siguientes símbolos:<br />
 * <ul>
 * <li><code>#</code> &rarr; Indica que es un campo autoincremental</li>
 * <li><code>&lt;</code> &rarr; Campo de solo lectura</li>
 * <li><code>!</code> &rarr; Campo obligatorio</li>
 * <li><code>~</code> &rarr; Campo a ignorar (ni se lee ni se escribe)</li>
 * <li><code>@ type</code> &rarr; Tipo del campo (si no se indica es <code>string</code>)</li>
 * <li><code>% order</code> &rarr; Orden del campo</li>
 * <li><code>= value</code> &rarr; Campo asignado a un valor (puede ser otro campo de la BD tipo FK)</li>
 * </ul>
 * @param {Object} schema Esquema de entidad
 * @returns {module:entitySchema~EntitySchema} Esquema completado
 * @example
 * // Ejemplo de esquema para a entidad user:
 * {
 *   title: "User",
 *   properties: {
 *     id: "#", // campo autoincremental
 *     name: "@string !", // campo de tipo string obligatorio
 *     picture: "user.photo @image" // campo de tipo imagen almacenada en el campo photo de la tabla user
 *   },
 *   lists: {
 *     groups: { type: "userGroup", params: { user: "id" }} // obtiene un listado de userGroup donde user tiene el valor del id de usuario
 *   }
 *   table: "user"
 * }
 */
exports.entityComplete = function entityComplete(schema) {
	// table
	if (!schema.table) schema.table = [];
	if (!Array.isArray(schema.table)) schema.table = [schema.table];
	schema.table = schema.table.map(sqlName);

	// Opciones selects
	if (!schema.limit) schema.limit = 0;
	if (!schema.distinct) schema.distinct = false;

	// URLs
	if (schema.urlList === undefined) schema.urlList = null;
	if (schema.urlItem === undefined) schema.urlItem = null;
	schema.paramsList = params(schema.urlList);
	schema.paramsItem = params(schema.urlItem);

	// POST / PUT / DELETE
	if (schema.post === undefined) schema.post = schema.urlList ? true : false;
	if (schema.put === undefined) schema.put = schema.urlItem ? true : false;
	if (schema.delete === undefined) schema.delete = schema.put;

	// Propiedades de la entidad
	if (!schema.properties) schema.properties = {};
	for (let f in schema.properties) {
		let p = schema.properties[f];

		if (typeof p === "string") { // propiedad definida como string
			let data = p.split(/([#<!~@%&=])/);
			schema.properties[f] = p = {};
			if (data[0]) {
				data[0] = data[0].trim().split(".");
				p.table = data[0][0];
				p.field = data[0][1];
			}
			for (let i = 1; i < data.length; i += 2) {
				let x = data[i + 1].trim();
				switch (data[i]) {
					case "#": p.autoincremental = true; p.type = "integer"; p.write = false; break; // autoincremental
					case "<": p.write = false; break; // write
					case "!": p.mandatory = true; break; // mandatory
					case "~": p.read = false; break; // no read (internal)
					case "@": p.type = x; break; // type
					case "%": p.order = x; break; // order
					case "=": p.value = x; break; // value
				}
			}
		}

		if (!p.type) p.type = "string";

		// Metadatos por defecto de la propiedad
		if (p.autoincremental === undefined) p.autoincremental = false;
		if (p.read === undefined) p.read = true;
		if (p.write === undefined) p.write = !p.autoincremental;
		if (p.mandatory === undefined) p.mandatory = false;
		if (p.order === undefined) p.order = 0;
		if (!p.table) p.table = schema.table[0];
		if (!p.field) p.field = f;
		p.table = sqlName(p.table);
		p.field = sqlName(p.field);
		p.fullField = p.table + "." + p.field;
	}

	if (!schema.lists) schema.lists = {};

	return schema;
};

/**
 * Resuelve las extensiones (herencias) en un conjunto de esquemas.<br />
 * En el proceso de herencia el esquema hijo (que tiene una referencia al padre en el atributo extends) copia del padre: propiedades, listas y tablas
 * @param {Object} schemas Conjunto de esquemas indexados por name
 * @returns {Object} Esquemas extendidos
 */
exports.resolveExtends = function resolveExtends(schemas) {
	var ext = true;
	while (ext) { // realizar varias iteraciones resolviendo las herencias de menor a mayor nivel de herencia
		ext = false;
		for (let e in schemas) {
			let schema = schemas[e];
			if (!schema.extends) continue; // no hay herencia
			let parent = schemas[schema.extends];
			if (!parent) {
				console.error("Referenced schema not exists:", schema.extends);
				process.exit(1);
			}
			if (parent.extends) continue; // el padre no se ha resuelto aun (esperar a la siguiente iteración)

			// las propiedades del hijo se combinan con las del padre
			schema.properties = Object.assign({}, parent.properties, schema.properties);
			schema.lists = Object.assign({}, parent.lists, schema.lists);
			if (parent.table) schema.table.unshift(...parent.table); // icluir las tablas del padre delante de las del hijo
			if (schema.auth === undefined && parent.auth !== undefined) schema.auth = parent.auth;
			delete schema.extends; // anotar que ya ha sido extendido quitandole extend
			ext = true; // se ha resuelto al menos una más, seguir en otra iteración
		}
	}
	return schemas;
};

/**
 * Carga un esquema de un archivo. Después de cargalo completa los esquemas.
 * @param {string} file Nombre del archivo
 * @returns {EntitySchema} Esquema leido y autocompletado
 */
exports.loadFile = function loadFile(file) {
	var schema = (fs.readFileSync(file)); // contenido del fichero
	if (!schema) {
		console.error("Schema not found in '" + file + "'.");
		return null;
	}
	try {
		schema = JSON.parse(schema);
	} catch (err) {
		console.error("Error analizando el esquema:", file);
		return null;
	}
	return entitySchema.entityComplete(schema); // completar los datos de la entidad
}

/**
 * Carga un conjunto de esquemas de un directorio (formato JSON). Después de cargarlos resuelve las extensiones.
 * @param {string} directory Ruta del directorio donde se encuentran los archivos
 * @returns {Object} Conjunto de esquemas indexados por name
 */
exports.loadDirectory = function loadDirectory(directory) {
	var schemas = {}, n = 0, numErrors = 0;
	fs.readdirSync(directory).forEach((file) => { // recorrer los fichero del directorio con los esquemas
		if (file.substr(file.length - 5).toUpperCase() !== ".JSON") return; // solo ficheros con extensión JSON
		var name = file.substr(0, file.length - 5); // nombre sin extension
		var schema = entitySchema.loadFile(directory + "/" + file);
		if (!schema) { 
			numErrors++;
			return null;
		}
		if (schema.name === undefined) schema.name = name; // nombre de la entidad
		schemas[name] = schema; // almacenar
		n++;
	});
	if (numErrors) return null;
	console.info("Loaded " + n + " schemas from '" + directory + "'.");
	return entitySchema.resolveExtends(schemas); // resolver las extensiones (herencias entre entidades)
};

/**
 * @enum {string}
 * @readonly
 */
exports.propertyType = {
	/** Número */
	number: "number",
	/** Número entero (number) */
	integer: "integer",
	/** Fecha/Hora */
	datetime: "datetime",
	/** Cadena de texto */
	string: "string",
	/** Email (string) */
	email: "email",
	/** Password (string). Contraseña cifrada */
	password: "password",
	/** Binario. Las propiedades de este tipo no se almacenan en base de datos, se guardan en archivos */
	blob: "blob",
	/** Imagen (blob). Se trata como binario pero se pueden reescalar */
	image: "image",
	/** JSON. Las propiedades de este tipo se almacenan en la base de datos como texto en JSON. Puede ser un null, boleano, un número, cadena, objeto o array */
	json: "json",
	/** Object (json). Las propiedades de este tipo se almacenan en la base de datos como texto en JSON */
	object: "object",
	/** Texto internacional (object). Las propiedades de este tipo se almacenan como un objeto JSON con el formato <code>{"en":"...", "es":"...",...}</code> */
	i18n: "i18n"
};