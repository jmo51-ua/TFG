import { createStore } from 'vuex';

export default createStore({
  state: {
    modo: 'semanal', // Valor inicial
    logged: false
  },
  getters: {
    modo: state => state.modo,
    logged: state => state.logged
  },
  mutations: {
    setModo(state, nuevoModo) {
      state.modo = nuevoModo;
    },
    setLogged(state, nuevoValor) {
      state.logged = nuevoValor;
    }
  },
  actions: {
    actualizarModo({ commit }, nuevoModo) {
      commit('setModo', nuevoModo);
    },
    actualizarLogged({ commit }, nuevoValor) {
      commit('setLogged', nuevoValor);
    },
  }
});
