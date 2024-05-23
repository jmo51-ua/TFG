<template>
    <div>
      <h1>Player: {{ playerName }}</h1>
      <!-- Resto del contenido -->
    </div>
  </template>
  
<script>
    export default {
        name: 'SinglePlayerView',
        computed: {
            playerName() {
            return this.$route.query.player || 'Unknown';
            }
        }
    }
</script>

<style scoped>
/* Tus estilos aquí */
</style>