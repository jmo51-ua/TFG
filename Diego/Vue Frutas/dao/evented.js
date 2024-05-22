
(function (isNode) {
	'use strict';

    /**
     * Clase base (otras clases heredarán de ella) para la gestión de eventos.<br />
     * Permite establecer filtros a la hora de subscribirse a un evento.<br />
     * Es compatible con NodeJS y Browser.</br>
     * @example
     * obj.on("nombre_evento", function (datos) {}); // Establece un manejador de eventos
     * obj.off("nombre_evento", function (datos) {}); // Elimina un manejador de eventos
     * obj.once("nombre_evento", function (datos) {}); // Establece un manejador de eventos para una sola vez
     * obj.emit("nombre_evento", datos); // Emite un evento
     */
	class Evented {
		constructor() {
			Object.defineProperties(this, {
				_eventedId: { value: 0, writable: true }, // id del siguiente evento
				_eventedListeners: { value: {}, writable: true } // listeners
			});
		}

		/**
		 * Emite un evento
		 * @param {string|number} names Nombre(s) de evento(s) a emitir. Si es un número emite la subscripción con ese id (ignora filtros)
		 * @param {...*} data Datos a enviar
		 * @example
		 * obj.emit("created", { id: 8 }); // emit event "created"
		 * obj.emit("click dblclick", arg1, arg2); // emit events "click" & "dblclick" with two arguments
		 */
		emit(names, ...data) {
			//console.log("emit:", names, ...data);
			if (typeof names === "number") {
				for (let name in this._eventedListeners) {
					if (this._eventedListeners[name][names]) this._eventedListeners[name][names].callback.apply(this, data);
				}
				return this;
			}
			names = names.trim().split(/\s+/g); // separar los nombres "a b c" -> ["a", "b", "c"]
			names.push("*"); // añadir "*"
			names.forEach((name) => { // recorrer todos los nombres
				if (!this._eventedListeners[name]) return; // para este nombre no hay listeners
				for (let l in this._eventedListeners[name]) { // recorrer listeners del nombre
					let listener = this._eventedListeners[name][l];
					if (listener.filter) {
						let diff = false;
						for (let f in listener.filter) {
							if (listener.filter[f] !== data[0][f]) { diff = true; break; }; // no cumple un filtro
						}
						if (diff) continue; // no cumple los filtros
					}
					// Cumple todo el filtro, emitir!
					//console.log("callback:", name, listener.id, listener.filter, data);
					listener.callback.apply(this, data);
				}
			});

			return this;
		};

		/**
		 * Realiza la subscripción a un evento
		 * @param {string} names Nombre(s) de evento(s) a subscribir. Puede ser "*" para subscribirse a todos los eventos
		 * @param {Object} [filter] Filtro de evento. Si se indica se filtra por el dato de la emisión
		 * @param {function} callback Función callback
		 * @returns {number} Id del callback. Con ese id se puede realizar un off
		 * @example
		 * obj.on("myEvent", function (data) {...});
		 * obj.on("myEvent", { id: 7}, function (data) {}); // solo se invoca si en data hay un campo id == 7
		 */
		on(names, filter, callback) {
			if (typeof filter === "function") { // no hay filtro
				callback = filter;
				filter = null;
			}
			var id = ++this._eventedId;
			if (filter === true) filter = { id };
			names.trim().split(/\s+/g).forEach((name) => {
				if (!this._eventedListeners[name]) this._eventedListeners[name] = {};
				this._eventedListeners[name][id] = { id, filter, callback };
				// console.log("on", name, id, filter);
			});

			return id;
		};

		/**
		 * Elimina una subscripción a un evento
		 * @param {string|array|number} [names] Nombre(s) de evento(s). Si es un número indica el id de la subscripción a eliminar.
		 * @param {Object} [filter] Filtros de evento
		 * @param {function} [callback] Funcion callback
		 * @example
		 * obj.off(); // elimina todas las subscripciones
		 * obj.off(7); // elimina la subscripcion con id 7 (valor retornado por 'on')
		 * obj.off([2, 4]); // elimina la subscripción con ids 2 y 4
		 * obj.off("myEvent"); // elimina todas las subscripciones a 'myEvent'
		 * obj.off("myEvent", callback); // elimina todas las subscripciones a 'myEvent' con el callback indicado
		 * obj.off("myEvent", { id: 7 }, callback); // elimina todas las subscripciónes de ese evento, con ese filtro y ese callback
		 */
		off(names, filter, callback) {
			// console.log("OFF", names, filter);
			if (names === undefined) { // borrar todos
				this._eventedListeners = {};
				console.warn("Borrar todos los listeners de un objeto (off)", this);
				return this;
			}
			if (Array.isArray(names)) { // es un array
				names.forEach((x) => {
					if (!x) return console.warn("Intento de borrar un hueco en un array de ids para off", this); // hueco en el array
					this.off(x, filter, callback);
				});
				return this;
			}
			if (typeof names === "number") { // es un id
				for (let n in this._eventedListeners) {
					if (this._eventedListeners[n][names]) delete this._eventedListeners[n][names]
					// console.log("off", n, names)
				}
				return this;
			}
			if (typeof filter === "function") {
				callback = filter;
				filter = null;
			}
			names.trim().split(/\s+/g).forEach((name) => {
				if (!this._eventedListeners[name]) return this;
				for (let l in this._eventedListeners[name]) { // recorrer los listener de cada evento
					let listener = this._eventedListeners[name][l];
					if (callback && callback !== listener.callback) return; // no coincide el callback
					if (filter) {
						if (!listener.filter) return; // no hay filtro
						for (let f in filter) {
							if (filter[f] !== listener.filter[f]) return; // No coindice un campo del filtro
						}
					}
					// coincide, eliminar
					delete this._eventedListeners[name][l]
					// console.log("off", name, listener.id, listener.filter)
				};
			});

			return this;
		};

		/**
		 * Realiza una subscripción a un evento para una única ejecución (on + off)
		 * @param {string} names Nombre(s) de evento(s) a subscribir. Puede ser "*" para subscribirse a todos los eventos
		 * @param {Object} [filter] Filtros
		 * @param {function} callback Función callback
		 */
		once(names, filter, callback) {
			if (typeof filter === "function") {
				callback = filter;
				filter = null;
			}
			// console.log("once:", names, filter);
			var id = this.on(names, filter, (...args) => {
				callback.apply(this, args);
				this.off(id);
			});

			return this;
		}
	}

	// Publicación de la clase
	(isNode ? exports : window).Evented = Evented;

})(typeof module !== 'undefined' && module.exports);