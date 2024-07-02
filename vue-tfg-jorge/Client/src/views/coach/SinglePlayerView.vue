<template>

  <div class="grid-container">
    <div class="block player-info-container">
      <div class="player-pic">
        <img :src="informacion_jugador.photo || 'https://placehold.co/200x250'" alt="Player Picture">
        <h3 class="player-name">{{ playerName }}</h3>
      </div>
      <div class="player-data">
        <p class="player-data-line"><b>Fecha de nacimiento: </b>{{ informacion_jugador.birth || 'XXX' }}</p>
        <p class="player-data-line"><b>DNI: </b>{{ informacion_jugador.dni || 'XXX' }}</p>
        <p class="player-data-line"><b>Número de teléfono: </b>{{ informacion_jugador.phoneNumber || 'XXX' }}</p>
      </div>
    </div>
    
    <div class="block kpis-container">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z"/></svg>
        KPIs
      </div>

      <div class="list-container">
        <div v-for="(session, sessionIndex) in kpisJugador"
          :key="'session-' + sessionIndex"
        >
          <div @click="toggleDropdown(sessionIndex)" class="session-name">
            {{ session.ses_name }}
          </div>
          <transition name="dropdown">
            <div v-if="isDropdownOpen(sessionIndex)" class="kpi-dropdown">
              <div v-for="(kpi, kpiIndex) in session.KPIs"
                :key="'kpi-' + sessionIndex + '-' + kpiIndex"
              >
                <div
                  @click="toggleKpiDropdown(sessionIndex, kpiIndex)"
                  class="kpi-name"
                  :style="computedKPIStyle(kpi)"
                >
                {{ kpi.name }} - {{ kpi.score }}<span v-if="kpi.range"> / {{ kpi.range }}</span>
                </div>
                <transition name="dropdown">
                  <div v-if="isKpiDropdownOpen(sessionIndex, kpiIndex)" class="exercise-dropdown">
                    <div
                      v-for="(exercise, exerciseIndex) in Object.values(kpi.exercises)"
                      :key="'exercise-' + sessionIndex + '-' + kpiIndex + '-' + exerciseIndex"
                      class="exercise-item"
                      :style="computedKPIStyle(exercise)"
                    >
                      {{ exercise.name }} - {{ exercise.score }}<span v-if="exercise.range"> / {{ exercise.range }}</span>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
      
    </div>

    <div class="block dafo-container">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M240-40q-50 0-85-35t-35-85q0-50 35-85t85-35q14 0 26 3t23 8l57-71q-28-31-39-70t-5-78l-81-27q-17 25-43 40t-58 15q-50 0-85-35T0-580q0-50 35-85t85-35q50 0 85 35t35 85v8l81 28q20-36 53.5-61t75.5-32v-87q-39-11-64.5-42.5T360-840q0-50 35-85t85-35q50 0 85 35t35 85q0 42-26 73.5T510-724v87q42 7 75.5 32t53.5 61l81-28v-8q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-32 0-58.5-15T739-515l-81 27q6 39-5 77.5T614-340l57 70q11-5 23-7.5t26-2.5q50 0 85 35t35 85q0 50-35 85t-85 35q-50 0-85-35t-35-85q0-20 6.5-38.5T624-232l-57-71q-41 23-87.5 23T392-303l-56 71q11 15 17.5 33.5T360-160q0 50-35 85t-85 35ZM120-540q17 0 28.5-11.5T160-580q0-17-11.5-28.5T120-620q-17 0-28.5 11.5T80-580q0 17 11.5 28.5T120-540Zm120 420q17 0 28.5-11.5T280-160q0-17-11.5-28.5T240-200q-17 0-28.5 11.5T200-160q0 17 11.5 28.5T240-120Zm240-680q17 0 28.5-11.5T520-840q0-17-11.5-28.5T480-880q-17 0-28.5 11.5T440-840q0 17 11.5 28.5T480-800Zm0 440q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm240 240q17 0 28.5-11.5T760-160q0-17-11.5-28.5T720-200q-17 0-28.5 11.5T680-160q0 17 11.5 28.5T720-120Zm120-420q17 0 28.5-11.5T880-580q0-17-11.5-28.5T840-620q-17 0-28.5 11.5T800-580q0 17 11.5 28.5T840-540ZM480-840ZM120-580Zm360 120Zm360-120ZM240-160Zm480 0Z"/></svg>
        DAFO
      </div>

      <div class="dafo-stats">
        <div v-for="(item, key) in resultados_DAFO"
          :key="key"
          :id="key"
          class="dropdown-container"
          :class="{ 'expanded': activeItems[key] }"
        >
          <label :for="'touch-' + key"><span>{{ key }}</span></label>
          <input type="checkbox" :id="'touch-' + key" v-model="activeItems[key]" :value="key">

          <ul class="slide">
            <li v-for="(dafoItem, index) in item" :key="index" class="dafo-item" :id="key">{{ dafoItem }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="block charts-container">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z"/></svg>
        Gráficos
      </div>
      <div class="swiper-container">
        <swiper
          :slides-per-view="1"
          navigation
          pagination
          :observer="true"
          :observe-parents="true"
          :parallax="true"
        >
          <swiper-slide v-for="(chart, index) in chartData"
            :key="index"
            class="chart-item">
            <KpiChart
              :chartData="chart.data"
              :chartId="'chart-' + index"
              :chartName="chart.name">
            </KpiChart>
          </swiper-slide>

          <div class="swiper-pagination"></div>
          <SwiperNavButtons />
        </swiper>
      </div>
    </div>
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
</template>

<script>
import '@/assets/loader.css'
import { inject } from 'vue';
import KpiChart from '@/components/KpiChart.vue'
import { mapGetters } from 'vuex';
import * as ss from 'simple-statistics';

//swiper
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';
import SwiperNavButtons from '@/components/SwiperNavButtons.vue';

SwiperCore.use([Navigation, Pagination]);

export default {
  name: 'SinglePlayerView',
  components: {
    Swiper,
    SwiperSlide,
    SwiperNavButtons,
    KpiChart,
  },
  computed: {
    ...mapGetters(['modo']),
    playerName() {
      return this.$route.query.player || 'Unknown';
    },
    kpisJugador() {
      switch (this.modo) {
        case 'sesion':
          return this.kpis_jugador_sesion;
        case 'mensual':
          return this.kpis_jugador_mensual;
        case 'trimestral':
          return this.kpis_jugador_trimestral;
        default:
          return [];
      }
    }
  },
  mounted() {
		this.$nextTick(() => {
			const loader = document.querySelector('.loader-container');
			loader.style.display = 'flex';
		});
	},
  data() {
    return {
      dafo: [
        [
          {name: "Baja Recuperación de Balón en Mediocampo"},
          {name: "Rendimiento como suplente"},
          {name: "Puntos obtenidos contra equipos top 5"},
        ],
        [
          {name: "Número de jugadores competentes en la misma posición"},
          {name: "Faltas cometidas"},
        ],
        [
          {name: "tasa de Conversión de Goles"},
          {name: "Efectividad jeugo aéreo"},
        ],
        [
          {name: "Rendimiento en direrentes posiciones"},
        ],
      ],
      informacion_jugador: [],

      kpis_jugador_sesion: [],
      kpis_jugador_mensual: [],
      kpis_jugador_trimestral: [],
      kpis_jugador_all: [],
      chartData: [],

      openSessions: [],
      openKpis: [],

      resultados_DAFO : {
        "Fortalezas": [],
        "Debilidades": [],
        "Oportunidades": [],
        "Amenazas": []
      },
      activeItems: {
        Debilidades: false,
        Amenazas: false,
        Fortalezas: false,
        Oportunidades: false
      },
    };
  },
  setup() {
    const app = inject('app');
    const dao = inject('dao');
    return { app, dao };
  },
  methods: {
    toggleDropdown(index) {
      if (this.openSessions.includes(index)) {
        this.openSessions = this.openSessions.filter(i => i !== index);
      } else {
        this.openSessions.push(index);
      }
    },
    isDropdownOpen(index) {
      return this.openSessions.includes(index);
    },
    computedKPIStyle(kpi) {
      if (kpi.score && kpi.range ) {
        return {
          backgroundColor: this.calculateColorKPI(kpi.score.toString(), kpi.range.toString()) + ' !important',
          color: this.getTextColorKPI(kpi.score.toString(), kpi.range.toString()) + ' !important'
        };
      }
      return {
        backgroundColor: 'white' + ' !important',
        color: 'black' + ' !important',
      };
    },
    toggleKpiDropdown(sessionIndex, kpiIndex) {
      const key = `${sessionIndex}-${kpiIndex}`;
      if (this.openKpis.includes(key)) {
        this.openKpis = this.openKpis.filter(i => i !== key);
      } else {
        this.openKpis.push(key);
      }
    },
    isKpiDropdownOpen(sessionIndex, kpiIndex) {
      return this.openKpis.includes(`${sessionIndex}-${kpiIndex}`);
    },
    getColorForPercentage(pct) {
      var percentColors = [
        { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
        { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
        { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } }
      ];
      for (var i = 1; i < percentColors.length - 1; i++) {
          if (pct < percentColors[i].pct) {
              break;
          }
      }
      var lower = percentColors[i - 1];
      var upper = percentColors[i];
      var range = upper.pct - lower.pct;
      var rangePct = (pct - lower.pct) / range;
      var pctLower = 1 - rangePct;
      var pctUpper = rangePct;
      var color = {
          r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
          g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
          b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
      };
      return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
      // or output as hex if preferred
    },
    calculateColorKPI(score, target) {
      const scoreValue = parseFloat(score.replace('%', ''));
      const targetValue = parseFloat(target.replace('%', ''));

      const ratio = scoreValue / targetValue;

      return this.getColorForPercentage(ratio);
    },
    getTextColorKPI(score, target) {
      const scoreValue = parseFloat(score.replace('%', ''));
      const targetValue = parseFloat(target.replace('%', ''));

      let red, green;

      if (scoreValue <= targetValue) {
        const ratio = scoreValue / targetValue;
        red = 255;
        green = Math.round(255 * ratio);
      } else {
        const ratio = (scoreValue - targetValue) / (100 - targetValue);
        red = Math.round(255 * (1 - ratio));
        green = 255;
      }

      const brightness = (red * 299 + green * 587 + 0 * 114) / 1000;

      return brightness > 128 ? '#000000' : '#FFFFFF';
    },
    cogerYearMonth(date){
      const dateFormat = new Date(date);
      const year = dateFormat.getFullYear();
      const month = String(dateFormat.getMonth() + 1).padStart(2, '0');

      return `${year}-${month}`;
    },
    getTrimestre(mes) {
      const month = parseInt(mes.split('-')[1], 10);
      if (month >= 1 && month <= 3) {
        return `${mes.split('-')[0]}-T1`;
      } else if (month >= 4 && month <= 6) {
        return `${mes.split('-')[0]}-T2`;
      } else if (month >= 7 && month <= 9) {
        return `${mes.split('-')[0]}-T3`;
      } else if (month >= 10 && month <= 12) {
        return `${mes.split('-')[0]}-T4`;
      }
    },
    convertir_a_gpa(puntaje, rango) {
        if (puntaje >= 0.75 * rango) {
            return 4.0; // A (Fortaleza)
        } else if (puntaje >= 0.50 * rango) {
            return 3.0; // B (Oportunidad)
        } else if (puntaje >= 0.25 * rango) {
            return 2.0; // C (Amenaza)
        } else {
            return 1.0; // D (Debilidad)
        }
    },
    desviacion_estandar(arr) {
      let mean = arr.reduce((acc, curr) => {
        return acc + curr
      }, 0) / arr.length;

      arr = arr.map((k) => {
        return (k - mean) ** 2
      });

      let sum = arr.reduce((acc, curr) => acc + curr, 0);

      let variance = sum / arr.length

      return Math.sqrt(sum / arr.length)
    },
    determinarTramo(porcentaje, representatividad) {
      for (const [limite, descripcion] of Object.entries(representatividad)) {
        
        if (porcentaje <= limite) {
          return descripcion;
        }
      }
      return "Tramo no encontrado";
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

    
    async getPlayerInfo() {
      try {
        const response = await this.dao.actor.read();
        this.informacion_jugador = response.find(actor => actor.idActor == this.$route.query.idActor);
        
        if (this.informacion_jugador) {
          console.log('Info Jugador: ', this.informacion_jugador.idActor);
        } else {
          console.log('No se encontró información para el jugador con id:', this.$route.query.idActor);
        }
      } catch (error) {
        console.error('Error al obtener la información del jugador:', error);
      }
    },

    async cargarKPIs() {
      const loader = document.querySelector('.loader-container');
			if(loader) {loader.style.display = 'flex';}

      this.kpis_jugador_sesion= [];
      this.kpis_jugador_mensual= [];
      this.kpis_jugador_trimestral= [];
      this.kpis_jugador_all= [];
      this.chartData= [];
      this.resultados_DAFO = {
        "Fortalezas": [],
        "Debilidades": [],
        "Oportunidades": [],
        "Amenazas": []
      };

      const methodName = `cargarKPIs_${this.modo}`;
      if (typeof this[methodName] === 'function') {
        await this[methodName]();
        const loader = document.querySelector('.loader-container');
			  if(loader){loader.style.display = 'none';}
      } else {
        console.error(`Method ${methodName} does not exist`);
      }
    },
    async cargarKPIs_sesion() {
      try {
        const ejercicios = await this.dao.exercise_has_session_has_actor_has_kpi.read();
        const ejerciciosFiltrados = ejercicios.filter(sesion =>
          sesion.Exercise_has_Session_has_Actor_Actor_idActor == this.$route.query.idActor
        );

        let kpiPorSesion = {};

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
              ses_id: sesion.idSession,
              [indicador.idKPI]: {
                idKPI: indicador.idKPI,
                name: indicador.name,
                scores: [],
                range: indicador.range,
              }
            };
          } else {
            if (!kpiPorSesion[sesion.idSession][indicador.idKPI]) {
              kpiPorSesion[sesion.idSession][indicador.idKPI] = {
                idKPI: indicador.idKPI,
                name: indicador.name,
                scores: [],
                range: indicador.range,
                exercises: {} 
              };
            }
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

        // promedio score para cada KPI
        let resultado = [];

        for (let sesion in kpiPorSesion) {
          let KPIs = [];
          for (let idKPI in kpiPorSesion[sesion]) {
            let kpi = kpiPorSesion[sesion][idKPI];

            if (kpi.scores) {
              let avgScore = (kpi.scores.reduce((a, b) => a + b, 0) / kpi.scores.length).toFixed(2);
              let exercises = {};

              for (let ex in kpi) {
                let ejercicio = kpi[ex];
                if (ejercicio.name) {
                  if (!exercises[ejercicio.id]) {
                    exercises[ejercicio.id] = {
                      name: ejercicio.name,
                      score: ejercicio.score,
                    };
                  }
                }
              }

              KPIs.push({
                idKPI: kpi.idKPI,
                name: kpi.name, // Nombre KPI, Sesion o Mes (sesion, mensual, trimestral)
                range: kpi.range,
                score: avgScore,
                exercises: exercises, // Ejercicios, KPIs o Sesiones (sesion, mensual, trimestral)
              });
            }
          }

          resultado.push({
            ses_name: kpiPorSesion[sesion].name, // Nombre Sesion, Mes, Trimestre (sesion, mensual, trimestral)
            ses_date: kpiPorSesion[sesion].date,
            ses_id: kpiPorSesion[sesion].ses_id,

            KPIs: KPIs
          });
        }

        console.log('KPIs agrupados por kpis_jugador_sesion:', resultado);
        this.kpis_jugador_sesion = resultado;

        this.chartData = [];
        const kpiData = {};

        this.kpis_jugador_sesion.forEach(session => {
          session.KPIs.forEach(kpi => {

            if (!kpiData[kpi.name]) {
              kpiData[kpi.name] = {
                data: [],
                range: kpi.range
              };
            }

            kpiData[kpi.name].data.push({
              time: session.ses_name,
              score: kpi.score
            });
          });
        });

        for (const [key, value] of Object.entries(kpiData)) {
          this.chartData.push({
            name: key,
            data: value.data,
            range: value.range
          });
        }

        await this.cargarDAFO();
      } catch (error) {
        console.error('Error al cargar KPIs de sesión:', error);
      }
    },
    async cargarKPIs_mensual() {
      try {
        const ejercicios = await this.dao.exercise_has_session_has_actor_has_kpi.read();
        const ejerciciosFiltrados = ejercicios.filter(sesion =>
          sesion.Exercise_has_Session_has_Actor_Actor_idActor == this.$route.query.idActor
        );

        let kpiPorMes = {};
        let kpiPorSesion = {};

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
              ses_id: sesion.idSession,
              [indicador.idKPI]: {
                idKPI: indicador.idKPI,
                name: indicador.name,
                scores: [],
                range: indicador.range,
              }
            };
          } else {
            if (!kpiPorSesion[sesion.idSession][indicador.idKPI]) {
              kpiPorSesion[sesion.idSession][indicador.idKPI] = {
                idKPI: indicador.idKPI,
                name: indicador.name,
                scores: [],
                range: indicador.range,
                exercises: {} 
              };
            }
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

            console.log(avgScore);

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

        this.kpis_jugador_mensual = resultado;

        this.chartData = [];
        const kpiData = {};

        this.kpis_jugador_mensual.forEach(mes => {
          mes.KPIs.forEach(kpi => {

            if (!kpiData[kpi.name]) {
              kpiData[kpi.name] = {
                data: [],
                range: kpi.range
              };
            }

            kpiData[kpi.name].data.push({
              time: mes.ses_name,
              score: kpi.score
            });
          });
        });

        for (const [key, value] of Object.entries(kpiData)) {
          this.chartData.push({
            name: key,
            data: value.data,
            range: value.range
          });
        }

        await this.cargarDAFO();
      } catch (error) {
        console.error("Error al cargar KPIs mensuales:", error);
      }
    },
    async cargarKPIs_trimestral() {
      try {
        const ejercicios = await this.dao.exercise_has_session_has_actor_has_kpi.read();
        const ejerciciosFiltrados = ejercicios.filter(sesion =>
          sesion.Exercise_has_Session_has_Actor_Actor_idActor == this.$route.query.idActor
        );

        let kpiPorTrimestre = {};
        let kpiPorSesion = {};

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
              ses_id: sesion.idSession,
              [indicador.idKPI]: {
                idKPI: indicador.idKPI,
                name: indicador.name,
                scores: [],
                range: indicador.range,
              }
            };
          } else {
            if (!kpiPorSesion[sesion.idSession][indicador.idKPI]) {
              kpiPorSesion[sesion.idSession][indicador.idKPI] = {
                idKPI: indicador.idKPI,
                name: indicador.name,
                scores: [],
                range: indicador.range,
                exercises: {} 
              };
            }
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

        // Preparar KPI Por Trimestre
        for (let ses in kpiPorSesion) {
          let sesion = kpiPorSesion[ses];
          let mes = this.cogerYearMonth(sesion.date);
          let trimestre = this.getTrimestre(mes);

          if (!kpiPorTrimestre[trimestre]) {
            kpiPorTrimestre[trimestre] = {
              name: trimestre,
              sessions: {}
            };
          }

          if (!kpiPorTrimestre[trimestre].sessions[ses]) {
            kpiPorTrimestre[trimestre].sessions[ses] = {
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
              
              kpiPorTrimestre[trimestre].sessions[ses].KPIs[idKPI] = {
                id: idKPI,
                name: kpi.name,
                score: avgScoreKPI,
                exercises: kpi.exercises,
                range: kpi.range,
              };

              kpiPorTrimestre[trimestre].sessions[ses].scores.push(parseFloat(avgScoreKPI));
            }
          }
        }

        for (let trimestre in kpiPorTrimestre) {
          let quarter = kpiPorTrimestre[trimestre];
          let sessions = [];

          for (let ses in quarter.sessions) {
            let session = quarter.sessions[ses];
            let KPIs = [];

            for (let idKPI in session.KPIs) {
              KPIs.push(session.KPIs[idKPI]);
            }

            let avgScore = (KPIs.reduce((acc, kpi) => acc + parseFloat(kpi.score), 0) / KPIs.length).toFixed(2);

            console.log(avgScore);

            sessions.push({
              idKPI: session.idKPI,
              name: session.name,
              range: null,
              score: avgScore,
              exercises: KPIs
            });
          }

          resultado.push({
            ses_name: quarter.name, // Nombre del Mes
            ses_date: quarter.name,
            ses_id: trimestre,

            KPIs: sessions // Sesiones
          });

        }

        this.kpis_jugador_trimestral = resultado;

        this.chartData = [];
        const kpiData = {};

        this.kpis_jugador_trimestral.forEach(trimestre => {
          trimestre.KPIs.forEach(kpi => {

            if (!kpiData[kpi.name]) {
              kpiData[kpi.name] = {
                data: [],
                range: kpi.range
              };
            }

            kpiData[kpi.name].data.push({
              time: trimestre.ses_name,
              score: kpi.score
            });
          });
        });

        for (const [key, value] of Object.entries(kpiData)) {
          this.chartData.push({
            name: key,
            data: value.data,
            range: value.range
          });
        }

        await this.cargarDAFO();
      } catch (error) {
        console.error("Error al cargar KPIs mensuales:", error);
      }
    },

    cargarDAFO_promedioGPA(){
      this.chartData.forEach(kpi => {
        const puntajes = kpi.data.map(d => parseFloat(d.score));
        const rango = kpi.range;
        const gpa_puntos = puntajes.map(puntaje => this.convertir_a_gpa(puntaje, rango));

        const total = gpa_puntos.reduce((sum, value) => sum + value, 0);
        const promedio_gpa = total / gpa_puntos.length;

        if (promedio_gpa >= 3.5) {
            this.resultados_DAFO.Fortalezas.push(`${kpi.name}: Promedio GPA alto`);
        } else if (promedio_gpa >= 2.5) {
          this.resultados_DAFO.Oportunidades.push(`${kpi.name}: Promedio GPA moderado`);
        } else if (promedio_gpa >= 1.5) {
          this.resultados_DAFO.Amenazas.push(`${kpi.name}: Promedio GPA bajo`);
        } else {
          this.resultados_DAFO.Debilidades.push(`${kpi.name}: Promedio GPA muy bajo`);
        }

      });
    },
    cargarDAFO__Desviacion(){
      this.chartData.forEach(kpi => {
        const puntajes = [20, 25, 30, 18, 27, 33, 29, 24, 35, 31];
        const rango = kpi.range;
        
        const n = puntajes.length;
        const mean = puntajes.reduce((a, b) => a + b) / n;
        const desviacionEstandar = this.desviacion_estandar(puntajes);
        const porcentajeDesviacion = (desviacionEstandar / rango) * 100;
        const representatividadCV = {
          [14]: "Fortaleza:Mucha constancia",
          [22]: "Oportunidad:Puede ser más constante",
          [29]: "Amenaza:Constancia irregular",
          [100]: "Debilidad:Sus datos no son nada constantes"
        };

        const tramoDesviacion = this.determinarTramo(porcentajeDesviacion, representatividadCV);

        if (tramoDesviacion.startsWith("Fortaleza")) {
            this.resultados_DAFO.Fortalezas.push(`${kpi.name}: ${tramoDesviacion.split(':')[1]}`);
        } else if (tramoDesviacion.startsWith("Debilidad")) {
            this.resultados_DAFO.Debilidades.push(`${kpi.name}: ${tramoDesviacion.split(':')[1]}`);
        } else if (tramoDesviacion.startsWith("Oportunidad")) {
            this.resultados_DAFO.Oportunidades.push(`${kpi.name}: ${tramoDesviacion.split(':')[1]}`);
        } else if (tramoDesviacion.startsWith("Amenaza")) {
            this.resultados_DAFO.Amenazas.push(`${kpi.name}: ${tramoDesviacion.split(':')[1]}`);
        }      

      });
    },
    cargarDAFO_Pendiente(){
      this.chartData.forEach(kpi => {
        const puntajes = kpi.data.map(d => parseFloat(d.score));
        const tiempos = Array.from({ length: puntajes.length }, (_, i) => i + 1);

        const regression = ss.linearRegression(tiempos.map((time, index) => [time, puntajes[index]]));
        const slope = regression.m;

        const media = ss.mean(puntajes);
        const desviacion_estandar = ss.standardDeviation(puntajes);

        // Regla empírica
        const umbral1 = media + desviacion_estandar;  // 68%
        const umbral2 = media + 2 * desviacion_estandar;  // 95%
        const umbral3 = media + 3 * desviacion_estandar;  // 99.7%

        if (slope > 0) {//Creciente
          if (media > umbral1) {
            this.resultados_DAFO.Fortalezas.push(`${kpi.name}: Rendimiento en aumento y sólido.`);
          } else {
            this.resultados_DAFO.Oportunidades.push(`${kpi.name}: Tendencia de mejora que aún no es fuerte pero tiene potencial.`);
          }
        } else {//Decreciente
          if (media < (media - desviacion_estandar)) {
            this.resultados_DAFO.Debilidades.push(`${kpi.name}: Rendimiento decreciente y problemático.`);
          } else {
            this.resultados_DAFO.Amenazas.push(`${kpi.name}: Tendencia decreciente que aún no es fuerte pero es preocupante.`);
          }
        }
      });
    },
    cargarDAFO_Cambios_Temporales(){
      this.chartData.forEach(kpi => {
        const puntajes = kpi.data.map(d => parseFloat(d.score));

        const compararSesiones = (puntajes) => {
          let cambios = [];
          for (let i = 1; i < puntajes.length; i++) {
            const cambio = ((puntajes[i] - puntajes[i - 1]) / puntajes[i - 1]) * 100;
            cambios.push(cambio);
          }
          return cambios;
        };

        const cambiosSesiones = compararSesiones(puntajes);
        const cambios_positivos = cambiosSesiones.filter(cambio => cambio > 0);
        const cambios_negativos = cambiosSesiones.filter(cambio => cambio < 0);

        if (cambios_positivos.length > cambios_negativos.length) {
          this.resultados_DAFO.Oportunidades.push(`${kpi.name}: Tiende a mejorar entre sesiones`);
        } else if (cambios_positivos.length < cambios_negativos.length){
          this.resultados_DAFO.Debilidades.push(`${kpi.name}:  a empeorar entre sesiones`);
        } else {
          this.resultados_DAFO.Amenazas.push(`${kpi.name}: No mejora entre sesiones`);
        }
      });
    },
    cargarDAFO(){
      this.cargarDAFO_promedioGPA();
      this.cargarDAFO__Desviacion();
      this.cargarDAFO_Pendiente();
      this.cargarDAFO_Cambios_Temporales();
    },
  },
  watch: {
    modo(newModo) {
      this.cargarKPIs();
    }
  },
  created() {
    this.getPlayerInfo();
    this.cargarKPIs();
  }
};
</script>

<style scoped>
  .grid-container {
    display: grid;
    grid-template-areas: 
        "player-info-container kpis-container kpis-container"
        "dafo-container charts-container charts-container";
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 30px;
    width: 90%;
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

  .player-pic h3{
    padding-top: 10px;
    padding-bottom: 20px;
  }

  .list-container {
    width: 100%;
    height: 100%;
    overflow-y: auto; 
    padding-right: 10px; 
    box-sizing: border-box;
  }

  .session-name {
    cursor: pointer;
    font-weight: bold;
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
    background: rgb(44, 160, 238);
    border: 1px solid grey;
  }

  .session-name:hover {
    background-color: rgb(125, 196, 243);
  }

  .kpi-dropdown {
    margin-left: 20px;
  }

  .kpi-name {
    cursor: pointer;
    font-weight: bold;
    margin: 5px 0;
    padding: 8px;
    border-radius: 5px;
    background: rgb(44, 238, 196);
    border: 1px solid grey;
  }

  .kpi-name:hover {
    background-color: rgb(169, 240, 224);
  }

  .exercise-dropdown {
    margin-left: 20px;
  }

  .exercise-item {
    margin: 3px 0;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid grey;
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
    justify-content: space-between;
    transition: background-color 0.3s;
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
    flex-direction: row;
  }

  .name {
    color: #000000;
    font-weight: bold;
  }

  .block p{
    font-weight: lighter;
  }

  .player-info-container{
    grid-area: player-info-container;
    overflow: auto;
    display: flex;
    flex-direction: column;
    min-height: 500px;
  }
  .kpis-container{
    grid-area:kpis-container;
    max-height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* DAFO */
  .dafo-container {
    grid-area: dafo-container;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
    box-sizing: border-box;
  }

  .dafo-stats{
    display: grid;
    grid-template-areas: 
      "debilidades amenazas"
      "fortalezas oportunidades";
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding: 20px;
  }
  .dropdown-container {
    background: #d9d9d9;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    max-height: 50px;
  }

  .dropdown-container.expanded {
    max-height: 500px;
  }

  .dropdown-container span {
    padding: 15px 30px;
    background: #30312d;
    color: white;
    font-size: 1.2em;
    font-variant: small-caps;
    cursor: pointer;
    display: block;
    position: relative;
  }

  .dropdown-container span::after {
    content: "+";
    position: absolute;
    right: 15px;
    transition: transform 0.3s ease;
  }

  .dropdown-container.expanded span::after{
    content: "-";
  }

  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    height: 0;
  }

  .slide {
    max-height: 0;
    overflow: auto;
    transition: max-height 0.3s ease;
  }

  .dropdown-container.expanded .slide {
    max-height: 500px;
  }

  .slide li {
    padding: 15px 30px;
    list-style-type: none;
  }

  input[type="checkbox"]:checked + .slide {
    max-height: 500px;
  }

  input[type="checkbox"]:checked + span::after {
    transform: rotate(45deg);
  }

  #Debilidades span{
    background-color: #e20017;
  }
  #Debilidades {
    grid-area: debilidades;
    background-color: #dc3545;
  }

  #Amenazas span{
    background-color: #c79500;
  }
  #Amenazas {
    background-color: #ffc107;
  }

  #Fortalezas span{
    background-color: #007a1d;
  }
  #Fortalezas {
    background-color: #28a745;
  }

  #Oportunidades span{
    background-color: #0062a3;
  }
  #Oportunidades {
    background-color: #17a2b8;
  }

  .dropdown-enter-active, .dropdown-leave-active {
    transition: max-height 0.3s ease, opacity 0.3s ease;
  }

  .dropdown-enter, .dropdown-leave-to {
    max-height: 0;
    opacity: 0;
  }


  /* GRAFICOS */
  .swiper-container {
    width: 100%;
    height: 100%;
  }
  .charts-container{
    grid-area:charts-container;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
    box-sizing: border-box;
  }

  .chart-item {
    width: 80%;
    height: 80%;
  }

</style>