(function (isNode) {
	'use strict';

	var Evented = (isNode ? require("./evented") : window).Evented;

    /**
	 * Elemento de una entidad del DAO  (lista o item).<br />
     * Clase que sirve de base para {@link DAOItem} y {@link DAOList}
	 * @extends Evented
	 */
	class DAOElement extends Evented {
        /**
         * Crea un nuevo elemento
	     * @param {DAOEntity} entity DAO entity
         */
		constructor(entity) {
			super();
			//console.log("Entity:", type, JSON.stringify(data), JSON.stringify(options));

			// Datos internos
			this.entity = entity; // entidad
			this.wsOns = null; // todos los on realizados por WS
		}
	}

	// Exportar
	(isNode ? exports : window).DAOElement = DAOElement;
})(typeof module !== 'undefined' && module.exports);