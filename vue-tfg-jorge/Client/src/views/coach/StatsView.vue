<template>
	<main id="stats-page">
  
		<div class="row">
			<button class="report-button" @click="generateReportPDF">
				Informe de todos los KPIs
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M360-460h40v-80h40q17 0 28.5-11.5T480-580v-40q0-17-11.5-28.5T440-660h-80v200Zm40-120v-40h40v40h-40Zm120 120h80q17 0 28.5-11.5T640-500v-120q0-17-11.5-28.5T600-660h-80v200Zm40-40v-120h40v120h-40Zm120 40h40v-80h40v-40h-40v-40h40v-40h-80v200ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/></svg>
			</button>
			<button class="report-button" @click="exportToCSV">
				Informe de todos los KPIs
				<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 48 48">
					<path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
				</svg>
			</button>
		</div>
  
		<div id="graficos" class="row">
			<div v-for="(chart, index) in chartData" :key="index" class="chart">
				<KpiChart :chartData="chart.data" :chartId="'chart-' + index" :chartName="chart.name" />
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

		<div class="loader-container">
			<div class="dot-spinner">
				<div class="dot-spinner__dot"></div>
				<div class="dot-spinner__dot"></div>
				<div class="dot-spinner__dot"></div>
				<div class="dot-spinner__dot"></div>
				<div class="dot-spinner__dot"></div>
				<div class="dot-spinner__dot"></div>
				<div class="dot-spinner__dot"></div>
				<div class="dot-spinner__dot"></div>
			</div>
			<p>Cargando...</p>
		</div>
	</main>
</template>
  
<script>
import KpiChart from '@/components/KpiChart.vue'
import { inject } from 'vue';
import { mapGetters } from 'vuex';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

  export default {
	components: {
		KpiChart
	},
	computed: {
		...mapGetters(['teamSelectedID']),
		...mapGetters(['teamSelectedName']),
		...mapGetters(['userName']),
		...mapGetters(['userID']),
		...mapGetters(['modo']),
		kpisJugador() {
			switch (this.modo) {
				case 'sesion':
					return this.kpis_sesion;
				case 'mensual':
					return this.kpis_mensual;
				case 'trimestral':
					return this.kpis_trimestral;
				default:
				return [];
			}
		},
    },
	mounted() {
		this.$nextTick(() => {
			const loader = document.querySelector('.loader-container');
			if(loader){loader.style.display = 'flex';}
		});
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
			kpis_mensual: [],
			kpis_trimestral: [],
			kpis_all: [],

			chartData: [],
		};
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
		cogerYearMonth(date){
			const dateFormat = new Date(date);
			const year = dateFormat.getFullYear();
			const month = String(dateFormat.getMonth() + 1).padStart(2, '0');

			return `${year}-${month}`;
		},
		obtenerNombreMes(numeroMes) {
			const meses = [
				"Enero",
				"Febrero",
				"Marzo",
				"Abril",
				"Mayo",
				"Junio",
				"Julio",
				"Agosto",
				"Septiembre",
				"Octubre",
				"Noviembre",
				"Diciembre"
			];
			const mesIndex = parseInt(numeroMes, 10) - 1;

			if (mesIndex >= 0 && mesIndex < meses.length) {
				return meses[mesIndex];
			} else {
				return "Mes inválido";
			}
		},
		getTrimestre(mes) {
			const month = parseInt(mes.split('-')[1], 10);
			if (month >= 1 && month <= 3) {
				return `${mes.split('-')[0]} T1`;
			} else if (month >= 4 && month <= 6) {
				return `${mes.split('-')[0]} T2`;
			} else if (month >= 7 && month <= 9) {
				return `${mes.split('-')[0]} T3`;
			} else if (month >= 10 && month <= 12) {
				return `${mes.split('-')[0]} T4`;
			}
		},
		async generateReportPDF() {

			try{
				const pdf = new jsPDF('p', 'mm', 'a4');
				const element = document.getElementById('graficos');

				const canvas = await html2canvas(element, {
					scale: 2
				});
				const imgData = canvas.toDataURL('image/png');
				
				const imgProps = pdf.getImageProperties(imgData);
				const pdfWidth = pdf.internal.pageSize.getWidth();
				const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
				
				pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
				pdf.save('KPI-Report.pdf');
			}catch(error){
				console.error("Error al crear el PDF:",error);
			}
		},
		exportToCSV() {
			const header = 'Indicador,Time,Score\n';
			let csv = header;

			this.chartData.forEach(indicador => {
				indicador.data.forEach(item => {
					csv += `${indicador.name},${item.time},${item.score}\n`;
				});
			});

			const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
			const url = window.URL.createObjectURL(blob);
			
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			a.download = 'KPI-Report.csv';
			document.body.appendChild(a);
			a.click();

			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		},



		async cargarKPIs() {
			const loader = document.querySelector('.loader-container');
			if(loader){loader.style.display = 'flex';}

			this.chartData = [];

			const methodName = `cargarKPIs_${this.modo}`;
			if (typeof this[methodName] === 'function') {
				await this[methodName]();
				loader.style.display = 'none';
			} else {
				console.error(`Method ${methodName} does not exist`);
			}
		},
		async cargarKPIs_sesion() {
			const loader = document.querySelector('.loader-container');
			if(loader){loader.style.display = 'flex';}
			let kpiPorSesion = {};

			try {
				const ejercicios = await this.dao.exercise_has_session_has_actor_has_kpi.read();

				const kpiPromises = this.actorIds.map(async idActor => {
				const ejerciciosFiltrados = ejercicios.filter(sesion =>
					sesion.Exercise_has_Session_has_Actor_Actor_idActor == idActor
				);

				return Promise.all(ejerciciosFiltrados.map(async element => {
					const indicadores = await this.dao.kpi.read();
					let indicador = indicadores.find(indic => indic.idKPI == element.KPI_idKPI);
					indicador.score = element.score;

					const sesiones = await this.dao.session.read();
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
				}));
				});

				await Promise.all(kpiPromises.flat());

				let resultado = [];

				for (let sesion in kpiPorSesion) {
					for (let idKPI in kpiPorSesion[sesion]) {
						let kpi = kpiPorSesion[sesion][idKPI];
						let avgScore = (kpi.scores.reduce((a, b) => a + b, 0) / kpi.scores.length).toFixed(2);
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
				this.kpis_sesion = resultado;

				this.chartData = [];
				let kpiData = {};

				this.kpis_sesion.forEach(indicador => {
				if (!kpiData[indicador.name]) {
					kpiData[indicador.name] = {
					data: [],
					range: indicador.range
					};
				}
				kpiData[indicador.name].data.push({
					time: indicador.date,
					score: indicador.score
				});
				});

				for (const [key, value] of Object.entries(kpiData)) {
				this.chartData.push({
					name: key,
					data: value.data,
					range: value.range
				});
				}

			} catch (error) {
				console.error('Error al cargar KPIs de sesión:', error);
			}
		},
		async cargarKPIs_mensual() {
			const loader = document.querySelector('.loader-container');
			if(loader){loader.style.display = 'flex';}

			let kpiPorMes = {};
			let kpiPorSesion = {};

			try {
				const ejercicios = await this.dao.exercise_has_session_has_actor_has_kpi.read();
				const ejerciciosFiltrados = ejercicios.filter(sesion =>
					this.actorIds.includes(sesion.Exercise_has_Session_has_Actor_Actor_idActor)
				);

				const kpiPromises = ejerciciosFiltrados.map(async element => {
					const indicadores = await this.dao.kpi.read();
					let indicador = indicadores.find(indic => indic.idKPI == element.KPI_idKPI);
					indicador.score = element.score;

					const sesiones = await this.dao.session.read();
					let sesion = sesiones.find(sesion =>
					sesion.idSession == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Ses_idSes
					);
					indicador.ses_date = sesion.date;
					indicador.ses_name = sesion.name;

					if (!kpiPorSesion[sesion.idSession]) {
					kpiPorSesion[sesion.idSession] = {
						name: sesion.name,
						date: sesion.date,
						[indicador.idKPI]: {
						idKPI: indicador.idKPI,
						name: indicador.name,
						scores: [],
						range: indicador.range,
						exercises: {}
						}
					};
					} else if (!kpiPorSesion[sesion.idSession][indicador.idKPI]) {
						kpiPorSesion[sesion.idSession][indicador.idKPI] = {
							idKPI: indicador.idKPI,
							name: indicador.name,
							scores: [],
							range: indicador.range,
							exercises: {}
						};
					}

					const ejerciciosResponse = await this.dao.exercise.read();
					let ejercicio = ejerciciosResponse.find(ex =>
					ex.idExercise == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Exer_idExer
					);
					indicador.ex_name = ejercicio.name;

					if (!kpiPorSesion[sesion.idSession][indicador.idKPI][ejercicio.idExercise]) {
					kpiPorSesion[sesion.idSession][indicador.idKPI][ejercicio.idExercise] = {
						id: ejercicio.idExercise,
						name: ejercicio.name,
						score: element.score,
					};
					}

					kpiPorSesion[sesion.idSession][indicador.idKPI].scores.push(element.score);
				});

				await Promise.all(kpiPromises);

				let resultado = [];

				// Preparar KPI Por Mes
				for (let ses in kpiPorSesion) {
					let sesion = kpiPorSesion[ses];
					let mes = this.cogerYearMonth(sesion.date);
					let month_name = this.obtenerNombreMes(mes.split('-')[1]) + ` ${mes.split('-')[0]}`;

					if (!kpiPorMes[mes]) {
					kpiPorMes[mes] = {
						name: month_name,
						sessions: {}
					};
					}

					if (!kpiPorMes[mes].sessions[ses]) {
					kpiPorMes[mes].sessions[ses] = {
						idKPI: ses,
						name: sesion.name,
						date: sesion.date,
						scores: [],
						KPIs: {}  // Para almacenar los KPIs
					};
					}

					for (let idKPI in sesion) {
					let kpi = sesion[idKPI];

					if (kpi.scores) {
						let avgScoreKPI = (kpi.scores.reduce((a, b) => a + b, 0) / kpi.scores.length).toFixed(2);
						
						kpiPorMes[mes].sessions[ses].KPIs[idKPI] = {
						id: idKPI,
						name: kpi.name,
						score: avgScoreKPI,
						exercises: kpi.exercises,
						range: kpi.range,
						};

						kpiPorMes[mes].sessions[ses].scores.push(parseFloat(avgScoreKPI));
					}
					}
				}


				for (let mes in kpiPorMes) {
					let month = kpiPorMes[mes];
					let sessions = [];

					for (let ses in month.sessions) {
					let session = month.sessions[ses];
					let KPIs = [];

					for (let idKPI in session.KPIs) {
						KPIs.push(session.KPIs[idKPI]);
					}

					let avgScore = (KPIs.reduce((acc, kpi) => acc + parseFloat(kpi.score), 0) / KPIs.length).toFixed(2);

					sessions.push({
						idKPI: session.idKPI,
						name: session.name,
						range: null,
						score: avgScore,
						exercises: KPIs
					});
					}

					resultado.push({
						ses_name: month.name, // Nombre del Mes
						ses_date: month.name,
						ses_id: mes,

						KPIs: sessions // Sesiones
					});
				}

				this.kpis_mensual = resultado;

				this.chartData = [];
				const exerciseData = {};
				console.log(resultado);
				resultado.forEach(mes => {
					mes.KPIs.forEach(kpi => {
						kpi.exercises.forEach(exercise => {
							if (!exerciseData[exercise.name]) {
								exerciseData[exercise.name] = {};
							}

							if (!exerciseData[exercise.name][mes.ses_name]) {
								exerciseData[exercise.name][mes.ses_name] = [];
							}

							exerciseData[exercise.name][mes.ses_name].push(parseFloat(exercise.score));
						});
					});
				});

				for (const [exerciseName, months] of Object.entries(exerciseData)) {
					const data = [];

					for (const [month, scores] of Object.entries(months)) {
						const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
						data.push({
							time: month,
							score: avgScore.toFixed(2)
						});
					}

					this.chartData.push({
						name: exerciseName,
						data: data,
					});
				}

			} catch (error) {
				console.error('Error al cargar KPIs mensuales:', error);
			}
		},
		async cargarKPIs_trimestral() {
			const loader = document.querySelector('.loader-container');
			if(loader){loader.style.display = 'flex';}

			let kpiPorMes = {};
			let kpiPorSesion = {};

			try {
				const ejercicios = await this.dao.exercise_has_session_has_actor_has_kpi.read();
				const ejerciciosFiltrados = ejercicios.filter(sesion =>
					this.actorIds.includes(sesion.Exercise_has_Session_has_Actor_Actor_idActor)
				);

				const kpiPromises = ejerciciosFiltrados.map(async element => {
					const indicadores = await this.dao.kpi.read();
					let indicador = indicadores.find(indic => indic.idKPI == element.KPI_idKPI);
					indicador.score = element.score;

					const sesiones = await this.dao.session.read();
					let sesion = sesiones.find(sesion =>
					sesion.idSession == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Ses_idSes
					);
					indicador.ses_date = sesion.date;
					indicador.ses_name = sesion.name;

					if (!kpiPorSesion[sesion.idSession]) {
					kpiPorSesion[sesion.idSession] = {
						name: sesion.name,
						date: sesion.date,
						[indicador.idKPI]: {
						idKPI: indicador.idKPI,
						name: indicador.name,
						scores: [],
						range: indicador.range,
						exercises: {}
						}
					};
					} else if (!kpiPorSesion[sesion.idSession][indicador.idKPI]) {
						kpiPorSesion[sesion.idSession][indicador.idKPI] = {
							idKPI: indicador.idKPI,
							name: indicador.name,
							scores: [],
							range: indicador.range,
							exercises: {}
						};
					}

					const ejerciciosResponse = await this.dao.exercise.read();
					let ejercicio = ejerciciosResponse.find(ex =>
					ex.idExercise == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Exer_idExer
					);
					indicador.ex_name = ejercicio.name;

					if (!kpiPorSesion[sesion.idSession][indicador.idKPI][ejercicio.idExercise]) {
					kpiPorSesion[sesion.idSession][indicador.idKPI][ejercicio.idExercise] = {
						id: ejercicio.idExercise,
						name: ejercicio.name,
						score: element.score,
					};
					}

					kpiPorSesion[sesion.idSession][indicador.idKPI].scores.push(element.score);
				});

				await Promise.all(kpiPromises);

				let resultado = [];

				// Preparar KPI Por Mes
				for (let ses in kpiPorSesion) {
					let sesion = kpiPorSesion[ses];
					let mes = this.cogerYearMonth(sesion.date);
					let trimestre = this.getTrimestre(mes);

					if (!kpiPorMes[trimestre]) {
						kpiPorMes[trimestre] = {
							name: trimestre,
							sessions: {}
						};
					}

					if (!kpiPorMes[trimestre].sessions[ses]) {
						kpiPorMes[trimestre].sessions[ses] = {
							idKPI: ses,
							name: sesion.name,
							date: sesion.date,
							scores: [],
							KPIs: {}  // Para almacenar los KPIs
						};
					}

					for (let idKPI in sesion) {
						let kpi = sesion[idKPI];

						if (kpi.scores) {
							let avgScoreKPI = (kpi.scores.reduce((a, b) => a + b, 0) / kpi.scores.length).toFixed(2);
							
							kpiPorMes[trimestre].sessions[ses].KPIs[idKPI] = {
								id: idKPI,
								name: kpi.name,
								score: avgScoreKPI,
								exercises: kpi.exercises,
								range: kpi.range,
							};

							kpiPorMes[trimestre].sessions[ses].scores.push(parseFloat(avgScoreKPI));
						}
					}
				}


				for (let mes in kpiPorMes) {
					let month = kpiPorMes[mes];
					let sessions = [];

					for (let ses in month.sessions) {
						let session = month.sessions[ses];
						let KPIs = [];

						for (let idKPI in session.KPIs) {
							KPIs.push(session.KPIs[idKPI]);
						}

						let avgScore = (KPIs.reduce((acc, kpi) => acc + parseFloat(kpi.score), 0) / KPIs.length).toFixed(2);

						sessions.push({
							idKPI: session.idKPI,
							name: session.name,
							range: null,
							score: avgScore,
							exercises: KPIs
						});
					}

					resultado.push({
						ses_name: month.name, // Nombre del Trimestre
						ses_date: month.name,
						ses_id: mes,

						KPIs: sessions // Sesiones
					});
				}

				this.kpis_trimestral = resultado;

				this.chartData = [];
				const exerciseData = {};

				resultado.forEach(mes => {
					mes.KPIs.forEach(kpi => {
						kpi.exercises.forEach(exercise => {
							if (!exerciseData[exercise.name]) {
								exerciseData[exercise.name] = {};
							}

							if (!exerciseData[exercise.name][mes.ses_name]) {
								exerciseData[exercise.name][mes.ses_name] = [];
							}

							exerciseData[exercise.name][mes.ses_name].push(parseFloat(exercise.score));
						});
					});
				});

				for (const [exerciseName, months] of Object.entries(exerciseData)) {
					const data = [];

					for (const [month, scores] of Object.entries(months)) {
						const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
						data.push({
							time: month,
							score: avgScore.toFixed(2)
						});
					}

					this.chartData.push({
						name: exerciseName,
						data: data,
					});
				}

			} catch (error) {
				console.error('Error al cargar KPIs mensuales:', error);
			}
		},
		async cargarGraficos() {			

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

				const promises = this.actorIds.map(id => this.dao.actor.read({ idActor: id }));
				this.actoresCompletos = await Promise.all(promises);

				console.log('Datos completos de los actores:', this.actoresCompletos);
				await this.cargarKPIs();
			} catch (error) {
				console.error('Error al cargar gráficos:', error);
			}
		}
	},
	watch: {
		modo(newModo) {
			this.cargarKPIs();
		}
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
		background-color: #85b4ff;
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

<style>
.loader-container {
  width: 300px;
  height: 300px;
  border: 1px solid grey;
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  display: flex;
}
.loader-container p {
  margin-top: 100px;
  font-weight: bold;
}
.dot-spinner {
  --uib-size: 2.8rem;
  --uib-speed: .9s;
  --uib-color: #183153;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: var(--uib-size);
  width: var(--uib-size);
}

.dot-spinner__dot {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
}

.dot-spinner__dot::before {
  content: '';
  height: 20%;
  width: 20%;
  border-radius: 50%;
  background-color: var(--uib-color);
  transform: scale(0);
  opacity: 0.5;
  animation: pulse0112 calc(var(--uib-speed) * 1.111) ease-in-out infinite;
  box-shadow: 0 0 20px rgba(18, 31, 53, 0.3);
}

.dot-spinner__dot:nth-child(2) {
  transform: rotate(45deg);
}

.dot-spinner__dot:nth-child(2)::before {
  animation-delay: calc(var(--uib-speed) * -0.875);
}

.dot-spinner__dot:nth-child(3) {
  transform: rotate(90deg);
}

.dot-spinner__dot:nth-child(3)::before {
  animation-delay: calc(var(--uib-speed) * -0.75);
}

.dot-spinner__dot:nth-child(4) {
  transform: rotate(135deg);
}

.dot-spinner__dot:nth-child(4)::before {
  animation-delay: calc(var(--uib-speed) * -0.625);
}

.dot-spinner__dot:nth-child(5) {
  transform: rotate(180deg);
}

.dot-spinner__dot:nth-child(5)::before {
  animation-delay: calc(var(--uib-speed) * -0.5);
}

.dot-spinner__dot:nth-child(6) {
  transform: rotate(225deg);
}

.dot-spinner__dot:nth-child(6)::before {
  animation-delay: calc(var(--uib-speed) * -0.375);
}

.dot-spinner__dot:nth-child(7) {
  transform: rotate(270deg);
}

.dot-spinner__dot:nth-child(7)::before {
  animation-delay: calc(var(--uib-speed) * -0.25);
}

.dot-spinner__dot:nth-child(8) {
  transform: rotate(315deg);
}

.dot-spinner__dot:nth-child(8)::before {
  animation-delay: calc(var(--uib-speed) * -0.125);
}

@keyframes pulse0112 {
  0%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }

  50% {
    transform: scale(1);
    opacity: 1;
  }
}

</style>