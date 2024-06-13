<template>
	<div class="grid-container">
	  <div class="block block1">
		<div class="block-title">
		  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg>
		  Jugadores
		</div>

		<div class="list-container">
			<router-link
				v-for="(item, index) in actoresCompletos"
				:key="index"
				:to="{ path: '/singleplayer', query: { player: item.name, idActor: item.idActor } }"
				class="list-item-link"
			>
			<div class="list-item player-item">
				<img :src="item.photo || 'https://ui-avatars.com/api/?name=Default&size=50'" alt="Foto-perfil" class="profile-pic" />
				<div class="item-details">
					<div class="name number">{{ item.name }} {{ item.surname }}</div>
				</div>
			</div>
			</router-link>
      	</div>
	  </div>
	  <div class="block block2">
		<div class="block-title">
			<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z"/></svg>
			KPIs Grupales
		</div>

	  </div>
	</div>
</template>

<script>
import { inject } from 'vue';
import { mapGetters } from 'vuex';

export default {
	name: 'TeamView',
	data() {
		return {
			actores: [],
        	actorIds: [],
        	actoresCompletos: [],
		};
	},
	computed: {
		...mapGetters(['teamSelectedID']),
		...mapGetters(['teamSelectedName']),
		...mapGetters(['userName']),
		...mapGetters(['userID']),
	},
	setup() {
      const app = inject('app');
      const dao = inject('dao');
      return { app, dao };
    },
	methods: {
		cargarJugadores() {
			if (!this.teamSelectedID) {
				console.error('No team selected');
				return;
			}

			this.dao.actor_has_actortype.read().then((response) => {
				this.actores = response.filter(actor =>
				actor.ActorType_idActorType === 2 &&
				actor.Organization_has_Category_Organization_idOrganization === this.teamSelectedID
				);
				this.actorIds = this.actores.map(actor => actor.Actor_idActor);

				this.cargarDatosCompletosJugadores();
			});
		},
		cargarDatosCompletosJugadores() {
			const promises = this.actorIds.map(id => this.dao.actor.read({ idActor: id }));
			Promise.all(promises).then((responses) => {
			this.actoresCompletos = responses;
			console.log('Datos completos de los actores:', this.actoresCompletos);
			});
		},
	},
    created() {
      this.cargarJugadores();
    }
};
</script>

<style scoped>
	.grid-container {
		display: grid;
		grid-template-areas: 
		"block1 block2 block3"
		"block1 block2 block3"
		"block4 block5 block5";
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 3fr 2fr 2fr;
		gap: 30px;
		height: 100%;
		width: 100%;
		padding: 40px;
		box-sizing: border-box;
	}

	.block {
		background-color: #ffffff;
		color: rgb(0, 0, 0);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		padding: 20px;
		box-sizing: border-box;
		border-radius: 10px;
		border: 1px rgb(186, 185, 185) solid;
	}

	.block-title {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	.block-title svg {
		margin-right: 10px;
	}

	.block1{
		grid-area: block1;
		max-height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.block2 {
		grid-area: block2;
		max-height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.block3 {
		grid-area: block3;
		max-height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
  	.block4 {
    	grid-area: block4;
  	}
  	.block5 {
		grid-area: block5;
	}

	.list-container {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		padding-right: 10px;
		box-sizing: border-box;
	}
	
	.list-item-link {
		text-decoration: none;
	}

	.list-item {
		display: flex;
		align-items: center;
		padding: 10px;
		margin: 5px 0;
		background-color: #fff;
		color: #000;
		border-radius: 5px;
		border: 1px solid grey;
		transition: background-color 0.3s;
		justify-content: center;
	}

	.list-item:hover {
		background-color: #f0f0f0;
	}

	.avg {
		background-color: #d1e7dd;
		color: #0f5132;
		padding: 5px 10px;
		border-radius: 12px;
		font-weight: bold;
	}

	.profile-pic {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		margin-right: 10px;
	}

	.item-details {
		display: flex;
		flex-direction: row; /* Mantiene los elementos en fila */
	}

	.name {
		font-weight: bold;
	}

	.number {
		color: #000000;
	}

  @media (max-width: 600px) {
    .grid-container {
      grid-template-areas:
        "block1"
        "block2"
        "block3"
        "block4"
        "block5"
        "block6";
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }
  }
</style>