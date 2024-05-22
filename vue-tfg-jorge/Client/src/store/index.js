import { createStore } from 'vuex';

export default createStore({
  state: {
    modo: 'semanal' // Valor inicial
  },
  getters: {
    modo: state => state.modo
  },
  mutations: {
    setModo(state, nuevoModo) {
      state.modo = nuevoModo;
    }
  },
  actions: {
    actualizarModo({ commit }, nuevoModo) {
      commit('setModo', nuevoModo);
    }
  }
});
