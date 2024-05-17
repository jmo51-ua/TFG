<script setup>
  import { RouterView } from 'vue-router'
  import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="app">
    <Sidebar/>
    <RouterView />
  </div>
</template>

<style>
  :root {
    --primary: #499af1;
    --grey: #64748b;
    --dark: #1e293b;
    --dark-alt: #334155;
    --light: #f1f5f9;
    --sidebar-width: 300px;
    --menu-color: #83b7ff;
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