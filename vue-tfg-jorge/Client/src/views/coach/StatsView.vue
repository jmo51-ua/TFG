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
  
	  <div class="row">
		<div class="chart" v-for="(chart, index) in charts" :key="index">
		  <img :src="chart" alt="Chart Image">
		</div>
		<div class="chart">
			<button class="add-chart-button button" @click="addChart">
				Añadir nuevo registro
			</button>
		</div>
	  </div>
	</main>
</template>
  
<script>
  export default {
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
		]
	  };
	},
	methods: {
		addChart() {
			// Lógica para añadir una nueva gráfica
			this.charts.push('https://via.placeholder.com/300');
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
	}

	.chart img {
		max-width: 100%;
		height: auto;
		border-radius: 10px;
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

	@media (max-width: 600px) {
		.chart {
			flex: 1 1 100%;
		}
	}

</style>
  