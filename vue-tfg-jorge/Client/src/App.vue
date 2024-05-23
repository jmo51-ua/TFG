<script setup>
  import Sidebar from './components/Sidebar.vue'
  import login from './components/login.vue'
</script>


<template>
  <div class="app">
    <Sidebar v-if="logged"></Sidebar>
		<login v-else></login>
  </div>
</template>

<script>
	import { mapActions, mapGetters } from 'vuex';

	export default {
    computed: {
      ...mapGetters(['logged']),
    },
    methods: {
      ...mapActions(['actualizarLogged']),
    },
  };
</script>

<style>
  :root {
    --primary: #499af1;
    --grey: #64748b;
    --dark: #1e293b;
    --dark-alt: #334155;
    --light: #f1f5f9;
    --sidebar-width-expanded: 250px;
    --menu-color: #83b7ff;
    --sidebar-width: calc(2rem + 32px);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Fira sans', sans-serif;
  }

  body {
    background: var(--light);
  }

  button {
    cursor: pointer;
    appearance: none;
    border: none;
    outline: none;
    background: none;
  }

  .app {
    display: flex;

    main {
      flex: 1 1 0;
      padding: 2rem;

      @media (max-width: 1024px) {
        padding-left: 6rem;
      }
    }
  }
</style>