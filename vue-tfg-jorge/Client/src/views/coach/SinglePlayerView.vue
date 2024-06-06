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
        <router-link
          v-for="(item, index) in kpis_jugador"
          :key="index"
          :to="{ path: '/stats', query: { player: item.name } }"
          class="list-item-link"
        >
          <div class="list-item">
            <div class="item-details">
              <div class="name">
                {{ item.ses_name }} - {{ item.ex_name }} - {{ item.name }}
              </div>
            </div>
            <div :style="{ backgroundColor: calculateColorKPI((item.score || '0').toString(), ((item.range || '0').toString())), color: getTextColorKPI((item.score || '0').toString(), ((item.range || '0').toString())) }"
            class="avg"
            style="display: inline-block; white-space: nowrap; margin-left: 5px;">
              {{ item.score || 0 }} / {{ item.range || 0 }}
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- <div class="block match-history-container">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m414-168 12-56q3-13 12.5-21.5T462-256l124-10q13-2 24 5t16 19l16 38q39-23 70-55.5t52-72.5l-12-6q-11-8-16-19.5t-2-24.5l28-122q3-12 12.5-20t21.5-10q-5-25-12.5-48.5T764-628q-9 5-19.5 4.5T726-630l-106-64q-11-7-16-19t-2-25l8-34q-31-14-63.5-21t-66.5-7q-14 0-29 1.5t-29 4.5l30 68q5 12 2.5 25T442-680l-94 82q-10 9-23.5 10t-24.5-6l-92-56q-23 38-35.5 81.5T160-480q0 16 4 52l88-8q14-2 25.5 4.5T294-412l48 114q5 12 2.5 25T332-252l-38 32q27 20 57.5 33t62.5 19Zm72-172q-13 2-24-5t-16-19l-54-124q-5-12-1.5-25t13.5-21l102-86q9-9 22-10t24 6l112 66q11 7 17 19t3 25l-32 130q-3 13-12 21.5T618-352l-132 12Zm-6 260q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
        Historial de partidos
      </div>
    </div> -->

    <div class="block dafo-container">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M240-40q-50 0-85-35t-35-85q0-50 35-85t85-35q14 0 26 3t23 8l57-71q-28-31-39-70t-5-78l-81-27q-17 25-43 40t-58 15q-50 0-85-35T0-580q0-50 35-85t85-35q50 0 85 35t35 85v8l81 28q20-36 53.5-61t75.5-32v-87q-39-11-64.5-42.5T360-840q0-50 35-85t85-35q50 0 85 35t35 85q0 42-26 73.5T510-724v87q42 7 75.5 32t53.5 61l81-28v-8q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-32 0-58.5-15T739-515l-81 27q6 39-5 77.5T614-340l57 70q11-5 23-7.5t26-2.5q50 0 85 35t35 85q0 50-35 85t-85 35q-50 0-85-35t-35-85q0-20 6.5-38.5T624-232l-57-71q-41 23-87.5 23T392-303l-56 71q11 15 17.5 33.5T360-160q0 50-35 85t-85 35ZM120-540q17 0 28.5-11.5T160-580q0-17-11.5-28.5T120-620q-17 0-28.5 11.5T80-580q0 17 11.5 28.5T120-540Zm120 420q17 0 28.5-11.5T280-160q0-17-11.5-28.5T240-200q-17 0-28.5 11.5T200-160q0 17 11.5 28.5T240-120Zm240-680q17 0 28.5-11.5T520-840q0-17-11.5-28.5T480-880q-17 0-28.5 11.5T440-840q0 17 11.5 28.5T480-800Zm0 440q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm240 240q17 0 28.5-11.5T760-160q0-17-11.5-28.5T720-200q-17 0-28.5 11.5T680-160q0 17 11.5 28.5T720-120Zm120-420q17 0 28.5-11.5T880-580q0-17-11.5-28.5T840-620q-17 0-28.5 11.5T800-580q0 17 11.5 28.5T840-540ZM480-840ZM120-580Zm360 120Zm360-120ZM240-160Zm480 0Z"/></svg>
        DAFO
      </div>
      <div class="dafo-stats">
        <div class="debilidades">
          <h3>Debilidades</h3>
          <div class="dafo-list">
            <div v-for="(item, index) in dafo[0]" :key="index" class="dafo-item weakness">{{ item.name }}</div>
          </div>
        </div>
        <div class="amenazas">
          <h3>Amenazas</h3>
          <div class="dafo-list">
            <div v-for="(item, index) in dafo[1]" :key="index" class="dafo-item threat">{{ item.name }}</div>
          </div>
        </div>
        <div class="fortalezas">
          <h3>Fortalezas</h3>
          <div class="dafo-list">
            <div v-for="(item, index) in dafo[2]" :key="index" class="dafo-item strength">{{ item.name }}</div>
          </div>
        </div>
        <div class="oportunidades">
          <h3>Oportunidades</h3>
          <div class="dafo-list">
            <div v-for="(item, index) in dafo[3]" :key="index" class="dafo-item opportunity">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="block charts-container">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z"/></svg>
        Gráficos
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue';
import KpiChart from '../../components/KpiChart.vue'

export default {
  name: 'SinglePlayerView',
  components: {
    KpiChart
  },
  computed: {
    playerName() {
      return this.$route.query.player || 'Unknown';
    }
  },
  data() {
    return {
      player_kpis: [
        { name: 'Efectividad de pases', score: '10%', target: '80%' },
        { name: 'Efectividad de pases', score: '15%', target: '80%' },
        { name: 'Efectividad de pases', score: '32%', target: '80%' },
        { name: 'Efectividad de pases', score: '80%', target: '80%' },
      ],
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
      kpis_jugador: [],
    };
  },
  setup() {
    const app = inject('app');
    const dao = inject('dao');
    return { app, dao };
  },
  methods: {

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
    cargarKPIsPorSesion(){

      this.dao.exercise_has_session_has_actor_has_kpi.read().then((ejercicios) => {

        //Ejercicios que involucran al Jugador
        ejercicios = ejercicios.filter(sesion =>
          sesion.Exercise_has_Session_has_Actor_Actor_idActor == this.$route.query.idActor
        );
        
        ejercicios.forEach(element => {
          let indicador;
          //De ese ejercicio, los que correspondan al KPI, 1 ejercicio, 1 KPI
          this.dao.kpi.read().then((indicadores) => {
            indicador = indicadores.filter(indic =>
              indic.idKPI == element.KPI_idKPI
            )[0];
            indicador.score = element.score;

            //De ese ejercicio, le corresponde 1 sesión
            this.dao.session.read().then((sesiones) => {
              sesiones = sesiones.filter(sesion =>
                sesion.idSession == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Ses_idSes
              )[0];
              indicador.ses_date = sesiones.date;
              indicador.ses_name = sesiones.name;

              //De ese ejercicio, le corresponde 1 nombre
              this.dao.exercise.read().then((ejercicios) => {
                ejercicios = ejercicios.filter(ex =>
                  ex.idExercise == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Exer_idExer
                )[0];
                indicador.ex_name = ejercicios.name;

                console.log("Indicador", indicador);
                this.kpis_jugador.push(indicador);
              });
            });
            
          });
        });
      });

      
    },
    cogerYearMonth(date){
      const dateFormat = new Date(date);
      const year = dateFormat.getFullYear();
      const month = String(dateFormat.getMonth() + 1).padStart(2, '0');

      return `${year}-${month}`;
    },
    cargarKPIsPorMes(){

      this.dao.exercise_has_session_has_actor_has_kpi.read().then((ejercicios) => {

        //Ejercicios que involucran al Jugador
        ejercicios = ejercicios.filter(sesion =>
          sesion.Exercise_has_Session_has_Actor_Actor_idActor == this.$route.query.idActor
        );
        
        ejercicios.forEach(element => {
          let indicador, i = 1, year_month_actual, aux_ym;
          //De ese ejercicio, los que correspondan al KPI, 1 ejercicio, 1 KPI
          this.dao.kpi.read().then((indicadores) => {
            indicador = indicadores.filter(indic =>
              indic.idKPI == element.KPI_idKPI
            )[0];
            indicador.score = element.score;

            //De ese ejercicio, le corresponde 1 sesión
            this.dao.session.read().then((sesiones) => {
              sesiones = sesiones.filter(sesion =>
                sesion.idSession == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Ses_idSes
              )[0];
              indicador.ses_date = sesiones.date;
              if(year_month_actual){
                
              }
              else{

              }
              indicador.ses_name = sesiones.name;

              //De ese ejercicio, le corresponde 1 nombre
              this.dao.exercise.read().then((ejercicios) => {
                ejercicios = ejercicios.filter(ex =>
                  ex.idExercise == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Exer_idExer
                )[0];
                indicador.ex_name = ejercicios.name;

                console.log("Indicador", indicador);
                this.kpis_jugador.push(indicador);
              });
            });
            
          });
        });
      });


      },
  },
  created() {
    this.getPlayerInfo();
    this.cargarKPIsPorSesion();
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
    background-color: #f0f0f0; /* Cambia el color de fondo al pasar el ratón */
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

</style>