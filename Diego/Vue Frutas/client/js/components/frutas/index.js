export default {
    data: function () {
        return {
            nombreFruta: "",
            frutas: [],
        }
    },

    methods: {
        cargar() {
            this.$root.dao.fruta.read({ tipo: 7 }).then(frutas=> { // lee un conjunto (array) de entidades (se puede filtrar)
                this.frutas = frutas;
            }, function (error) { });
        },

        anyadir() {
            this.$root.dao.fruta.create({ nombre: this.nombreFruta, precio: 0 }).then(nuevaFruta => { // crea una entidad
                console.log("Nueva fruta creada con id:", nuevaFruta.id);
                this.cargar();
            });
        },

        eliminar(frutaId) {
            this.$root.dao.fruta.delete({ id: frutaId }).then(() => { // elimina una entidad
                console.log("Fruta borrada");
                this.cargar();
            });
        },

        cambiarPrecio(frutaId, precio) {
            this.$root.dao.fruta.update({ id: frutaId }, { precio: precio }).then(() => { // actualiza una entidad
                console.log("Precio actualizado");
                this.cargar();
            });
        }
    },

    created() {
        // Carga inicial de los datos
        this.cargar();
        // Detectar que alguien crea/modifica/elimina un elemento para recargar la lista
        this.$root.dao.fruta.on("create", { tipo: 3 }, () => this.cargar());
        this.$root.dao.fruta.on("update", () => this.cargar());
        this.$root.dao.fruta.on("delete", () => this.cargar());
    }
}
