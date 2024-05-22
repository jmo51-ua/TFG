export default {
    data() {
        return {
            email: "",
            password: ""
        };
    },

    methods: {
        login() {
            this.$root.app.login({ email: this.email, password: this.password }).then(
                () => {
                    this.$root.logged = true;
                },
                () => { alert("Error en login") }
            );
        }
    }
};