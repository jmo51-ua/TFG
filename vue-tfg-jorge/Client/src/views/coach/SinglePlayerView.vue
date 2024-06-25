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
        <div v-for="(session, sessionIndex) in kpisJugador" :key="'session-' + sessionIndex">
          <div @click="toggleDropdown(sessionIndex)" class="session-name">
            {{ session.ses_name }}
          </div>
          <transition name="dropdown">
            <div v-if="isDropdownOpen(sessionIndex)" class="kpi-dropdown">
              <div v-for="(kpi, kpiIndex) in kpisJugador" :key="'kpi-' + sessionIndex + '-' + kpiIndex">
                <div @click="toggleKpiDropdown(sessionIndex, kpiIndex)" class="kpi-name">
                  {{ kpi.name }} - {{ kpi.score }}
                </div>
                <transition name="dropdown">
                  <div v-if="isKpiDropdownOpen(sessionIndex, kpiIndex)" class="exercise-dropdown">
                    <div v-for="(exercise, exerciseIndex) in kpi.exercises" :key="'exercise-' + sessionIndex + '-' + kpiIndex + '-' + exerciseIndex" class="exercise-item">
                      {{ exercise.name }} - {{ exercise.score }}
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
        <div class="debilidades">
          <h3>Debilidades</h3>
          <div class="dafo-list">
            <div v-for="(item, index) in resultados_DAFO.Debilidades" :key="index" class="dafo-item weakness">{{ item }}</div>
          </div>
        </div>
        <div class="amenazas">
          <h3>Amenazas</h3>
          <div class="dafo-list">
            <div v-for="(item, index) in resultados_DAFO.Amenazas" :key="index" class="dafo-item threat">{{ item }}</div>
          </div>
        </div>
        <div class="fortalezas">
          <h3>Fortalezas</h3>
          <div class="dafo-list">
            <div v-for="(item, index) in resultados_DAFO.Fortalezas" :key="index" class="dafo-item strength">{{ item }}</div>
          </div>
        </div>
        <div class="oportunidades">
          <h3>Oportunidades</h3>
          <div class="dafo-list">
            <div v-for="(item, index) in resultados_DAFO.Oportunidades" :key="index" class="dafo-item opportunity">{{ item }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="block charts-container">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z"/></svg>
        Gráficos
      </div>
      <div class="list-container">
        <div v-for="(chart, index) in chartData" :key="index" class="chart-item">
          <KpiChart :chartData="chart.data" :chartId="'chart-' + index" :chartName="chart.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue';
import KpiChart from '@/components/KpiChart.vue'
import { mapGetters } from 'vuex';

export default {
  name: 'SinglePlayerView',
  components: {
    KpiChart
  },
  computed: {
    ...mapGetters(['modo']),
    playerName() {
      return this.$route.query.player || 'Unknown';
    },
    kpisJugador() {
      switch (this.modo) {
        case 'sesion':
          console.log(this.kpis_jugador_sesion)
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
      chartData_sesion: [],
      chartData_mensual: [],
      chartData_trimestral: [],
      chartData_all: [],

      openSessions: [],
      openKpis: [],

      resultados_DAFO : {
        "Fortalezas": [],
        "Debilidades": [],
        "Oportunidades": [],
        "Amenazas": []
      }      
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
    getPlayerInfo(){
      this.dao.actor.read().then((response) => {
        this.informacion_jugador = response.filter(actor =>
          actor.idActor == this.$route.query.idActor
        )[0];
        
        console.log('Info Jugador: ', this.informacion_jugador.idActor);
      });
    },

    cargarKPIs_sesion() {

      this.dao.exercise_has_session_has_actor_has_kpi.read().then((ejercicios) => {
        ejercicios = ejercicios.filter(sesion =>
          sesion.Exercise_has_Session_has_Actor_Actor_idActor == this.$route.query.idActor
        );

        let kpiPorSesion = {};

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

              if (!kpiPorSesion[sesion.idSession]) {
                kpiPorSesion[sesion.idSession] = {};
                kpiPorSesion[sesion.idSession].name = sesion.name;
                kpiPorSesion[sesion.idSession].date = sesion.date;
              }

              if (!kpiPorSesion[sesion.idSession][indicador.idKPI]) {
                kpiPorSesion[sesion.idSession][indicador.idKPI] = {
                  idKPI: indicador.idKPI,
                  name: indicador.name,
                  scores: [],
                  range: indicador.range,
                };
              }

              return this.dao.exercise.read().then((ejercicios) => {
                let ejercicio = ejercicios.find(ex =>
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
            });
          });
        });

        Promise.all(kpiPromises).then((result) => {
          // promedio score para cada KPI
          let resultado = [];

          for (let sesion in kpiPorSesion) {
            
            for (let idKPI in kpiPorSesion[sesion]) {
              let kpi = kpiPorSesion[sesion][idKPI];
              
              if(kpi.scores){
                let avgScore = (kpi.scores.reduce((a, b) => a + b, 0) / kpi.scores.length).toFixed(2);
                let exercises = {};

                for (let ex in kpi) {
                  let ejercicio = kpi[ex];
                  if(ejercicio.name){

                    if(!exercises[ejercicio.id]){
                      exercises[ejercicio.id]={
                        name: ejercicio.name,
                        score: ejercicio.score,
                      };
                    }
                  }
                }

                resultado.push({
                  ses_name: kpiPorSesion[sesion].name, //Nombre Sesion, Mes, Trimestre (sesion, mensual, trimestral)
                  ses_date: kpiPorSesion[sesion].date,
                  score: avgScore,

                  idKPI: kpi.idKPI,
                  name: kpi.name, //Nombre KPI, Sesion o Mes (sesion, mensual, trimestral)
                  range: kpi.range,

                  exercises: exercises, //Ejercicios, KPIs o Sesiones (sesion, mensual, trimestral)

                  ex_name: kpiPorSesion[sesion].name,
                });
              }
            }
          }
          this.kpis_jugador_sesion = resultado;

          this.chartData = [];
          const kpiData = {};

          this.kpis_jugador_sesion.forEach(indicador => {
            if (!kpiData[indicador.name]) {
                kpiData[indicador.name] = {
                    data: [],
                    range: indicador.range
                };
            }
            kpiData[indicador.name].data.push({
                time: indicador.ses_name,
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

          this.cargarDAFO();
        });
      });
    },
    cogerYearMonth(date){
      const dateFormat = new Date(date);
      const year = dateFormat.getFullYear();
      const month = String(dateFormat.getMonth() + 1).padStart(2, '0');

      return `${year}-${month}`;
    },
    cargarKPIs_mensual(){

      this.dao.exercise_has_session_has_actor_has_kpi.read().then((ejercicios) => {

        //Ejercicios que involucran al Jugador
        ejercicios = ejercicios.filter(sesion =>
          sesion.Exercise_has_Session_has_Actor_Actor_idActor == this.$route.query.idActor
        );
        

        let kpiPorMes = {};

        let kpiPromises = ejercicios.map(element => {
          return this.dao.kpi.read().then((indicadores) => {
            let indicador = indicadores.filter(indic =>
              indic.idKPI == element.KPI_idKPI
            )[0];
            indicador.score = element.score;

            return this.dao.session.read().then((sesiones) => {
              let sesion = sesiones.filter(sesion =>
                sesion.idSession == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Ses_idSes
              )[0];
              let mes = this.cogerYearMonth(sesion.date);

              if (!kpiPorMes[mes]) {
                kpiPorMes[mes] = {};
              }

              if (!kpiPorMes[mes][indicador.idKPI]) {
                kpiPorMes[mes][indicador.idKPI] = {
                  idKPI: indicador.idKPI,
                  name: indicador.name,
                  scores: [],
                  range: indicador.range,
                };
              }

              kpiPorMes[mes][indicador.idKPI].scores.push(indicador.score);
              
            });
          });
        });
        
        Promise.all(kpiPromises).then(() => {
          // promedio score para cada KPI
          let resultado = [];

          for (let mes in kpiPorMes) {
            for (let idKPI in kpiPorMes[mes]) {
              let kpi = kpiPorMes[mes][idKPI];
              let avgScore = kpi.scores.reduce((a, b) => a + b, 0) / kpi.scores.length;

              let year = mes.split('-')[0];
              let month = mes.split('-')[1];

              resultado.push({
                idKPI: kpi.idKPI,
                name: kpi.name,
                date: mes,
                score: avgScore,
                ex_name: month,
                ses_name: year,
                range: kpi.range,
              });
            }
          }

          console.log('KPIs agrupados por mes:', resultado);
          this.kpis_jugador_mensual = resultado;

          this.chartData = [];
          let kpiData = {};

          this.kpis_jugador_mensual.forEach(indicador => {
            if (!kpiData[indicador.name]) {
              kpiData[indicador.name] = [];
            }
            kpiData[indicador.name].push({
              time: indicador.date,
              score: indicador.score
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
    getTrimestre(mes) {
      const month = parseInt(mes.split('-')[1], 10);
      if (month >= 1 && month <= 3) {
        return `${mes.split('-')[0]}-Q1`;
      } else if (month >= 4 && month <= 6) {
        return `${mes.split('-')[0]}-Q2`;
      } else if (month >= 7 && month <= 9) {
        return `${mes.split('-')[0]}-Q3`;
      } else if (month >= 10 && month <= 12) {
        return `${mes.split('-')[0]}-Q4`;
      }
    },
    cargarKPIs_trimestral() {
      this.dao.exercise_has_session_has_actor_has_kpi.read().then((ejercicios) => {

        // Ejercicios que involucran al Jugador
        ejercicios = ejercicios.filter(sesion =>
          sesion.Exercise_has_Session_has_Actor_Actor_idActor == this.$route.query.idActor
        );

        let kpiPorTrimestre = {};

        let kpiPromises = ejercicios.map(element => {
          return this.dao.kpi.read().then((indicadores) => {
            let indicador = indicadores.filter(indic =>
              indic.idKPI == element.KPI_idKPI
            )[0];
            indicador.score = element.score;

            return this.dao.session.read().then((sesiones) => {
              let sesion = sesiones.filter(sesion =>
                sesion.idSession == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Ses_idSes
              )[0];
              let mes = this.cogerYearMonth(sesion.date);
              let trimestre = this.getTrimestre(mes);

              if (!kpiPorTrimestre[trimestre]) {
                kpiPorTrimestre[trimestre] = {};
              }

              if (!kpiPorTrimestre[trimestre][indicador.idKPI]) {
                kpiPorTrimestre[trimestre][indicador.idKPI] = {
                  idKPI: indicador.idKPI,
                  name: indicador.name,
                  scores: [],
                  range: indicador.range,
                };
              }

              kpiPorTrimestre[trimestre][indicador.idKPI].scores.push(indicador.score);
            });
          });
        });

        Promise.all(kpiPromises).then(() => {
          // Promedio score para cada KPI por trimestre
          let resultado = [];

          for (let trimestre in kpiPorTrimestre) {
            for (let idKPI in kpiPorTrimestre[trimestre]) {
              let kpi = kpiPorTrimestre[trimestre][idKPI];
              let avgScore = kpi.scores.reduce((a, b) => a + b, 0) / kpi.scores.length;

              let year = trimestre.split('-')[0];
              let quarter = trimestre.split('-')[1];

              resultado.push({
                idKPI: kpi.idKPI,
                name: kpi.name,
                date: trimestre,
                trimestre: trimestre,
                score: avgScore,
                ex_name: quarter,
                ses_name: year,
                range: kpi.range,
              });
            }
          }

          console.log('KPIs agrupados por trimestre:', resultado);
          this.kpis_jugador_trimestral = resultado;

          this.chartData = [];
          let kpiData = {};

          this.kpis_jugador_trimestral.forEach(indicador => {
            if (!kpiData[indicador.name]) {
              kpiData[indicador.name] = [];
            }
            kpiData[indicador.name].push({
              time: indicador.date,
              score: indicador.score
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
    cargarKPIs() {
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

      this.chartData_sesion= [];
      this.chartData_mensual= [];
      this.chartData_trimestral= [];
      this.chartData_all= [];

      const methodName = `cargarKPIs_${this.modo}`;
      if (typeof this[methodName] === 'function') {
        this[methodName]();
      } else {
        console.error(`Method ${methodName} does not exist`);
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

    cargarDAFO_promedioGPA(){
      this.chartData.forEach(kpi => {
        console.log(kpi);
        const puntajes = kpi.data.map(d => parseFloat(d.score));
        const rango = kpi.range;
        const gpa_puntos = puntajes.map(puntaje => this.convertir_a_gpa(puntaje, rango));

        const total = gpa_puntos.reduce((sum, value) => sum + value, 0);
        const promedio_gpa = total / gpa_puntos.length;

        if (promedio_gpa >= 3.5) {
            this.resultados_DAFO.Fortalezas.push(`${kpi.name}: Promedio GPA alto (Fortaleza)`);
        } else if (promedio_gpa >= 2.5) {
          this.resultados_DAFO.Oportunidades.push(`${kpi.name}: Promedio GPA moderado (Oportunidad)`);
        } else if (promedio_gpa >= 1.5) {
          this.resultados_DAFO.Amenazas.push(`${kpi.name}: Promedio GPA bajo (Amenaza)`);
        } else {
          this.resultados_DAFO.Debilidades.push(`${kpi.name}: Promedio GPA muy bajo (Debilidad)`);
        }

        console.log(`KPI: ${kpi.name}`);
        console.log(`Puntajes: ${puntajes}`);
        console.log(`GPA Puntos: ${gpa_puntos}`);
        console.log(`Promedio GPA: ${promedio_gpa}`);
        console.log("Resultados DAFO:");
        for (const [campo, resultados] of Object.entries(this.resultados_DAFO)) {
            console.log(`  ${campo}: ${resultados.join(', ')}`);
        }
        console.log(this.resultados_DAFO);

      });
    },
    cargarDAFO__Desviacion(){
      this.chartData.forEach(kpi => {
        console.log(kpi);
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

        // Imprimir los resultados
        console.log(`Desviación Estándar: ${desviacionEstandar.toFixed(2)}`);
        console.log(`Porcentaje de Desviación respecto al rango total: ${porcentajeDesviacion.toFixed(2)}%`);
        console.log(`Tramo asociado: ${tramoDesviacion}`);       

      });
    },
    cargarDAFO_Pendiente(){

    },
    cargarDAFO_Cambios_Temporales(){

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
    margin-bottom: 10px; /* Añade separación inferior */
  }

  .block-title svg {
    margin-right: 10px; /* Añade separación derecha del icono */
  }

  .player-pic h3{
    padding-top: 10px;
    padding-bottom: 20px;
  }

  .list-container {
    width: 100%;
    height: 100%;
    overflow-y: auto; /* Asegura que haya una barra de desplazamiento dentro del contenedor */
    padding-right: 10px; /* Añadir padding para que la barra de desplazamiento no cubra el contenido */
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
    text-decoration: none; /* Quita el subrayado de los enlaces */
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
    flex-direction: row; /* Mantiene los elementos en fila */
  }

  .name {
    color: #000000;
    font-weight: bold;
  }

  .block p{
    font-weight: lighter;
  }

  .dafo-stats{
    display: grid;
    grid-template-areas: 
      "debilidades amenazas"
      "fortalezas oportunidades";
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 20px; /* Sseparación entre areas */
    width: 100%;
    box-sizing: border-box;

  }

  .debilidades, .amenazas, .fortalezas, .oportunidades {
    margin-bottom: 20px;
  }

  .dafo-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .dafo-item {
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 5px;
    font-weight: normal;
    color: #fff;
  }

  .weakness {
    background-color: #dc3545;
  }

  .threat {
    background-color: #ffc107;
  }

  .strength {
    background-color: #28a745;
  }

  .opportunity {
    background-color: #17a2b8;
  }

  .charts-container {
    grid-area: charts-container;
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
    max-height: 100%; /* Mantiene la altura máxima */
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .match-history-container{
    grid-area:match-history-container;
    max-height: 100%; /* Mantiene la altura máxima */
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .dafo-container {
    grid-area: dafo-container;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
    box-sizing: border-box;
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

  .dropdown-enter-active, .dropdown-leave-active {
    transition: max-height 0.3s ease, opacity 0.3s ease;
  }

  .dropdown-enter, .dropdown-leave-to {
    max-height: 0;
    opacity: 0;
  }

</style>