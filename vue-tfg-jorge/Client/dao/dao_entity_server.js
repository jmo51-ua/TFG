"use strict";

const fs = require("fs");
const path = require("path");
const bCrypt = require("bcryptjs");
const jimp = require('jimp');

const DAOEntity = require("./dao_entity").DAOEntity;

/**
 * Entidad del DAO en el servidor.<br />
 * Hereda de {@link DAOEntity}.<br />
 * Funciona de la misma forma que el DAO en el cliente ({@link DAOEntityClient}).<br />
 * Para el CRUD utiliza {@link Database}.
 * @extends DAOEntity
 * @example
 * var user = new DAOEntityServer(dao, userSchema, db, config); // entidad 'user'
 * user.read((users => { ... }); // lista usuarios
 * user.create({ name: "Jonh" }); // crea un usuario
 * user.on("create", (newUser) => { ... }); // detecta usuarios creados
 */
class DAOEntityServer extends DAOEntity {
	/**
	 * Crea una entidad del DAO
	 * @param {DAOServer} dao Referencia al DAO
	 * @param {EntitySchema} schema Definición de la entidad (esquema)
	 * @param {Database} db Referencia a la base de datos
	 * @param {Object} config Configuración del DAO
	 * @param {string} config.blobs Ruta (directorio) donde se almacenan los blobs
	 */
	constructor(dao, schema, db, config) {
		super(dao, schema); // herencia de DAOEntity

		/**
		 * Acceso a la base de datos ({@link Database})
		 * @type {Database}
		 */
		this.db = db;

		/**
		 * Acceso a la configuracion
		 * @type {Object}
		 */
		this.config = config;
	}

	// Realiza un debug del objeto
	debug(args, method, ...data) {
		if (typeof args === "string") return this.debug([], args, method, ...data);
		if (!Array.isArray(args)) args = [args];
		console.log("dao." + this.schema.name + "." + method + "(", ...args, ")", ...data);
		return this;
	}

	// Invocado por DAOEntity.read(). Realiza la lectura de la base de datos
	readDo(params, options) {

		// Es un item? 
		var isItem = false;
		if (this.schema.paramsItem) {
			isItem = true;
			for (let i = 0; i < this.schema.paramsItem.length; i++) {
				if (params[this.schema.paramsItem[i]] === undefined) { // no se ha encontrado un campo
					isItem = false;
					break;
				}
			}
		}

		this.debug([params, options], "read", "Is item:", isItem);

		// obtiene datos de un esquema, en función de unos parámetros y unas opciones
		var read = (schema, params, options, callback) => {
			this.debug("read", ">>>", schema.name, "params:", params, "options:", options);

			var fields = {} // Campos de la SELECT
			var where = {}; // WHERE de la SELECT
			var imgs = []; // campos image
			var fieldsAll = options.fields.indexOf("*") >= 0; // todos los campos
			var fieldsDef = options.fields.indexOf(".") >= 0; // campos por defecto
			var lang = options.lang || "en";
			var order = [];

			// Obtener los campos de la SELECT, el WHERE y el ORDER
			for (let f in schema.properties) { // recorrer las propiedades
				let p = schema.properties[f];

				// Listar propiedades indicadas en options.fields (ignora los binarios)
				//  - ["."] (defecto) -> Campos basicos
				//  - ["*"] -> Todos los campos que se pueden obtener
				//  - ["a", "c", "d", "e"] -> Campos concretos
				if (p.read && (options.fields.indexOf(f) >= 0 || ((fieldsAll || fieldsDef) && p.type !== "image" && p.type !== "password"))) {
					if (p.type === "image") { imgs.push(f); continue; } // anotar campo json
					fields[f] = p.fullField;
				}

				if (params[f] !== undefined) { // Los parametros se indican en el WHERE de la SELECT
					where[p.fullField] = params[f];
				} else if (options.filter && options.filter[f] !== undefined) { // Los filtros tambien se indican en el WHERE
					where[p.fullField] = options.filter[f];
				}

				if (p.value !== undefined) { // valores fijos en el schema o FK
					where["." + p.fullField] = p.value;
				}

				if (p.order) {
					order[Math.abs(p.order) - 1] = (p.order < 0 ? "-" : "") + p.fullField;
				}
			}

			if (options.order) {
				order = options.order.map((o) => {
					var prefix = "";
					if (o.substr(0, 1) === "-") {
						prefix = "-";
						o = o.substr(1);
					}
					if (!schema.properties[o]) {
						console.warn("No se puede ordenar por un campo:", o);
						return;
					}
					return prefix + schema.properties[o].fullField;
				});
			}

			// Realiar la select
			this.db.select(schema.table, fields, where, order, { limit: schema.limit, distinct: schema.distinct }, (err, result) => {
				if (err) {
					console.error("Error", err);
					return callback({ code: "ERR_DATABASE", text: "Error on getting data" }, null);
				}

				// Procesar los datos
				var iRow = 0; // iterador de fila
				var processRow = () => { // procesar cada fila
					if (iRow >= result.length) { // fin, todas las filas procesadas
						this.debug("read", "<<<", schema.name, result);
						callback(null, result); // fin
						return;
					}
					// Procesar siguiente fila
					var row = result[iRow++];

					// Procesar campos por tipo
					for (let f in fields) {
						if (row[f] === null) continue; // un null no se procesa
						let p = schema.properties[f];

						// JSON
						switch (p.type) {
							case "json":
							case "object":
							case "i18n":
								if (p.type == "object" || p.type == "i18n") {
									if (row[f].trim().substr(0, 1) !== "{") {
										console.warn("Error en el campo '" + f + "' al no ser un objeto:", row[f]);
										row[f] = null;
										continue;
									}
								}
								try {
									row[f] = JSON.parse(row[f]);
								} catch (err) {
									console.warn("Error analizando campo '" + f + "' en formato JSON:", row[f]);
									row[f] = null;
									continue;
								}
								if (p.type == "i18n") {
									if (row[f][lang] !== undefined) {
										row[f] = row[f][lang]
									} else if (row[f].en !== undefined) {
										row[f] = row[f].en
									} else {
										let first = Object.keys(row[f])[0];
										if (!first) {
											console.warn("Error en campo i18n. No se detecta idioma", f, row[f]);
											row[f] = null;
											continue;
										}
										row[f] = row[f][first];
									}
								}
								break;

							case "boolean":
								row[f] = row[f] ? true : false;
								break;
						}
					}

					// Procesar imágenes
					var iImg = 0; // iterador imagen
					var processImg = () => {
						if (iImg >= imgs.length) return processRow(); // No hay más img, ir al siguiente row
						this.imageGet(row, imgs[iImg], options, "url", (err, img) => {
							row[imgs[iImg]] = err ? null : img;
							iImg++;
							processImg();
						});
					};

					// Procesar los sub
					var iSub = 0; // iterador de sub
					var subs = Object.keys(schema.lists);
					var processSub = () => {
						if (iSub >= subs.length) return processImg(); // no hay mas sub, ir a imágenes
						var subName = subs[iSub++]; // obtener el siguiente sub
						var sub = schema.lists[subName];
						if (!fieldsAll && options.fields.indexOf(subName) < 0) return processSub();
						this.debug("read", "Procesar SUB:", iSub, subName, "Tipo:", sub.type, "SupParams:", sub.params);
						var subParams = {}; // crear los parámetros
						for (let p in sub.params) subParams[p] = row[sub.params[p]];
						read(this.dao[sub.type].schema, subParams, { order: null, fields: [options.fields[0] === "*" ? "*" : "."] }, (err, resSub) => { // obtener la sub lista
							row[subName] = resSub;
							processSub(); // siguiente sub
						});
					};
					processSub(); // primer sub
				}
				processRow(); // primer row
			});
		}

		return new Promise((resolve, reject) => {
			if (!this.schema.table || !this.schema.table.length) return resolve(isItem ? {} : []);

			read(this.schema, params, options, (err, res) => {
				if (!err && isItem) { // si es un item me quedo con la única fila
					if (res.length == 0) {
						err = { code: "ERR_NOTFOUND", text: "Item not found" };
						res = null;
					} else if (res.length > 1) {
						err = { code: "ERR_MULTIPLEITEM", text: "Multiple item result" };
						console.info("-------------", res)
						res = null;
					} else {
						res = res[0];
					}
				}
				this.debug([params, options], "read:", err ? "ERR" : res);
				err ? reject(err) : resolve(res);
			});
		});
	}

	createDo(data) {
		return new Promise((resolve, reject) => {
			write.call(this, null, data, (err, res) => {
				console.info(this.schema.name + ".create:", data, "=>", err ? "ERR" : res);
				if (!err) this.emit("create", res)
				err ? reject(err) : resolve(res);
			});
		})
	}

	updateDo(params, data, callback) {
		if (typeof params === "number") params = { id: params };

		return new Promise((resolve, reject) => {
			write.call(this, params, data, (err, res) => {
				console.info(this.schema.name + ".update:", params, data, "=>", err ? "ERR" : res);
				callback && callback(err, res);
				err ? reject(err) : resolve(res);
				if (!err) this.emit("update", res);
			});
		});
	}

	deleteDo(params) {
		this.debug([params], "delete");

		// Es un item?
		var isItem = true;
		var where = {};
		this.schema.paramsItem.forEach((p) => {
			if (params[p] === undefined) {
				isItem = false;
			} else {
				where[this.schema.properties[p].field] = params[p];
			}
		});
		if (!isItem) {
			this.debug([params], "delete", "Params de una lista, borrar cada item...");
			return this.read(params, { fields: this.schema.paramsItem }).then((list) => {
				var p = [];
				list.forEach((item) => { p.push(this.delete(item)); });
				return Promise.all(p).then(() => { this.debug([params], "delete", "Eliminada la lista:", p.length); });
			});
		}

		// es un item
		var p = [];
		for (let lName in this.schema.lists) {
			let lDef = this.schema.lists[lName];
			let lParams = {};
			for (let x in lDef.params) lParams[x] = params[lDef.params[x]];
			this.debug([params], "delete", "Eliminar sublista:", lDef.type, lParams);
			p.push(this.dao[lDef.type].delete(lParams));
		}
		return Promise.all(p).then(() => {
			this.debug([params], "delete", "Subs eliminados (" + p.length + "), ahora elimino el item");
			return new Promise((resolve, reject) => {
				this.db.delete(this.schema.table[0], where, (err, res) => { // eliminar de la BD. Usa solo la primera tabla
					if (!err) {
						// eliminar imagenes
						for (let f in this.schema.properties) {
							if (this.schema.properties[f].type == "image") {
								this.imageDelete(params, f);
							}
						}
						// eliminar directorio de blobs
						let f = this.imagePath(params);
						if (fs.existsSync(f)) fs.rmdirSync(f);
					}
					this.debug([params], "delete", "Item eliminado:", err ? "ERR" : res);
					err ? reject(err) : resolve(res);
					if (!err) this.emit("delete", params);
				});
			});
		});
	};

	/**
	 * Obtiene el path donde se almacena una imagen
	 * @param {Object} params Parámetros del registro
	 * @param {String} [field] Campo de la imagen
	 */
	imagePath(params, field) {
		var file = path.resolve(this.config.blobs, this.schema.name);
		this.schema.paramsItem.forEach((param) => { file = path.resolve(file, "" + params[param]); });
		if (field) file = path.resolve(file, field);
		return file;
	}

	/**
	 * Establece el contenido de una imagen
	 * @param {Object} data Datos del registro, incluyendo parametros del registro y la imagen
	 * @param {string} field Campo donde se almacena la imagen (puede ser null, lo cual elimina la imagen)
	 */
	imageSet(data, field) {
		this.debug("imageSet", field, data);
		this.imageDelete(data, field); // eliminar por si existia
		var file = this.config.blobs;
		var paths = [this.schema.name];
		this.schema.paramsItem.forEach((param) => { paths.push("" + data[param]) });
		paths.push(field);
		paths.forEach((p) => {
			file = path.resolve(file, p);
			if (!fs.existsSync(file)) {
				this.debug("imageSet", "Create dir:", file);
				fs.mkdirSync(file);
			}
		});
		if (!data[field]) return; // no hay datos, no crear

		var x = data[field].indexOf(",");
		var head = data[field].substr(0, x);
		head = /^data:(\w+)\/(\w+);(\w+)$/.exec(head);
		if (head) {
			file = path.resolve(file, "original." + head[2]);
			this.debug("imageSet", "Create Image:", file, head[3]);
			fs.writeFileSync(file, data[field].substr(x + 1), head[3]);
		} else {
			this.debug("imageSet", "La imagen no tiene formato URL data:", data[field]);
		}
	}

	/**
	 * Obtiene un campo de tipo imagen
	 * @param {Object} params Parámetros del elemento a leer
	 * @param {string} field Campo a consultar (definido en el esquema como de tipo 'image')
	 * @param {Object} options Opciones de la imagen
	 * @param {number} [options.width] Ancho de la imagen. Si no se indica o se indica 0 se autocalcula en función del alto
	 * @param {number} [options.height] Alto de la imagen. Si no se indica o se indica 0 se autocalcula en función del ancho
	 * @param {number} [options.fit="resize"] Tipo de ajuste: resize (puede deformar la imagen)  cover (cubre todo el ancho y alto, no deforma, puede recortar) contain (no deforma, puede incluir márgenes)
	 * @param {string} format Formato de salida: "file" | "buffer" | "url"
	 * @param {function} callback Callback con el resultado callback(err, buffer). Si hay error tambien crea una imagen vacia
	 */
	imageGet(params, field, options, format, callback) {
		var { width, height, fit } = options;

		var file = this.imagePath(params, field);
		var exts = ["png", "jpeg", "gif"];
		var ext = "";
		var fileR = file;
		file = path.resolve(file, "original" + ext);
		for (let e = 0; e < exts.length; e++) {
			if (fs.existsSync(file + "." + exts[e])) {
				ext = "." + exts[e];
				break;
			}
		}
		file += ext;
		if (!ext) {
			this.debug([params, field], "imageGet", "Image not found:", file);
			return callback("Image not found", null);
		}
		this.debug("imageGet", params, field, options, format, file);

		var out = (err, img) => { // emite la imagen
			if (err) return callback(err, img)
			img[format === "url" ? "getBase64" : "getBuffer"](jimp.MIME_PNG, callback);
		}

		if (width || height) {
			if (!width) {
				fileR = path.resolve(fileR, "height_" + height);
			} else if (!height) {
				fileR = path.resolve(fileR, "width_" + width);
			} else {
				if (!fit || (fit != "contain" && fit != "cover")) fit = "resize";
				fileR = path.resolve(fileR, fit + "_" + width + "_" + height);
			}
			fileR += ext;
			if (format === "file" && fs.existsSync(fileR)) return callback(null, fileR);
			jimp.read(fileR, (errR, img) => {
				if (errR) {
					this.debug("imageGet", "Imagen reescalada no encontrada. Reescalar y crear", fileR);
					jimp.read(file, (errO, img) => {
						if (errO) {
							console.wartn("Error readin image", file, errO);
							return callback("ERror reading image", null);
						}
						if (!width) width = parseInt(img.bitmap.width / img.bitmap.height * height);
						if (!height) height = parseInt(img.bitmap.height / img.bitmap.width * width);
						this.debug("imageGet", "Image resize:", width, height, "original", img.bitmap.width, img.bitmap.height, fit);
						if (fit == "cover") {
							img.cover(width, height);
						} else if (fit == "contain") {
							img.contain(width, height);
						} else {
							img.resize(width, height);
						}
						img.write(fileR, (errWrite) => {
							if (errWrite) console.warn("Error guardando imagen reescalada", fileR, errWrite);
							if (format == "file") {
								callback(null, fileR);
							} else {
								out(null, img);
							}
						});
					});
				} else { // ya existe una imagen reescalada
					this.debug("imageGet", "Imagen reescalada encontrada. Retornar", fileR);
					out(null, img);
				}
			});
		} else {
			if (format === "file") {
				callback(null, file);
			} else {
				jimp.read(file, out);
			}
		}
	}

	/**
	 * Elimina una imagen
	 * @param {Object} params Parámetros del registro
	 * @param {string} field Campo de la imagen
	 */
	imageDelete(params, field) {
		var p = this.imagePath(params, field); // path del directorio
		this.debug([params, field], "imageDelete", p);
		if (!fs.existsSync(p)) return; // no hay entrada para este campo
		fs.readdirSync(p).forEach((file) => { // eliminar todos os archivos del directorio (por si hay versiones reescaladas)
			file = path.resolve(p, file);
			this.debug([params, field], "imageDelete", "Eliminar archivo:", file);
			fs.unlinkSync(file);
			this.debug([params, field], "imageDelete", "Archivo eliminado:", file);
		});
		if (fs.readdirSync(p).length) { // en windows a veces tarda en borrar (aun siendo sync)
			setTimeout(() => {
				this.debug([params, field], "Me espero, y ahora en el directorio:", fs.readdirSync(p));
				fs.rmdirSync(p);
			}, 500);
		} else {
			fs.rmdirSync(p); // eliminar directorio
		}
	}
}

// Función de utilería que realiza una escritura
// Es usada por create (params === null) y update (params con datos)
function write(params, data, callback) {
	this.debug("write", this.schema.name, "Params:", params, "Data:", data);

	this.db.conn.beginTransaction((err) => { // iniciar transacción
		if (err) return callback("Transaction error", null);

		// Función de error que realiza un rollback en la transacción
		var error = (err) => {
			console.warn(err);
			this.db.conn.rollback(() => {
				callback(err, null);
			});
		}

		var resultData = {}; // datos del resultado estructurados por tablas
		var autoincrementalField = null, autoincrementalValue = null; // nombre y valor del campo ID
		// Recorrer las tablas
		var iTable = 0; // iterador de la tabla
		var imgs = []; // campos tipo 'image'

		var processTable = () => { // procesar siguiente tabla
			if (iTable >= this.schema.table.length) { // ya no quedan tablas
				this.db.conn.commit((err) => { // commit
					if (err) return error("Commit error");
					var result = {};
					if (params) Object.assign(result, params);
					if (autoincrementalField && autoincrementalValue !== null) result[autoincrementalField] = autoincrementalValue;
					Object.assign(result, data);

					// Images
					imgs.forEach((f) => {
						this.imageSet(result, f);
					});

					callback(null, result);
				});
				return;
			}

			var table = this.schema.table[iTable++]; // obtener tabla
			var dt = resultData[table] = {}; // Datos para esta tabla
			//var dt = {}; 
			var where = {}; // WHERE
			var autoincremental = null; // autoincremental field
			for (let f in this.schema.properties) { // recorrer las propiedades
				let p = this.schema.properties[f];
				if (p.table != table) continue; // no es una propiedad de este campo

				if (p.value) { // si tiene asignado un valor
					if (p.value.substr(0, 1) == "(") { // (SELECT ...)
						dt[p.field] = p.value;
					} else {
						if (/\w+\.\w+/.test(p.value)) { // es de tipo tabla.valor
							if (!params) { // ...para poner el valor
								let x = p.value.split(".");
								dt[p.field] = resultData["`" + x[0] + "`"]["`" + x[1] + "`"];
							} else { // ... para filtrar
								where[p.field] = params[autoincrementalField];
							}
						} else { // valor fijo
							dt[p.field] = JSON.parse(p.value);
						}
					}
				}

				// Campos obligatorios: No pueden ser null, y no se pueden omitir en las creaciones
				if (p.mandatory && (data[f] === null || (data[f] === undefined && !params))) return error("Field mandatory: " + f);

				// Campos no actualizables
				if (!p.write && data[f] !== undefined) return error("Field not updatable: " + f);

				if (data[f] !== undefined) { // hay dato
					if (data[f] === null) {
						dt[p.field] = null;
					} else {
						switch (p.type) {
							case "image":
								imgs.push(f);
								break;

							case "datetime":
								dt[p.field] = typeof data[f] === "string" ? new Date(data[f]) : data[f];
								break;

							case "i18n":
								dt[p.field] = JSON.stringify({ "default": data[f] });
								break;
							case "json":
							case "object":
								dt[p.field] = JSON.stringify(data[f]);
								break;

							case "password":
								function randomString(length, chars) {
									var result = '';
									for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
									return result;
								}
								if (!data[f]) data[f] = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
								// si no se indica password se crea uno aleatorio
								dt[p.field] = bCrypt.hashSync(data[f], 10);
								break;

							default:
								dt[p.field] = data[f];
						}
					}
				}

				if (params && params[f] !== undefined) { // parametro
					where[p.field] = params[f];
				}

				if (p.autoincremental) { // almacenar el nombre del campo ID para almacenar su valor en los INSERTS
					autoincremental = p.field;
					autoincrementalField = f;
				}
				if (params && autoincremental && p.param) { // es un update del ID con parametro: almacenar
					resultData[table][id] = params[p.param];
				}
			}

			if (!params) { // INSERT
				this.db.insert(table, dt, (err, res) => {
					if (err) return error("Insert error");
					if (autoincremental !== null) {
						resultData[table][autoincremental] = res.insertId; // almacenar id
						autoincrementalValue = res.insertId;
					}
					processTable(); // siguiente tabla
				});
			} else { // UPDATE
				if (Object.keys(dt).length) { // actualizar solo si hay campos modificados en esta tabla
					this.db.update(table, dt, where, (err, res) => {
						if (err) return error("Update error");
						processTable(); // siguiente tabla
					});
				} else { // no hay campos a actualizar
					this.debug("write", "No hay campos que actualizar");
					processTable(); // siguiente tabla
				}
			}
		};
		processTable(); // iniciar el procesado de tablas
	});
};

exports.DAOEntityServer = DAOEntityServer;
exports.daoServerEntity = function (...args) { return new DAOEntityServer(...args); };