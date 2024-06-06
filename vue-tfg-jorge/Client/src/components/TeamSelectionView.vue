<template>
  <div class="main">
    <h1>Selecciona un equipo</h1>

    <div
      v-for="(item, index) in equipos"
      :key="index"
      class="buttons-container"
    >
    <button @click="selectTeam(item.name)">{{ item.name }}</button>
    </div>

  </div>
</template>

<script>
import { useStore } from 'vuex';
import { inject, onMounted } from 'vue';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      user: [],
      equipos: [],
    };
  },
  setup() {
    const store = useStore();
    const dao = inject('dao');
    let orgs = [];

    const selectTeam = (team) => {
      dao.organization.read().then((response) => {
        orgs = response.filter(organization =>
          organization.name === team
        );
        console.log('Organizaciones: ', orgs);
        if (orgs.length > 0) {
          store.dispatch('actualizarTeamSelectedID', orgs[0].idOrganization);
          store.dispatch('actualizarTeamSelectedName', orgs[0].name);
        } else {
          console.error('Team not found');
        }
      });
    };

    return {
      selectTeam,
      dao,
    };
  },
  computed: {
    ...mapGetters(['userID']),
  },
  methods: {
    cargarOrgs() {
      this.dao.organization.read().then((response) => {
        this.equipos = response.filter(fila => fila.idOrganization == this.user.Organization_idOrganization);
        console.log("Equipos:",this.equipos);
      }).catch(error => {
        console.error('Error al cargar organizaciones:', error);
      });
    },
    cargarEquipos() {
      this.dao.user_has_organization.read().then((response) => {
        this.user = response.filter(fila => fila.user_id == this.userID)[0];
        console.log("Usuario", this.userID, ":", this.user);

        this.cargarOrgs();
      }).catch(error => {
        console.error('Error al cargar equipos:', error);
      });
    },
  },
  created() {
    this.cargarEquipos();
  }
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