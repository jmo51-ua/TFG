<template>
  <div class="grid-container">
    <div class="block block1">
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
        >
          <div class="list-item player-item">
            <img :src="item.photo || 'https://ui-avatars.com/api/?name=Default&size=50'" alt="Foto-perfil" class="profile-pic" />
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
    <div class="block block2">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-280h80v-280h-80v280Zm160 0h80v-400h-80v400Zm160 0h80v-160h-80v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
        Estadísticas
      </div>
      <div class="list-container">
        <router-link
          v-for="(item, index) in jugadoresKPIs"
          :key="index"
          :to="{ path: '/singleplayer', query: { player: item.name } }"
          class="list-item-link"
        >
          <div class="list-item">
            <img :src="item.image" alt="Profile" class="profile-pic" />
            <div class="item-details">
              <div class="name number">{{ item.name }} - {{ item.kpi_name }}</div>
            </div>
            <div :style="{ backgroundColor: calculateColorKPI(item.score, item.target), color: getTextColorKPI(item.score, item.target) }"
            class="avg"
            style="display: inline-block; white-space: nowrap; margin-left: 5px;">
              {{ item.score }} / {{ item.target }}
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="block block3">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M350-63q-46 0-82.5-24T211-153q-16 21-40.5 32.5T120-109q-51 0-85.5-35T0-229q0-43 28-77.5T99-346q-14-20-21.5-42.5T70-436q0-40 20.5-75t57.5-57q5 18 13.5 38.5T181-494q-14 11-22 26.5t-8 32.5q0 56 46 69t87 21l19 32q-11 32-19 54.5t-8 40.5q0 30 21.5 52.5T350-143q38 0 63-34t41-80q16-46 24.5-93t13.5-72l78 21q-9 45-22 103t-36.5 110.5Q488-135 449.5-99T350-63ZM120-189q17 0 28.5-11.5T160-229q0-17-11.5-28.5T120-269q-17 0-28.5 11.5T80-229q0 17 11.5 28.5T120-189Zm284-158q-46-41-83.5-76.5t-64.5-69q-27-33.5-41.5-67T200-629q0-65 44.5-109.5T354-783q4 0 7 .5t7 .5q-4-10-6-20t-2-21q0-50 35-85t85-35q50 0 85 35t35 85q0 11-2 20.5t-6 19.5h14q60 0 102 38.5t50 95.5q-18-3-40.5-3t-41.5 2q-7-23-25.5-38T606-703q-35 0-54.5 20.5T498-623h-37q-35-41-54.5-60.5T354-703q-32 0-53 21t-21 53q0 23 13 47.5t36.5 52q23.5 27.5 57 58.5t74.5 67l-57 57Zm76-436q17 0 28.5-11.5T520-823q0-17-11.5-28.5T480-863q-17 0-28.5 11.5T440-823q0 17 11.5 28.5T480-783ZM609-63q-22 0-43.5-6T524-88q11-14 22-33t20-35q11 7 22 10t22 3q32 0 53.5-22.5T685-219q0-19-8-41t-19-54l19-32q42-8 87.5-21t45.5-69q0-40-29.5-58T716-512q-42 0-98 16t-131 41l-21-78q78-25 139-42t112-17q69 0 121 41t52 115q0 25-7.5 47.5T861-346q43 5 71 39.5t28 77.5q0 50-34.5 85T840-109q-26 0-50.5-11.5T749-153q-20 42-56.5 66T609-63Zm232-126q17 0 28-11.5t11-28.5q0-17-11.5-29T840-270q-17 0-28.5 11.5T800-230q0 17 12 29t29 12Zm-721-40Zm360-594Zm360 593Z"/></svg>
        Mis otros equipos
      </div>
    </div>
    <div class="block block4">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
        Mensajes
      </div>
    </div>
    <div class="block block5">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z"/></svg>
        Gráficos
      </div>
    </div>
    <div class="block block6">
      <div class="block-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>
        Calendario
      </div>
      
      <div class="calendar-container">
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
</template>

<script>
  import { inject } from 'vue';
  import { mapGetters } from 'vuex';
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';

  export default {
    name: 'HomeView',
    components: {
      VueCal,
    },
    data() {
      return {
        actores: [],
        actorIds: [],
        actoresCompletos: [],
        sessions: [],
        jugadoresKPIs: [],
        listStats: [
          { image: 'https://via.placeholder.com/50', name: 'Rodri', kpi_name: 'Acierto de pases', score: '41%', target:'90%' },
          { image: 'https://via.placeholder.com/50', name: 'Moi Gomez', kpi_name: 'Apariciones / min', score: '2.4', target:'2.1' },
          { image: 'https://via.placeholder.com/50', name: 'Rodri', kpi_name: 'Acierto de pases', score: '61%', target:'100%' },
          { image: 'https://via.placeholder.com/50', name: 'Moi Gomez', kpi_name: 'Apariciones / min', score: '2.4', target:'3.0' },
        ],

        //VUE CALENDAR
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
      cargarSesiones(){
        this.dao.session.read().then((response) => {

          this.sessions = response
          .filter(sesion => sesion.date != null)
          .map(sesion => ({
            start: new Date(sesion.date),
            end: new Date(new Date(sesion.date).getTime() + (sesion.duration * 60000)),
            title: sesion.name
          }));

          console.log('Sesiones filtradas y convertidas:', this.sessions);
        });
      },
      calculateEndTime(startTime, duration) {
        var [hours, minutes] = [0, 0];
        if(startTime != null){
          [hours, minutes] = startTime.split(':').map(Number);
        }
        const endDate = new Date(0, 0, 0, hours, minutes + duration);
        return endDate.toTimeString().split(' ')[0];
      },
      onCellClick({ startDate, endDate }) {
        console.log(`Clicked on cell from ${startDate} to ${endDate}`);
      },
      onEventClick(event) {
        console.log(`Clicked on event: ${event.title}`);
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
      cargarSesiones() {
        let actorID,actores
        let sesiones;

        this.dao.actor.read().then((response) => {
          actores = response.filter(actor =>
            actor.User_idUser == this.userID
          );

          actores.forEach(fila => {
            actorID = fila.idActor;

            this.dao.session.read().then((response) => {
              sesiones = actorID !== null 
                ? response.filter(sesion => sesion.Actor_idActor == actorID && sesion.date !=null)
              : response;
              
              sesiones.forEach(element => {
                this.sessions.push(
                  {
                    start: this.carcularTimeStart(element.date.toString(),element.time.toString()),
                    end: this.carcularTimeEnd(element.date.toString(),element.time.toString(),element.duration),
                    title: element.name
                  }
                );
              });
            });

          });
        });
      },
    },
    created() {
      this.cargarJugadores();
      this.cargarSesiones();
    }
  }
</script>

<style scoped>
  .grid-container {
    display: grid;
    grid-template-areas: 
      "block1 block2 block5"
      "block3 block4 block5"
      "block6 block6 block5";
    grid-template-columns: 2fr 2fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 30px;
    height: calc(100vh - 50px); /* Altura por espacio disponible */
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
    margin-bottom: 10px; /* Añade separación inferior */
  }

  .block-title svg {
    margin-right: 10px; /* Añade separación derecha del icono */
  }

  .block1, .block2, .block3, .block4{
    max-width: 570px;
    max-height: 170px;
  }

  .block5{
    max-width: 100%;
    max-height: 100%;
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

  .block1{
    grid-area: block1;
    max-height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 250px;
  }
  .block2 {
    grid-area: block2;
    max-height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 250px;
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
    min-height: 250px;
    max-height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .block5 { grid-area: block5; }
  .block6 {
    grid-area: block6;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  @media (max-width: 800px) {
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
