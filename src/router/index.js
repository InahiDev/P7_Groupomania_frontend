import { createRouter, createWebHistory } from 'vue-router'
import LogView from '../views/Log.vue'
import HomeView from '../views/Home.vue'
import UserView from '../views/User.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LogView,
    meta: {
      title: "Connexion",
    }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    props: true,
    meta: {
      title: "Accueil"
    }
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
    props: true,
    meta: {
      title: "Page Utilisateur"
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.
//component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),


export default router
