/* Funciones de utilidad */

(function (isNode) {
	"use strict";

	var utils = {};

	utils.extend = function (dst, ...srcs) {
		srcs.forEach(function (src) {
			for (let f in src) dst[f] = src[f];
		});
		return dst;
	};

	utils.each = function (obj, callback) { // callback(field, data)
		for (let f in obj) {
			callback(f, obj[f]);
		}
	};

	utils.collectionFind = function (arr, field, value) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i][field] === value) return arr[i];
		}
		return null;
	};

	utils.inherits = function (cls, parent) { // hereda una clase de otra
		for (let p in parent.prototype) { // copiar las propiedades de prototype
			cls.prototype[p] = parent.prototype[p];
		}
	};

	utils.equals = function (a, b) { // compara 2 objetos
		if (a === b) return true;
		if (typeof a !== typeof b) return false;

		if (a instanceof Date && b instanceof Date) return a.valueOf() == b.valueOf();

		if (!utils.isObject(a)) return false;
		if (!utils.isObject(b)) return false;

		for (let f in a) {
			if (b[f] === undefined) return false;
			if (!utils.equals(a[f], b[f])) return false;
		}
		for (let f in b) {
			if (a[f] === undefined) return false;
		}

		return true;
	}

	utils.isObject = function (obj) { // indica si el argumento es un objeto
		return obj !== null && typeof obj === "object";
	}

	utils.copy = function (src) {
		if (src instanceof Date) return new Date(src.valueOf());
		if (!utils.isObject(src)) return src;
		var dst = Array.isArray(dst) ? [] : {};
		for (let f in src) {
			dst[f] = utils.copy(src[f]);
		}
		return dst;
	}

	if (isNode) {
		module.exports = utils;
	} else {
		window.utils = utils;
	}
})(typeof module !== 'undefined' && module.exports);