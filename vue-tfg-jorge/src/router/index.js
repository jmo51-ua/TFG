import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Inicio',
      component: HomeView
    },
    {
      path: '/about',
      name: 'Sobre Nosotros',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/equipo',
      name: 'Equipo',
      component: () => import('../views/TeamView.vue')
    },
    {
      path: '/stats',
      name: 'Estadísticas',
      component: () => import('../views/StatsView.vue')
    },
    {
      path: '/mensajes',
      name: 'Mensajes',
      component: () => import('../views/MensajesView.vue')
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
      component: () => import('../views/SinglePlayerView.vue')
    },
  ]
})

export default router
