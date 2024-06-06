import { createStore } from 'vuex';

export default createStore({
  state: {
    modo: 'sesion', // Valor inicial
    logged: false,
    teamSelectedID: null,
    teamSelectedName: null,
    userID: null,
    userName: null,
  },
  getters: {
    modo: state => state.modo,
    logged: state => state.logged,
    teamSelectedID: state => state.teamSelectedID,
    teamSelectedName: state => state.teamSelectedName,
    userID: state => state.userID,
    userName: state => state.userName,
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
    setUserID(state, nuevoValor) {
      state.userID = nuevoValor;
    },
    setUserName(state, nuevoValor) {
      state.userName = nuevoValor;
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
    actualizarUserID({ commit }, nuevoValor) {
      commit('setUserID', nuevoValor);
    },
    actualizarUserName({ commit }, nuevoValor) {
      commit('setUserName', nuevoValor);
    },
  }
});
