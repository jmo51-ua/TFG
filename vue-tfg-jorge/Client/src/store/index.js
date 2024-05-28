import { createStore } from 'vuex';

export default createStore({
  state: {
    modo: 'semanal', // Valor inicial
    logged: false,
    teamSelectedID: null,
    teamSelectedName: null,
  },
  getters: {
    modo: state => state.modo,
    logged: state => state.logged,
    teamSelectedID: state => state.teamSelectedID,
    teamSelectedName: state => state.teamSelectedName,
  },
  mutations: {
    setModo(state, nuevoModo) {
      state.modo = nuevoModo;
    },
    setLogged(state, nuevoValor) {
      state.logged = nuevoValor;
    },
    setTeamSelectedID(state, nuevoValor) {
      state.teamSelectedID = nuevoValor;
    },
    setTeamSelectedName(state, nuevoValor) {
      state.teamSelectedName = nuevoValor;
    },
  },
  actions: {
    actualizarModo({ commit }, nuevoModo) {
      commit('setModo', nuevoModo);
    },
    actualizarLogged({ commit }, nuevoValor) {
      commit('setLogged', nuevoValor);
    },
    actualizarTeamSelectedID({ commit }, nuevoValor) {
      commit('setTeamSelectedID', nuevoValor);
    },
    actualizarTeamSelectedName({ commit }, nuevoValor) {
      commit('setTeamSelectedName', nuevoValor);
    },
  }
});
