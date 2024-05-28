<template>
	<div class="calendar-page">
		<div class="calendar-container">
			<vue-cal
			active-view="month"
			:events="events"
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
        //VUE CALENDAR
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
    },
    setup() {
      const app = inject('app');
      const dao = inject('dao');
      return { app, dao };
    },
    methods: {
      cargarSesiones(){
        this.dao.session.read().then((response) => {
          console.info('Respuesta del servidor: ',response);
          
          /* { FORMATO
            start: '2024-11-19 10:35',
            end: '2024-11-19 11:30',
            title: 'Doctor appointment'
          }, */

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
