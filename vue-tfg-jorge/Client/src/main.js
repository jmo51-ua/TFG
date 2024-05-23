import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// DAO
const daoApp = appClient(); // crea la app del cliente. Tiene un objeto 'dao' con todas las entidades definidas en 'schemas'
daoApp.getConfig('http://localhost:8080'); // obtener configuración del servidor

// Configuración de la app de Vue
const app = createApp(App);

app.config.globalProperties.$app = daoApp; // acceso global a la app del DAO
app.config.globalProperties.$dao = daoApp.dao; // acceso global al DAO
  
app.provide('app', daoApp);
app.provide('dao', daoApp.dao);

app.use(router);
app.use(store);

app.mount('#app');
