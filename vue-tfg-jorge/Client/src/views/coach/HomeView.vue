<template>
  <div class="grid-container">
    
    <div id="equipo-block" class="block block1" @click="goToURL('/equipo')">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg>
        Equipo
      </div>
      <div class="list-container">
        <router-link
          v-for="(item, index) in actoresCompletos"
          :key="index"
          :to="{ path: '/singleplayer', query: { player: item.name, idActor: item.idActor } }"
          class="list-item-link"
          @click.stop
        >
          <div class="list-item player-item">
            <img :src="item.photo || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'" alt="Foto-perfil" class="profile-pic" />
            <div class="item-details">
              <div class="name number">{{ item.name }} {{ item.surname }}</div>
            </div>
            <!-- <div :style="{ backgroundColor: calculateColor(item.avg), color: getTextColor(item.avg) }" class="avg">
              {{ item.avg }}%
            </div> -->
          </div>
        </router-link>
      </div>
    </div>

    <div id="estadisticas-block" class="block block2" @click="goToURL('/stats')">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-280h80v-280h-80v280Zm160 0h80v-400h-80v400Zm160 0h80v-160h-80v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
        Estadísticas
      </div>
      <div class="list-container" @click.stop>
        <div v-for="(session, sessionIndex) in kpisJugador"
          :key="'session-' + sessionIndex"
        >
          <div @click="toggleDropdown(sessionIndex)" class="session-name">
            <span v-if="modo === 'sesion'">{{ formatDate(session.ses_date) }} - </span>
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

    <div id="graficos-block" class="block block5" @click="goToURL('/stats')">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z"/></svg>
        Gráficos
      </div>
      <div id="graficos" class="charts-container">
        <div v-for="(chart, index) in chartData" :key="index" class="chart">
          <KpiChart
            :chartData="chart.data"
            :chartId="'chart-' + index"
            :chartName="chart.name"
            :isHomeView="true"
          />
        </div>
      </div>
    </div>

    <div id="calendario-block" class="block block6" @click="goToURL('/calendario')">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>
        Calendario
      </div>
      
      <div class="calendar-container" @click.stop>
        <vue-cal
          active-view="month"
          :events="sessions"
          @cell-click="onCellClick"
          @event-click="onEventClick"
          class="vue-cal-custom"
          :locale="es"
          style="width: 270px;">
        </vue-cal>
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
  import { inject } from 'vue';
  import { format } from 'date-fns';
  import { mapGetters } from 'vuex';
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';
  import KpiChart from '@/components/KpiChart.vue'

  export default {
    name: 'HomeView',
    components: {
      VueCal,KpiChart
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
          return this.kpis_sesion;
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
        actores: [],
        actorIds: [],
        actoresCompletos: [],
        sessions: [],
        jugadoresKPIs: [],

        //GRÁFICOS y STATS
        kpis_sesion: [],
        kpis_mensual: [],
        kpis_trimestral: [],
        chartData: [],
        openSessions: [],
        openKpis: [],

        //CALENDAR
        events: [
          {
            start: '2024-05-30 10:35',
            end: '2024-05-30 11:30',
            title: 'Doctor appointment'
          },
          {
            start: '2024-05-30 18:30',
            end: '2024-05-30 20:15',
            title: 'Dentist appointment',
            background: true
          },
        ],
        es : {
          "weekDays": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
          "weekDaysShort": ["L", "M", "X", "J", "V", "S", "D"],
          "months": ["Enero", "Febero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
          "years": "Años",
          "year": "Año",
          "month": "Mes",
          "week": "Semana",
          "day": "Día",
          "today": "Hoy",
          "noEvent": "Sin eventos",
          "allDay": "Todo el día",
          "deleteEvent": "Borrar evento",
          "createEvent": "Crear evento",
          "dateFormat": "dddd MMMM YYYY"
        }
      };
    },
    setup() {
      const app = inject('app');
      const dao = inject('dao');
      return { app, dao };
    },
    methods: {
      formatDate(date) {
        return format(new Date(date), 'PPP - p');
      },
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
      isKpiDropdownOpen(sessionName, kpiIndex) {
        const key = `${sessionName}-${kpiIndex}`;
        return this.openKpis.includes(key);
      },
      filterKpisBySession(session) {
        return this.kpisJugador.filter(kpi => kpi.ses_id === session.ses_id);
      },
      handleHoverEffects() {
        this.$nextTick(() => {
          const block = document.querySelector('.block1');
          if(block){
            const listItems = block.querySelectorAll('.list-item-link');

            block.addEventListener('mouseenter', () => {
              block.classList.add('hovered');
            });

            block.addEventListener('mouseleave', () => {
              block.classList.remove('hovered');
            });

            listItems.forEach(item => {
              item.addEventListener('mouseenter', () => {
                block.classList.remove('hovered');
                block.classList.add('hovered-inItem');
              });

              item.addEventListener('mouseleave', () => {
                block.classList.add('hovered');
                block.classList.remove('hovered-inItem');
              });
            });
          }

          const block2 = document.querySelector('.block2');
          if(block2){
            const listItems2 = block2.querySelectorAll('.session-name');

            block2.addEventListener('mouseenter', () => {
              block2.classList.add('hovered');
            });

            block2.addEventListener('mouseleave', () => {
              block2.classList.remove('hovered');
            });

            listItems2.forEach(item => {
              item.addEventListener('mouseenter', () => {
                block2.classList.remove('hovered');
                block2.classList.add('hovered-inItem');
              });

              item.addEventListener('mouseleave', () => {
                block2.classList.add('hovered');
                block2.classList.remove('hovered-inItem');
              });
            });
          }
        });
      },
      goToURL(url) {
        this.$router.push(url);
      },
      calculateColor(value,) {
        let red, green;

        if (value < 50) {
          red = 255;
          green = Math.round(255 * (value / 50));
        } else {
          red = Math.round(255 * ((100 - value) / 50));
          green = 255;
        }

        return `rgb(${red}, ${green}, 0)`;
      },
      getTextColor(value) {
        return value > 49 ? '#000000' : '#FFFFFF';
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
      carcularTimeStart(date,time){
        if(!time){
          time = "9:00:00";
        }

        const dateFormat = new Date(date);
        const year = dateFormat.getFullYear();
        const month = String(dateFormat.getMonth() + 1).padStart(2, '0');
        const day = String(dateFormat.getDate()).padStart(2, '0');
        const hours = String(time).substring(0, 2);
        const minutes = String(time).substring(3, 5);

        return `${year}-${month}-${day} ${hours}:${minutes}`;
      },
      carcularTimeEnd(date,time,duration){
        if(!time){
          time = "9:00:00";
        }

        if(!duration){
          duration= 30;
        }

        const dateFormat = new Date(date);
        const year = dateFormat.getFullYear();
        const month = String(dateFormat.getMonth() + 1).padStart(2, '0');
        const day = String(dateFormat.getDate()).padStart(2, '0');
        let hours = String(time).substring(0, 2);
        let minutes = String(time).substring(3, 5);
        minutes = (parseInt(minutes) + duration).toString();

        if (minutes >= 60) {
          hours = (parseInt(hours) +  Math.floor(minutes / 60)).toString();
          minutes = minutes % 60;
        }

        hours = String(hours).padStart(2, '0');
        minutes = String(minutes).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
      },
      onCellClick({ startDate, endDate }) {
        console.log(`Clicked on cell from ${startDate} to ${endDate}`);
      },
      onEventClick(event) {
        console.log(`Clicked on event: ${event.title}`);
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

      //EQUIPO
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
				} catch (error) {
					console.error('Error al cargar jugadores completos:', error);
				}
			},

      //KPIs Y GRÁFICOS
      async cargarKPIs() {
        const loader = document.querySelector('.loader-container');
        if(loader){loader.style.display = 'flex';}

        this.chartData = [];

        const methodName = `cargarKPIs_${this.modo}`;
        if (typeof this[methodName] === 'function') {
          await this[methodName]();
          if(loader){loader.style.display = 'none';}
          console.log('Gráficos cargados')
        } else {
          console.error(`Method ${methodName} does not exist`);
        }
      },
      async cargarKPIs_sesion() {
        try {
          //Leer los datos todos de una vez
          const [ejercicios, indicadores, sesiones, ejerciciosResponse] = await Promise.all([
            this.dao.exercise_has_session_has_actor_has_kpi.read(),
            this.dao.kpi.read(),
            this.dao.session.read(),
            this.dao.exercise.read()
          ]);

          //Filtrar por el jugadores del equipo
          const ejerciciosFiltrados = ejercicios.filter(sesion =>
            this.actorIds.includes(sesion.Exercise_has_Session_has_Actor_Actor_idActor)
          );

          let kpiPorSesion = {};

          //Analizar los datos
          ejerciciosFiltrados.forEach(element => {
            let indicador = indicadores.find(indic => indic.idKPI == element.KPI_idKPI);
            let sesion = sesiones.find(s => s.idSession == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Ses_idSes);
            let ejercicio = ejerciciosResponse.find(ex => ex.idExercise == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Exer_idExer);

            if (!indicador || !sesion || !ejercicio) return;

            // Convertir la fecha y la hora correctamente
            let date = new Date(sesion.date);
            let [hours, minutes, seconds] = sesion.time.split(':').map(Number);
            date.setUTCHours(hours, minutes, seconds);
            indicador.ses_date = date.toISOString();
            indicador.ses_name = sesion.name;

            if (!kpiPorSesion[sesion.idSession]) {
              kpiPorSesion[sesion.idSession] = {
                name: sesion.name,
                date: indicador.ses_date,
                ses_id: sesion.idSession,
                [indicador.idKPI]: {
                  idKPI: indicador.idKPI,
                  name: indicador.name,
                  scores: [],
                  range: indicador.range,
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

            if (!kpiPorSesion[sesion.idSession][indicador.idKPI][ejercicio.idExercise]) {
              kpiPorSesion[sesion.idSession][indicador.idKPI][ejercicio.idExercise] = {
                id: ejercicio.idExercise,
                name: ejercicio.name,
                score: element.score,
              };
            }

            kpiPorSesion[sesion.idSession][indicador.idKPI].scores.push(element.score);
          });

          //Resultado que se va a mostrar en pantalla
          let resultado = Object.keys(kpiPorSesion).map(sesion => {
            let KPIs = Object.keys(kpiPorSesion[sesion])
              .filter(key => key !== 'name' && key !== 'date' && key !== 'ses_id')
              .map(idKPI => {
                let kpi = kpiPorSesion[sesion][idKPI];
                let avgScore = (kpi.scores.reduce((a, b) => a + b, 0) / kpi.scores.length).toFixed(2);
                let exercises = Object.keys(kpi)
                  .filter(key => key !== 'idKPI' && key !== 'name' && key !== 'scores' && key !== 'range')
                  .reduce((acc, ex) => {
                    acc[kpi[ex].id] = {
                      name: kpi[ex].name,
                      score: kpi[ex].score,
                    };
                    return acc;
                  }, {});

                return {
                  idKPI: kpi.idKPI,
                  name: kpi.name,
                  range: kpi.range,
                  score: avgScore,
                  exercises: exercises
                };
              });

            return {
              ses_name: kpiPorSesion[sesion].name,
              ses_date: kpiPorSesion[sesion].date,
              ses_id: kpiPorSesion[sesion].ses_id,
              KPIs: KPIs
            };
          });

          this.kpis_sesion = resultado;
          this.chartData = [];
          const kpiData = {};

          // Preparar los datos para el gráfico
          this.kpis_sesion.forEach(session => {
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

        } catch (error) {
          console.error('Error al cargar KPIs de sesión:', error);
        }
      },
      async cargarKPIs_mensual() {

        let kpiPorMes = {};
        let kpiPorSesion = {};

        try {
          //Leer los datos todos de una vez
          const [ejercicios, indicadores, sesiones, ejerciciosResponse] = await Promise.all([
            this.dao.exercise_has_session_has_actor_has_kpi.read(),
            this.dao.kpi.read(),
            this.dao.session.read(),
            this.dao.exercise.read()
          ]);

          //Filtrar por el jugadores del equipo
          const ejerciciosFiltrados = ejercicios.filter(sesion =>
            this.actorIds.includes(sesion.Exercise_has_Session_has_Actor_Actor_idActor)
          );

          //Analizar los datos
          ejerciciosFiltrados.forEach(element => {
            const indicador = indicadores.find(indic => indic.idKPI == element.KPI_idKPI);
            const sesion = sesiones.find(s => s.idSession == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Ses_idSes);
            const ejercicio = ejerciciosResponse.find(ex => ex.idExercise == element.Exercise_has_Session_has_Actor_Exercise_has_Session_Exer_idExer);

            if (!indicador || !sesion || !ejercicio) return;

            const date = new Date(sesion.date);
            indicador.score = element.score;
            indicador.ses_date = date.toISOString();
            indicador.ses_name = sesion.name;
            indicador.ex_name = ejercicio.name;

            if (!kpiPorSesion[sesion.idSession]) {
              kpiPorSesion[sesion.idSession] = {
                name: sesion.name,
                date: indicador.ses_date,
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

            if (!kpiPorSesion[sesion.idSession][indicador.idKPI][ejercicio.idExercise]) {
              kpiPorSesion[sesion.idSession][indicador.idKPI][ejercicio.idExercise] = {
                id: ejercicio.idExercise,
                name: ejercicio.name,
                score: element.score,
              };
            }

            kpiPorSesion[sesion.idSession][indicador.idKPI].scores.push(element.score);
          });

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

          //Resultado que se va a mostrar en pantalla
          let resultado = Object.keys(kpiPorMes).map(mes => {
            let month = kpiPorMes[mes];
            let sessions = Object.keys(month.sessions).map(ses => {
              let session = month.sessions[ses];
              let KPIs = Object.keys(session.KPIs).map(idKPI => session.KPIs[idKPI]);
              let avgScore = (KPIs.reduce((acc, kpi) => acc + parseFloat(kpi.score), 0) / KPIs.length).toFixed(2);

              return {
                idKPI: session.idKPI,
                name: session.name,
                range: null,
                score: avgScore,
                exercises: KPIs
              };
            });

            return {
              ses_name: month.name, // Nombre del Mes
              ses_date: month.name,
              ses_id: mes,
              KPIs: sessions // Sesiones
            };
          });

          this.kpis_mensual = resultado;

          this.chartData = [];
          const exerciseData = {};

          // Preparar los datos para el gráfico
          resultado.forEach(mes => {
            mes.KPIs.forEach(kpi => {
              Object.values(kpi.exercises).forEach(exercise => {
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

        let kpiPorTrimestre = {};
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
            let month = kpiPorTrimestre[trimestre];
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
              ses_name: month.name, // Nombre del trimestre
              ses_date: month.name,
              ses_id: trimestre,

              KPIs: sessions // Sesiones
            });
          }

          this.kpis_trimestral = resultado;

          this.chartData = [];
          const exerciseData = {};

          resultado.forEach(trimestre => {
            trimestre.KPIs.forEach(kpi => {
              kpi.exercises.forEach(exercise => {
                if (!exerciseData[exercise.name]) {
                  exerciseData[exercise.name] = {};
                }

                if (!exerciseData[exercise.name][trimestre.ses_name]) {
                  exerciseData[exercise.name][trimestre.ses_name] = [];
                }

                exerciseData[exercise.name][trimestre.ses_name].push(parseFloat(exercise.score));
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
          await this.cargarJugadores();
          await this.cargarKPIs();
          this.handleHoverEffects();
        } catch (error) {
          console.error('Error al cargar gráficos:', error);
        }
      },

      //CALENDAR
      async cargarSesiones() {
        try {
          const actoresResponse = await this.dao.actor.read();
          const actores = actoresResponse.filter(actor => actor.User_idUser == this.userID);

          for (const fila of actores) {
            const actorID = fila.idActor;

            const sesionesResponse = await this.dao.session.read();
            const sesiones = actorID !== null 
              ? sesionesResponse.filter(sesion => sesion.Actor_idActor == actorID && sesion.date != null)
              : sesionesResponse;

            sesiones.forEach(element => {
              this.sessions.push({
                start: this.carcularTimeStart(element.date.toString(), element.time.toString()),
                end: this.carcularTimeEnd(element.date.toString(), element.time.toString(), element.duration),
                title: element.name
              });
            });
          }
        } catch (error) {
          console.error('Error al cargar sesiones:', error);
        }
      },
    },
    watch: {
      modo(newModo) {
        this.cargarKPIs();
      }
    },
    created() {
      this.cargarSesiones();
      this.cargarGraficos();
    }
  }
</script>

<style scoped>
  .grid-container {
    display: grid;
    grid-template-areas: 
      "block1 block2 block5"
      "block1 block2 block5"
      "block6 block6 block5";
    grid-template-columns: 2fr 2fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 30px;
    height: calc(100vh - 50px);
    width: 90%;
    padding: 40px;
    box-sizing: border-box;
  }

  .block {
    background-color: #ffffff;
    color: rgb(0, 0, 0);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
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
  }

  .player-item {
    width: 100%;
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
    font-weight: bold;
  }

  .number {
    color: #000000;
  }

  /* EQUIPO */
  .block1{
    grid-area: block1;
    max-height: 100%;
    min-height: 250px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.1s ease, background-color 0.5s ease;
  }

  .block1.hovered {
    transform: scale(1.1);
    cursor: pointer;
    background-color: var(--dark);
    color: var(--light);;
  }

  .block1.hovered-inItem {
    transform: scale(1.1);
    cursor: pointer;
    background-color: #d6e6ff;
  }

  /* STATS */
  .block2 {
    grid-area: block2;
    max-height: 100%;
    min-height: 250px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.1s ease, background-color 0.5s ease;
  }

  .block2:hover{
    transform: scale(1.1);
    cursor: pointer;
    background-color: var(--dark);
    color: var(--light);;
  }

  .block2.hovered-inItem {
    transform: scale(1.1);
    cursor: pointer;
    background-color: #d6e6ff;
  }

  .session-name {
    font-weight: bold;
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
    background: #85b4ff;
    border: 1px solid grey;
    color:#000;
  }

  .session-name:hover {
    background-color: rgb(125, 196, 243);
    cursor: pointer;
  }

  .kpi-dropdown {
    margin-left: 20px;
  }

  .kpi-name {
    font-weight: bold;
    margin: 5px 0;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid grey;
  }

  .kpi-name:hover {
    background-color: rgb(169, 240, 224);
    cursor:default;
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

  /* OTROS EQUIPOS */
  .block3 {
    grid-area: block3;
    max-height: 100%;
    max-width: 570px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.1s ease;
  }

  .block3:hover{
    transform: scale(1.1);
  }

  .block3 .list-container{
    display: flex;
    justify-content: center;
  }

  /* GRÁFICOS */
  .block5{
    grid-area: block5;
    max-width: 100%;
    max-height: 100%;
    transition: transform 0.1s ease;
  }

  .block5:hover{
    transform: scale(1.05);
    cursor: pointer;
  }

  .charts-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .chart {
		max-width: 300px;
    width: 100%;
    border: solid black 1px;
    border-radius: 5px;
	}

  /* CALENDARIO */
  .block6 {
    grid-area: block6;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    transition: transform 0.1s ease;
  }

  .block6:hover{
    transform: scale(1.05);
    cursor: pointer;
  }

  .vue-cal-custom {
    max-width: 100%;
    height: 600px;
  }
  .calendar-container {
    width: 100%;
    flex-grow: 1;
    overflow: auto;
    display: flex;
    justify-content: center;
  }

  @media (max-width: 1350px) {
    .grid-container {
      grid-template-areas:
        "block1"
        "block2"
        "block5"
        "block6";
      grid-template-columns: 1fr;
      grid-template-rows: auto;
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