<template>
  <div class="main">
    <h1>Selecciona un equipo</h1>

    <div class="buttons-container">
      <button @click="selectTeam('CEIP La Romana')">CEIP La Romana</button>
      <button @click="selectTeam('C.F. Atlético La Romana')">C.F. Atlético La Romana</button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { inject } from 'vue';

export default {
  setup() {
    const store = useStore();
    const dao = inject('dao');
    let orgs =[];

    const selectTeam = (team) => {
      dao.organization.read().then((response) => {
        orgs.value = response.filter(organization =>
          organization.name === team
        );
        console.log('Organizaciones: ', orgs.value);
        if (orgs.value.length > 0) {
          store.dispatch('actualizarTeamSelectedID', orgs.value[0].idOrganization);
          store.dispatch('actualizarTeamSelectedName', orgs.value[0].name);
        } else {
          console.error('Team not found');
        }
      });
    };

    return {
      selectTeam,
      orgs,
    };
  },
};
</script>

<style scoped>
  .main {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h1 {
    margin-bottom: 20px;
  }

  .buttons-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
  }

  button {
    border: 1px solid rgb(148, 148, 148);
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 15px;
  }

  button:hover {
    background-color: rgb(83, 209, 102);
  }
</style>