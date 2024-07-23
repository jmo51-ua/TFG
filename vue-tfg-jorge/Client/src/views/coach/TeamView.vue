<template>
	<main id="team-page">
		<div class="block-title row">
			<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
			<path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/>
			</svg>
			<b>Jugadores</b>
		</div>
		<div id="cartas" class="row">
			<PlayerCard
			v-for="(item, index) in actoresCompletos"
			:key="index"
			:player="item"
          	:playerName="item.name"
          	:playerId="item.idActor"
			class="card"
			/>

			<div class="noplayers" style="display: none;">
				No se han encontrado Jugadores
			</div>
		</div>
	</main>
</template>
  
<script>
	import { inject } from 'vue';
	import { mapGetters } from 'vuex';
	import PlayerCard from '@/components/PlayerCard.vue';
  
	export default {
		name: 'TeamView',
		components: {
			PlayerCard
		},
		data() {
			return {
			actores: [],
			actorIds: [],
			actoresCompletos: [],
			};
		},
		computed: {
			...mapGetters(['teamSelectedID', 'teamSelectedName', 'userName', 'userID']),
		},
		setup() {
			const app = inject('app');
			const dao = inject('dao');
			return { app, dao };
		},
		methods: {
			async cargarJugadores() {
				if (!this.teamSelectedID) {
					console.error('No team selected');
					return;
				}

				try {
					const response = await this.dao.actor_has_actortype.read();
					this.actores = response.filter(actor =>
					actor.ActorType_idActorType === 2 &&
					actor.Organization_has_Category_Organization_idOrganization === this.teamSelectedID
					);
					this.actorIds = this.actores.map(actor => actor.Actor_idActor);
					await this.cargarDatosCompletosJugadores();
				} catch (error) {
					console.error('Error al cargar jugadores:', error);
				}
			},
			async cargarDatosCompletosJugadores() {
				try {

					const promises = this.actorIds.map(id => this.dao.actor.read({ idActor: id }));
					this.actoresCompletos = await Promise.all(promises);
					console.log('Datos completos de los actores:', this.actoresCompletos);
					
					if(this.actoresCompletos.length == 0){
						const message = document.querySelector('.noplayers');
						if (message) { message.style.display = 'block'; }
					}
					else{
						const message = document.querySelector('.noplayers');
						if (message) { message.style.display = 'none'; }
					}
				} catch (error) {
					console.error('Error al cargar jugadores completos:', error);
				}
			},
		},
		created() {
			this.cargarJugadores();
		}
	};
</script>

<style>
	#team-page {
		padding: 20px 200px;
	}
	.row {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 20px;
	}

	.block-title {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	.block-title svg {
		margin-right: 10px;
	}

	.card {
		flex: 1 1 30%;
		margin: 10px;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		max-width: 400px;
		height: auto;
		border-radius: 10px;
		border: solid 1px black;
		color: grey;
		transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 1s ease, color 1s ease;
		perspective: 1000px;
	}

	.card:hover {
		transform: scale(1.05);
		cursor: pointer;
		background-color: #85b4ff;
		color: black;
	}

	.card-inner {
		transition: transform 0.1s ease;
	}
</style>
