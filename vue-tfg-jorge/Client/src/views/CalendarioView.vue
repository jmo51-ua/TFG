<template>
	<div class="calendar-page">
		<div class="calendar-container">
			<vue-cal
			active-view="month"
			:events="sessions"
			@cell-click="onCellClick"
			@event-click="onEventClick"
			class="vue-cal-custom"
			:locale="es"
			style="width: 100%;">
			</vue-cal>
		</div>
	</div>
</template>

<script>
  import { inject } from 'vue';
  import { mapGetters } from 'vuex';
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';

  export default {
    name: 'CalendarioView',
    components: {
      VueCal,
    },
    data() {
      return {
		    sessions: [],
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
      ...mapGetters(['userID']),
    },
    setup() {
      const app = inject('app');
      const dao = inject('dao');
      return { app, dao };
    },
    methods: {
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
      async cargarSesiones() {
        try {
          const actores = (await this.dao.actor.read()).filter(actor => actor.User_idUser == this.userID);
          for (const actor of actores) {
            const sesiones = (await this.dao.session.read()).filter(sesion => sesion.Actor_idActor == actor.idActor && sesion.date != null);
            for (const element of sesiones) {
              this.sessions.push({
                start: this.carcularTimeStart(element.date.toString(), element.time.toString()),
                end: this.carcularTimeEnd(element.date.toString(), element.time.toString(), element.duration),
                title: element.name,
              });
            }
          }
        } catch (error) {
          console.error('Error al cargar las sesiones:', error);
        }
      },
      onCellClick({ startDate, endDate }) {
        console.log(`Clicked on cell from ${startDate} to ${endDate}`);
      },
      onEventClick(event) {
        console.log(`Clicked on event: ${event.title}`);
      },
    },
    created() {
      this.cargarSesiones();
    }
  }
</script>

<style scoped>
	.calendar-page{
		padding-top: 30px;
		width: 90%;
		display: flex;
		align-content: center;
		align-items: center;
		flex-direction: column;
	}
	.vue-cal-custom {
		max-width: 100%;
		height: 600px;
	}
	.calendar-container {
		width: 100%;
	}

</style>
