<template>
    <div class="player-card" @click="goToURL">
      <img :src="player.photo || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'" alt="Foto-perfil" class="profile-pic" />
      <div class="item-details">
        <div class="name">{{ player.name }} {{ player.surname }}</div>
      </div>
    </div>
</template>
  
<script>
    export default {
        name: 'PlayerCard',
        props: {
            player: {
                type: Object,
                required: true
            },
            playerName: {
                type: String,
                required: true
            },
            playerId: {
                type: Number,
                required: true
            }
        },
        methods: {
            goToURL() {
                this.$router.push({ path: '/singleplayer', query: { player: this.playerName, idActor: this.playerId } });
            }
        }
    };
</script>
  
<style scoped>
    .player-card {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        height: 100px;
    }

    .profile-pic {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
        margin-bottom: 10px;
    }
    .item-details {
        display: flex;
        flex-direction: column;
    }
    .name {
        font-weight: bold;
    }
</style>
  