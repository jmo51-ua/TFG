<template>
	<main id="stats-page">
  
		<div class="row">
			<button class="report-button">
				Informe de todos los KPIs
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M360-460h40v-80h40q17 0 28.5-11.5T480-580v-40q0-17-11.5-28.5T440-660h-80v200Zm40-120v-40h40v40h-40Zm120 120h80q17 0 28.5-11.5T640-500v-120q0-17-11.5-28.5T600-660h-80v200Zm40-40v-120h40v120h-40Zm120 40h40v-80h40v-40h-40v-40h40v-40h-80v200ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/></svg>
			</button>
			<button class="report-button">
				Informe de todos los KPIs
				<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 48 48">
					<path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
				</svg>
			</button>
			<button class="report-button">
				Informe de ún solo los KPI
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M360-460h40v-80h40q17 0 28.5-11.5T480-580v-40q0-17-11.5-28.5T440-660h-80v200Zm40-120v-40h40v40h-40Zm120 120h80q17 0 28.5-11.5T640-500v-120q0-17-11.5-28.5T600-660h-80v200Zm40-40v-120h40v120h-40Zm120 40h40v-80h40v-40h-40v-40h40v-40h-80v200ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/></svg>
			</button>
		</div>
  
		<div id="graficos" class="row">
			<div v-for="(chart, index) in chartData" :key="index" class="chart">
				<KpiChart :chartData="chart.data" :chartId="'chart-' + index" :chartName="chart.name" />
			</div>

			<div class="chart">
				<button class="add-chart-button button" @click="addChart">
					Añadir nuevo registro
				</button>
			</div>
		</div>

		<div class="create-kpi" v-if="showCreateKpiForm">
			<form @submit.prevent="createKpi" class="kpi-form">
				<label for="name">Nombre del KPI:</label>
				<input type="text" id="name" v-model="newKpi.name" required>
				
				<label for="description">Descripción:</label>
				<input type="text" id="description" v-model="newKpi.description" required>
				
				<label for="target">Objetivo (%):</label>
				<input type="number" min="1" max="100" id="target" v-model="newKpi.target" required>
				
				<button type="submit">Crear KPI</button>
			</form>
		</div>
	</main>
</template>
  
<script>
import KpiChart from '@/components/KpiChart.vue'
import { inject } from 'vue';
import { mapGetters } from 'vuex';

  export default {
	components: {
		KpiChart
	},
	data() {
		return {
			charts: [
				'https://via.placeholder.com/300',
				'https://via.placeholder.com/300',
				'https://via.placeholder.com/300',
				'https://via.placeholder.com/300',
				'https://via.placeholder.com/300',
				'https://via.placeholder.com/300',
				'https://via.placeholder.com/300',
			],
			showCreateKpiForm: false,
			newKpi: {
				name: '',
				description: '',
				target: ''
			},
			actores: [],
			actorIds: [],
			actoresCompletos: [],

			kpis_sesion: [],

			chartData: [],
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
		addChart() {
			//nueva gráfica
			//this.charts.push('https://via.placeholder.com/300');
			this.showCreateKpiForm = true;
		},
		createKpi() {
			console.log('Nuevo KPI:', this.newKpi);
			this.showCreateKpiForm = false; // Ocultar el formulario
			this.charts.push('https://via.placeholder.com/300');
		},
		cargarKPIsPor_sesion() {
			this.dao.exercise_has_session_has_actor_has_kpi.read().then((ejercicios) => {

			ejercicios = ejercicios.filter(sesion =>
			sesion.Exercise_has_Session_has_Actor_Actor_idActor == this.$route.query.idActor
			);

			const kpiPromises = ejercicios.map(element => {
			return this.dao.kpi.read().then((indicadores) => {
				let indicador = indicadores.find(indic => indic.idKPI == element.KPI_idKPI);
				indicador.score = element.score;

				return this.dao.session.read().then((sesiones) => {
				let sesion = sesiones.find(sesion =>
					sesion.idSession == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Ses_idSes
				);
				indicador.ses_date = sesion.date;
				indicador.ses_name = sesion.name;

				return this.dao.exercise.read().then((ejercicios) => {
					let ejercicio = ejercicios.find(ex =>
					ex.idExercise == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Exer_idExer
					);
					indicador.ex_name = ejercicio.name;

					return indicador;
				});
				});
			});
			});

			Promise.all(kpiPromises).then((result) => {
				const kpiData = {};

				result.forEach(indicador => {
					if (!kpiData[indicador.name]) {
					kpiData[indicador.name] = [];
					}
					kpiData[indicador.name].push({
					time: this.cogerYearMonth(indicador.ses_date),
					score: indicador.score
					});
				});
				
				//BORRAR
				result.forEach(indicador => {
					if (!kpiData[indicador.name]) {
					kpiData[indicador.name] = [];
					}
					kpiData[indicador.name].push({
					time: this.cogerYearMonth(indicador.ses_date),
					score: 10
					});
				});
				//BORRAR
				result.forEach(indicador => {
					if (!kpiData[indicador.name]) {
					kpiData[indicador.name] = [];
					}
					kpiData[indicador.name].push({
					time: this.cogerYearMonth(indicador.ses_date),
					score: 6
					});
				});

				for (const [key, value] of Object.entries(kpiData)) {
					this.chartData.push({
					name: key,
					data: value
					});
				}
			});
		});
		},
		cogerYearMonth(date){
		const dateFormat = new Date(date);
		const year = dateFormat.getFullYear();
		const month = String(dateFormat.getMonth() + 1).padStart(2, '0');

		return `${year}-${month}`;
		},
		cargarGraficos() {
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

				const promises = this.actorIds.map(id => this.dao.actor.read({ idActor: id }));
				Promise.all(promises).then((responses) => {
					this.actoresCompletos = responses;
					console.log('Datos completos de los actores:', this.actoresCompletos);
					this.cargarKPIs_sesion();
				});
			});
		},
		cargarKPIs_sesion() {
			let kpiPorSesion = {};

			this.dao.exercise_has_session_has_actor_has_kpi.read().then((ejercicios) => {
				const kpiPromises = this.actorIds.map(idActor => {
					const ejerciciosFiltrados = ejercicios.filter(sesion =>
						sesion.Exercise_has_Session_has_Actor_Actor_idActor == idActor
					);
					return Promise.all(ejerciciosFiltrados.map(element => {
						return this.dao.kpi.read().then((indicadores) => {
							let indicador = indicadores.filter(indic =>
								indic.idKPI == element.KPI_idKPI
							)[0];
							indicador.score = element.score;

							return this.dao.session.read().then((sesiones) => {
								let sesion = sesiones.find(sesion =>
									sesion.idSession == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Ses_idSes
								);
								indicador.ses_date = sesion.date;
								indicador.ses_name = sesion.name;
								let distinctSesion = `${sesion.idSession}-${sesion.name}`;

								if (!kpiPorSesion[distinctSesion]) {
									kpiPorSesion[distinctSesion] = {};
								}

								if (!kpiPorSesion[distinctSesion][indicador.idKPI]) {
									kpiPorSesion[distinctSesion][indicador.idKPI] = {
										idKPI: indicador.idKPI,
										name: indicador.name,
										scores: [],
										range: indicador.range,
									};
								}

								kpiPorSesion[distinctSesion][indicador.idKPI].scores.push(indicador.score);
								console.log("indicador:", indicador);

								return indicador;
							});
						});
					}));
				});

				Promise.all(kpiPromises.flat()).then((result) => {
					let resultado = [];

					for (let sesion in kpiPorSesion) {
						for (let idKPI in kpiPorSesion[sesion]) {
							let kpi = kpiPorSesion[sesion][idKPI];
							let avgScore = kpi.scores.reduce((a, b) => a + b, 0) / kpi.scores.length;
							
							let id_sesion = sesion.split('-')[0];
							let name_sesion = sesion.split('-')[1];

							resultado.push({
								idKPI: kpi.idKPI,
								name: kpi.name,
								date: name_sesion,
								score: avgScore,
								ses_name: name_sesion,
								range: kpi.range,
							});
						}
					}

					console.log('KPIs agrupados por sesion:', resultado);
					this.kpis_sesion = resultado;

					this.chartData = [];
					let kpiData = {};

					this.kpis_sesion.forEach(indicador => {
						if (!kpiData[indicador.name]) {
							kpiData[indicador.name] = [];
						}
						kpiData[indicador.name].push({
							time: indicador.date,
							score: indicador.score
						});
					});

					this.kpis_sesion.forEach(indicador => {
						if (!kpiData[indicador.name]) {
							kpiData[indicador.name] = [];
						}
						kpiData[indicador.name].push({
							time: "aaaaaa",
							score: 23
						});
					});

					this.kpis_sesion.forEach(indicador => {
						if (!kpiData[indicador.name]) {
							kpiData[indicador.name] = [];
						}
						kpiData[indicador.name].push({
							time: "bbbb",
							score: 31
						});
					});

					this.kpis_sesion.forEach(indicador => {
						if (!kpiData[indicador.name]) {
							kpiData[indicador.name] = [];
						}
						kpiData[indicador.name].push({
							time: "cccc",
							score: 28
						});
					});

					for (const [key, value] of Object.entries(kpiData)) {
						console.log(value);
						this.chartData.push({
							name: key,
							data: value
						});
						this.chartData.push({
							name: key,
							data: value
						});
						this.chartData.push({
							name: key,
							data: value
						});
						this.chartData.push({
							name: key,
							data: value
						});
						this.chartData.push({
							name: key,
							data: value
						});
						this.chartData.push({
							name: key,
							data: value
						});
						this.chartData.push({
							name: key,
							data: value
						});
					}
				});
			});
		},
	},
	created() {
		try{
			this.cargarGraficos();
		}
		catch(error){
			console.error(error);
		}
    }
}
</script>
  
<style scoped>
	#stats-page {
		padding: 20px 200px;
	}

	.row {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 20px;
	}

	.report-button {
		display: flex;
		align-items: center;
		margin: 10px;
		padding: 10px 20px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-weight: bold;
	}

	.report-button svg {
		margin-left: 10px; /* Espacio entre el texto y el icono */
	}

	.report-button:hover {
		background-color: #0056b3;
	}

	.chart {
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
	}

	.add-chart-button {
		display: inline-block;
		margin: 20px;
		padding: 10px 20px;
		background-color: #28a745;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-weight: bold;
	}

	.button {
		min-width: 120px;

		position: relative;
		cursor: pointer;

		padding: 12px 17px;
		border: 0;
		border-radius: 7px;

		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
		background: radial-gradient(
			ellipse at bottom,
			rgba(71, 81, 92, 1) 0%,
			rgba(11, 21, 30, 1) 45%
		);

		color: rgb(255, 255, 255, 0.66);

		transition: all 1s cubic-bezier(0.15, 0.83, 0.66, 1);
	}

	.button::before {
		content: "";
		width: 70%;
		height: 1px;

		position: absolute;
		bottom: 0;
		left: 15%;

		background: rgb(255, 255, 255);
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 1) 50%,
			rgba(255, 255, 255, 0) 100%
		);
		opacity: 0.2;

		transition: all 1s cubic-bezier(0.15, 0.83, 0.66, 1);
	}

	.button:hover {
		color: rgb(255, 255, 255, 1);
		transform: scale(1.1) translateY(-3px);
	}

	.button:hover::before {
		opacity: 1;
	}

	.create-kpi {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
		padding: 20px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border-radius: 10px;
	}

	.kpi-form {
		display: flex;
		flex-direction: column;
	}

	.kpi-form label {
		margin-bottom: 5px;
	}

	.kpi-form input {
		margin-bottom: 15px;
		padding: 5px;
		font-size: 16px;
	}

	.kpi-form button {
		padding: 10px 20px;
		font-size: 16px;
		background-color: #4CAF50;
		color: white;
		border: none;
		cursor: pointer;
	}

	.kpi-form button:hover {
		background-color: #45a049;
	}

	@media (max-width: 600px) {
		.chart {
			flex: 1 1 100%;
		}
	}

</style>
  