import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Inicio',
      component: () => import('../views/coach/HomeView.vue')
    },
    {
      path: '/equipo',
      name: 'Equipo',
      component: () => import('../views/coach/TeamView.vue')
    },
    {
      path: '/stats',
      name: 'Estadísticas',
      component: () => import('../views/coach/StatsView.vue')
    },
    {
      path: '/mensajes',
      name: 'Mensajes',
      component: () => import('../views/coach/MensajesView.vue')
    },
    {
      path: '/calendario',
      name: 'Calendario',
      component: () => import('../views/CalendarioView.vue')
    },
    {
      path: '/ajustes',
      name: 'Ajustes',
      component: () => import('../views/AjustesView.vue')
    },
    {
      path: '/singleplayer',
      name: 'Jugador',
      component: () => import('../views/coach/SinglePlayerView.vue')
    },
  ]
})

export default router
