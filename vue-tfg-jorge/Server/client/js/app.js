// Carga un componente.
// Cada componente es una carpeta dentro "components" y tiene al menos:
//  - Un 'index.js' que hace un 'export default' del componente
//  - Un 'index.html' con el tamplate del componente
function loadComponent(name) {
    return import("./components/" + name + "/index.js").then(data => {
        const module = data.default; // export default
        if (module.template) return module;
        return fetch("js/components/" + name + "/index.html").then(response => response.text()).then(html => {
            console.log("* Cargado componente:", name);
            module.template = html;
            return module
        });
    });

}

// DAO
const daoApp = appClient(); // crea la app del cliente. Tiene un objeto 'dao' con todas las entidades definidas en 'schemas'
daoApp.getConfig(location.origin); // obtener configuración del servidor
console.log('location.origin:', location.origin);
// App de Vue
const vueApp = Vue.createApp({
    data: function () {
        return {
            logged: false // indica si se ha hecho login en la app o no
        }
    },
    computed: {
        app() { return daoApp; }, // acceso a la app del DAO
        dao() { return daoApp.dao; } // acceso al DAO
    }
});

// Cargar la lista de componentes
const componetNames = ["login", "principal", "frutas", "usuarios"]; // añadir aquí todos los componentes
const components = {}; // objeto con todos los componentes

Promise.all(componetNames.map(name => loadComponent(name).then(component => {
    vueApp.component(name, component); // registro el componente por si quiere usarse como <nombreComp></nombreComp>
    components[name] = component; // guardo el componente
    return component;
}))).then(() => {
    // Rutas
    console.log(components)
    const router = VueRouter.createRouter({
        history: VueRouter.createWebHashHistory(),
        routes: [
            { path: '/frutas', component: components.frutas },
            { path: '/usuarios', component: components.usuarios },
        ],
    });
    vueApp.use(router);

    vueApp.mount("#app"); // cuando he cargado todos los componentes monto la app de Vue
});
