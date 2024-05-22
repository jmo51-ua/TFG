"use strict";

const mysql = require("mysql");
const Evented = require("./evented").Evented;

/**
 * Clase para el acceso a base de datos (mysql)<br />
 * Implemente primitivas de acceso a la BD:
 * <ul>
 * <li>[connect()]{@link Database#connect}: Conectar a la BD.</li>
 * <li>[close()]{@link Database#close}: Cerrar la conexión.</li>
 * <li>[query()]{@link Database#query}: Ejecuta una sentencia SQL.</li>
 * <li>[select()]{@link Database#select}: Ejecuta una sentencia SELECT.</li>
 * <li>[insert()]{@link Database#insert}: Ejecuta una sentencia INSERT.</li>
 * <li>[update()]{@link Database#update}: Ejecuta una sentencia UPDATE.</li>
 * <li>[delete()]{@link Database#delete}: Ejecuta una sentencia DELETE.</li>
 * </ul>
 * @extends Evented
 */
class Database extends Evented {
    /**
     * Crea una base de datos
     */
    constructor(cfg, callback) {
        super();
        this.conn = null;
        if (cfg) this.connect(cfg, callback);
    }

    /**
     * Conecta con la base de datos. Si se pierde la conexión se reconecta.
     * @param {object} cfg Configuración de la BD: objeto connection y reconnectionTimeout
     * @param {function} [callback] Función callback(err). Se invoca en la primera conexión / error
	 * @emits Database#connected
	 * @emits Database#error
	 * @example
	 * db.connect(cfg, (err) => {});
	 * db.on("connected", () => {});
	 * db.on("error", (err) => {});
     */
    connect(cfg, callback) {
        if (!cfg) {
            console.warn("Missing database configuration");
            return;
        }
        if (callback) console.info("Conecting to database 'mysql://" + cfg.connection.host + ":" + cfg.connection.port + "/" + cfg.connection.database + ";user=" + cfg.connection.user + "'...");
        var conn = mysql.createConnection(cfg.connection);
        conn.connect((err) => {
            if (err) {
                console.warn('Error when connect to db:', err);
                // Intentar reconectar pasado un tiempo
                if (this.conn) setTimeout(() => { this.connect(cfg); }, cfg.reconnectionTimeout);
                callback && callback(err);
                return;
            }
            console.info("Database connected.");

            conn.on('error', (err) => {
                console.warn('DB connection error detected. Reconecting...', err);
                conn.end();
                this.emit("error", err);
                // Reconectar.
                return this.connect(cfg);
            });
            this.conn = conn;
            callback && callback(null);
            this.emit("connected");
        });
    };

    close(callback) {
        console.info("Database closed");
        this.conn.end(callback);
        this.conn = null;
    }

	/**
	 * Se lanza cuando se conecta a la BD o ser reconecta por un error
	 * @event Database#connected
	 */

	/**
	 * Se lanza cuando se produce un error en la BD
	 * @event Database#error
	 */

    /**
     * Ejecuta una query
     * @param {string} sql SQL a ejecutar
     * @param {object} values Valores de la SQL
     * @param {function} callback Función callback
	 * @example
	 * db.query("SELECT * FROM users WHERE id = ?", { id: 7 }, (err, result) => {});
     */
    query(sql, values, callback) {
        console.log("Query >>>", sql, "Values:", values);
        this.conn.query(sql, values, function (error, result) {
            if (error) {
                console.warn("Query Error:", error);
                return callback(error, null);
            }
            console.log("Query <<<", result);
            callback && callback(null, result);
        });
        return this;
    };

    /**
     * Crea y ejecuta una sentencia SQL SELECT
     * @param {string|string[]} tables Tabla(s) para la SELECT
     * @param {Object} fields Campos a recuperar. Objeto donde la propiedad es el campo a retornar (AS) y el valor el campos de la BD
     * @param {Object} where Condiciones para el WHERE. Si el nombre empieza por ".", es un valor que no hay que escapar
     * @param {string[]} order Campos para el ORDER BY. Si el campo va precedido por un "-" se ordena descendientemente
	 * @param {Object} options Opciones para la select
	 * @param {integer} options.limit Limite de registros
	 * @param {boolean} options.distinct Solo registros distintos (SELECT DISTINCT)
     * @param {function} callback Funcion callback a ejecutar: callback(err, result)
	 * @example
	 * db.select(
     *   "user", // table
     *   { id: "user.id", name: "user.name" }, // fields
     *   { id: 7 }, // where
     *   [ "-name" ], // order
     *   (err, result) => {} // callback
     * );
     */
    select(tables, fields, where, order, options, callback) {
        console.log("SELECT:", tables, fields, where, order, options);
        if (!options) options = {};
        if (typeof tables === "string") tables = [tables];
        var flds = []; // campos de la select
        for (let f in fields) {
            flds.push(fields[f] + " AS `" + f + '`');
        }
        var sql = "SELECT " + (options.distinct ? "DISTINCT " : "") + flds.join(", ") + " FROM " + tables.join(", ");
        var values = []; // valores para la sentencia
        var fwhere = []; // campos del where
        for (let f in where) {
            let v = where[f];

            // Si el nombre empieza por '.'  el valor es una cadena que no hay que escapar
            if (f.substr(0, 1) == ".") {
                f = f.substr(1);
                if (v === "null") {
                    fwhere.push(f + " IS NULL");
                } else {
                    fwhere.push(f + " = " + v);
                }
                continue;
            }

            // null
            if (v === null) {
                fwhere.push(f + " IS NULL");
                continue;
            }

            // Valor a escapar
            fwhere.push(f + " = ?");
            values.push(where[f]);
        }
        if (fwhere.length) sql += " WHERE " + fwhere.join(" AND ");

        if (Array.isArray(order)) order = order.map((o) => o.substr(0, 1) === "-" ? o.substr(1) + " DESC" : o + " ASC").join(", ");
        if (order) sql += " ORDER BY " + order;

        if (options.limit) sql += " LIMIT " + options.limit;

        return this.query(sql, values, callback);
    };

    /**
     * Crea y ejecuta una sentencia SQL INSERT
     * @param {string} table Tabla para el INSERT
     * @param {object} data Datos a insertar
     * @param {function} callback Funcion callback a ejecutar: callback(err, result)
	 * @example
	 * db.insert("user", {name: "Peter"}, callback(err, result) => {});
     */
    insert(table, data, callback) {
        console.log("INSERT:", table, data);
        var fields = [];
        var values = [];
        for (let f in data) {
            fields.push(f);
            values.push(data[f] && typeof data[f] === "object" && !(data[f] instanceof Date) ? JSON.stringify(data[f]) : data[f]);
        }
        var sql = "INSERT INTO " + table + " (" + fields.join(", ") + ") VALUES (" + fields.map(() => "?").join(", ") + ")";

        return this.query(sql, values, callback);
    }

    /**
     * Crea y ejecuta una sentencia SQL UPDATE
     * @param {string} table Tabla para la actualizacion
     * @param {object} data Datos a actualizar
     * @param {object} where Condiciones para el where
     * @param {function} callback Funcion callback a ejecutar: callback(err, result)
     * @example
	 * db.update("user", { id: 12 }, { name: "new name" }, (err, result) => {});
     */
    update(table, data, where, callback) {
        console.log("UPDATE:", table, data, where);
        var values = []; // valores para la sentencia
        var fields = []; // campos a actualizar
        for (let f in data) {
            fields.push(f);
            values.push(data[f] && typeof data[f] === "object" && !(data[f] instanceof Date) ? JSON.stringify(data[f]) : data[f]);
        }
        var fwhere = []; // campos del where
        for (let f in where) {
            fwhere.push(f);
            values.push(where[f]);
        }
        var sql = "UPDATE " + table + " SET " + fields.join(" = ?, ") + " = ?";
        if (fwhere.length) sql += " WHERE " + fwhere.join(" = ? AND ") + " = ?";

        return this.query(sql, values, callback);
    }

    /**
     * Crea y ejecuta una sentencia SQL DELETE
     * @param {string} table Tabla para el DELETE
     * @param {object} where Condiciones para el where
     * @param {function} callback Funcion callback a ejecutar: callback(err, result)
     * @example
	 * db.delete("user", { id: 4 }, (err, result) => {})
     */
    delete(table, where, callback) {
        console.log("DELETE:", table, where);
        var values = []; // valores para la sentencia
        var fwhere = []; // campos del where
        for (let f in where) {
            fwhere.push(f);
            values.push(where[f]);
        }
        var sql = "DELETE FROM " + table;
        if (fwhere.length) sql += " WHERE " + fwhere.join(" = ? AND ") + " = ?";

        return this.query(sql, values, callback);
    }
}

exports.Database = Database;
exports.database = function (...args) { return new Database(...args); };