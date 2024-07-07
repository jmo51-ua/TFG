<template>

	<div class="menu-container">

		<div class="menu-aside">
			<aside  :class="`${is_expanded ? 'is-expanded' : ''}`">
				<div class="logo">
					<img src="../assets/logo.png" alt="TFG-Logo">
				</div>
				<div class="menu-toggle-wrap">
					<button class="menu-toggle" @click="ToggleMenu">
						<span class="material-icons">
							<svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#FFFFFF"><path d="M401.67-480.67 208.67-674l46.66-46.67 240 240-240 240-46.66-46.66 193-193.34Zm256.66 0L465.33-674 512-720.67l240 240-240 240-46.67-46.66 193-193.34Z"/></svg>
						</span>
					</button>
				</div>

				<h3>Menú</h3>
				<div class="menu">
					<router-link class="button" to="/">
						<span class="material-icons">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z"/></svg>
						</span>
						<span class="text">Inicio</span>
					</router-link>
					<router-link class="button" to="/equipo">
						<span class="material-icons">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Z"/></svg>
						</span>
						<span class="text">Equipo</span>
					</router-link>
					<router-link class="button" to="/stats">
						<span class="material-icons">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-280h80v-280h-80v280Zm160 0h80v-400h-80v400Zm160 0h80v-160h-80v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Z"/></svg>
						</span>
						<span class="text">Estadísticas</span>
					</router-link>
					<router-link class="button" to="/calendario">
						<span class="material-icons">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-400q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Z"/></svg>
						</span>
						<span class="text">Calendario</span>
					</router-link>
				</div>
			</aside>
		</div>

		<div class="main-container">
			<div class="header-container">
				<div class="header-sidebar">
					<span class="nombre-equipo">{{ teamSelectedName }}</span>
					<span class="nombre-vista">{{ viewName }}</span>
					<button class="button-29" role="button" @click="logout">Cerrar sesión</button>
					<div class="usuario-info">
						<!--NOMBRE USUARIO-->
						<span class="nombre-usuario">{{userName}}</span>
						<span class="foto-usuario">
							<img :src="user.image || 'https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Sport-PNG/Gold_Football_Ball_PNG_Clip_Art_Image.png?m=1629815688'" alt="User Picture">
						</span>
					</div>
				</div>
				<div class="header-inner">
					<div class="option">
						<input type="radio" id="modo1" name="modo" value="sesion" v-model="selectedModo" @change="cambiarModo" checked>
						<label for="modo1">Por sesión</label>
					</div>
					<div class="option">
						<input type="radio" id="modo2" name="modo" value="mensual" v-model="selectedModo" @change="cambiarModo">
						<label for="modo2">Mensual</label>
					</div>
					<div class="option">
						<input type="radio" id="modo2" name="modo" value="trimestral" v-model="selectedModo" @change="cambiarModo">
						<label for="modo2">Trimestral</label>
					</div>
					<!-- <div class="option">
						<input type="radio" id="modo2" name="modo" value="todo" v-model="selectedModo" @change="cambiarModo">
						<label for="modo2">Todo el tiempo</label>
					</div> -->
				</div>
			</div>
			<div :class="['content', { scrollable: isTeamView }]">
				<RouterView />
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from 'vue';
	import { useRoute } from 'vue-router';

	const is_expanded = ref(localStorage.getItem("is_expanded") === "true");

	const ToggleMenu = () => {
		is_expanded.value = !is_expanded.value
		localStorage.setItem("is_expanded", is_expanded.value)
	};

	const route = useRoute();

	const viewName = computed(() => {
		return route.name
	});

	const isTeamView = computed(() => (route.name == 'Equipo' || route.name == 'Estadísticas'));
	
</script>

<script>
	import { mapActions, mapGetters } from 'vuex';
	import { inject } from 'vue';

	export default {
		setup(){
			const app = inject('app');
      		const dao = inject('dao');
      		return { app, dao };
		},
		data() {
			return {
				selectedModo: this.modo, // Inicializado
				user: [],
			};
		},
		computed: {
			...mapGetters(['modo']),
			...mapGetters(['logged']),
			...mapGetters(['teamSelectedID']),
			...mapGetters(['teamSelectedName']),
			...mapGetters(['userName']),
			...mapGetters(['userID']),
		},
		watch: {
			modo(newModo) {
				this.selectedModo = newModo;
			}
		},
		methods: {
			...mapActions(['actualizarModo']),
			...mapActions(['actualizarLogged']),
			...mapActions(['actualizarTeamSelectedID']),
			logout(){
				this.actualizarLogged(false);
				this.actualizarTeamSelectedID(null);
				this.app.logout();
			},
			cambiarModo() {
				this.actualizarModo(this.selectedModo);
			},
			cargarUserInfo(){
				this.dao.actor.read().then((response) => {
					this.user = response.filter(actor =>
						actor.user_id == this.userID
					)[0];
				});
			}
		},
	};
</script>

<style lang="scss" scoped>
	aside {
		display: flex;
		flex-direction: column;

		background-color: var(--dark);
		color: var(--light);

		width: var(--sidebar-width);
		overflow: hidden;
		min-height: 100vh;
		padding: 1rem;

		transition: 0.2s ease-in-out;

		.flex {
			flex: 1 1 0%;
		}

		.logo {
			margin-bottom: 1rem;

			img {
				width: 2rem;
			}
		}

		.menu-toggle-wrap {
			display: flex;
			justify-content: flex-end;
			margin-bottom: 1rem;

			position: relative;
			top: 0;
			transition: 0.2s ease-in-out;

			.menu-toggle {
				transition: 0.2s ease-in-out;
				.material-icons {
					font-size: 2rem;
					color: var(--light);
					transition: 0.2s ease-out;
				}
				
				&:hover {
					.material-icons {
						color: var(--primary);
						transform: translateX(0.5rem);
					}
				}

				@media (max-width: 1024px) {
					display: none;
				}
			}
		}

		h3, .button .text {
			opacity: 0;
			transition: opacity 0.3s ease-in-out;
		}

		h3 {
			color: var(--menu-color);
			font-size: 0.875rem;
			margin-bottom: 0.5rem;
			text-transform: uppercase;
		}

		.menu {
			margin: 0 -1rem;

			.button {
				display: flex;
				align-items: center;
				text-decoration: none;

				transition: 0.2s ease-in-out;
				padding: 0.5rem 1rem;

				.material-icons {
					font-size: 2rem;
					color: var(--light);
					transition: 0.2s ease-in-out;
				}
				.text {
					color: var(--light);
					transition: 0.2s ease-in-out;
				}

				&:hover {
					background-color: var(--dark-alt);

					.material-icons, .text {
						color: var(--primary);
					}
				}

				&.router-link-exact-active {
					background-color: var(--dark-alt);
					border-right: 5px solid var(--primary);

					.material-icons, .text {
						color: var(--primary);
					}
				}
			}
		}

		.footer {
			opacity: 0;
			transition: opacity 0.3s ease-in-out;

			p {
				font-size: 0.875rem;
				color: var(--grey);
			}
		}

		&.is-expanded {
			width: var(--sidebar-width-expanded);

			.menu-toggle-wrap {
				top: -3rem;
				
				.menu-toggle {
					transform: rotate(-180deg);
				}
			}

			h3, .button .text {
				opacity: 1;
			}

			.button {
				.material-icons {
					margin-right: 1rem;
				}
			}

			.footer {
				opacity: 0;
			}
		}

		@media (max-width: 1024px) {
			z-index: 99;
		}
	}

	.main-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #ffffff;
		width: 100%;
	}

	.menu-container {
		width: 100vw;
		height: 100vh;
		display: flex;
	}

	.header-sidebar{
		height: 70px;
		background-color: #85b4ff;
		display: flex;
		align-items: center;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		padding-left: 20px;
		padding-right: 20px;
		padding-top:10px;
		padding-bottom: 10px;
		z-index: 10;
		border-bottom: 1px solid #e2e8f0;
		color: white;
		font-weight: bold;
    	transition: margin-left 0.2s ease-in-out;

		.nombre-equipo {
			margin-right: auto; /* Alinea el nombre del equipo a la izquierda */
		}

		.nombre-vista {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
		}

		.usuario-info {
			display: flex;
			align-items: center;
		}
		

		.nombre-usuario {
			margin-right: 10px;
		}

		.foto-usuario {
			width: 32px;
			height: 32px;
			background-color: #fff;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #85b4ff;
		}

		.foto-usuario img{
			width: 32px;
			height: 32px;
		}

		.button-29 {
			align-items: center;
			appearance: none;
			background-color: var(--dark);
			border: 0;
			border-radius: 6px;
			box-sizing: border-box;
			color: #fff;
			cursor: pointer;
			display: inline-flex;
			font-family: "Fira sans", sans-serif;
			font-weight: bold;
			height: 32px;
			width: 130px;
			justify-content: center;
			line-height: 1;
			list-style: none;
			overflow: hidden;
			padding-left: 16px;
			padding-right: 16px;
			margin-right: 15px;
			position: relative;
			text-align: left;
			text-decoration: none;
			transition: box-shadow .15s,transform .15s, background-color .5s ease;
			user-select: none;
			-webkit-user-select: none;
			touch-action: manipulation;
			white-space: nowrap;
			will-change: box-shadow,transform;
			font-size: 16px;
		}

		.button-29:hover {
			background-color: #1c6ff5;
		}

		.button-29:active {
			box-shadow: #3c4fe0 0 3px 7px inset;
			transform: translateY(2px);
		}

		&.is-expanded {
			margin-left: var(--sidebar-width-expanded);
		}
	}

	.header-inner {
		height: 35px;
		background-color: #dbdada;
		display: flex;
		align-items: center;
		justify-content: center; /* Centramos el contenido */
		z-index: 10;
		border-bottom: 1px solid #e2e8f0;
		color: rgb(0, 0, 0);
		font-weight: bold;
		transition: margin-left 0.2s ease-in-out;

		.option {
			display: flex;
			align-items: center;
			margin: 0 10px; /* Reducimos la separación */
		}

		.option label {
			margin-left: 5px; /* Añadimos un pequeño margen entre el input y el label */
		}
	}

	.content {
		flex-grow: 1;
		background-color: #ffffff;
		overflow-y: auto;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
		margin-bottom: 50px;
	}
	
</style>

<style scoped>
	.content.scrollable {
		height: 100vh;
		overflow: auto;
	}
</style>
