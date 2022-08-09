import { createRouter, createWebHistory } from 'vue-router'
import Store from '../store/index'
import LogView from '../views/Log.vue'
import HomeView from '../views/Home.vue'
import UserView from '../views/User.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LogView,
    meta: {
      title: "Groupomania - Connexion",
      metaTags: [
        {
          name: "description",
          content: "Interface de connection et d'enregistrement de compte au réseau social d'entreprise Groupomania"
        }
      ]
    }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    props: true,
    meta: {
      title: "Groupomania - Accueil",
      metaTags: [
        {
          name: "description",
          content: "Page d'accueil du réseau social d'entreprise Groupomania. Un espace communautaire destiné aux membres de l'entreprise. Convivialité et respect sont de rigueur! Échanger, partager, liker!"
        }
      ]
    }
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
    props: true,
    meta: {
      title: "Groupomania - Page Personnelle",
      metaTags: [
        {
          name: "description",
          content: "Page personnelle de l'utilisateur du réseau social d'entreprise Groupomania. Vous pouvez ici, actualiser vos informations perosnnelles."
        }
      ]
    }
  },
  {
    name: "notFound",
    path: '/:pathmatch(.*)',
    component: NotFound,
    meta: {
      title: "Erreur 404 - Page non trouvée",
      metaTags: [
        {
          name: "description",
          content: "Page indisponible. La ressource demandée n'existe pas!"
        }
      ]
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

function updateTitleDescription(to, from) {
  const nearestWithTitle = to.matched.slice().reverse().find(route => route.meta && route.meta.title)
  const nearestWithMeta = to.matched.slice().reverse().find(route => route.meta && route.meta.metaTags)
  const previousNearestWithMeta = from.matched.slice().reverse().find(route => route.meta && route.meta.metaTags)

  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title
  } else if (previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title
  }

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(element => element.parentNode.removeChild(element))

  if (!nearestWithMeta) {
    return
  }

  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta')
    
    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key])
    })

    tag.setAttribute('data-vue-router-controlled', '')

    return tag
  })

  .forEach(tag => document.head.appendChild(tag))

}

function handleLoginPage(next) {
  if (Store.state.status == 'logedIn') {
    next('/home')
  } else if (localStorage.getItem('user')) {
    let user = JSON.parse(localStorage.getItem('user'))
    Store.dispatch('relog', user)
      .then(() => next('home'))
      .catch(() => {
        localStorage.removeItem('user')
        next('/')
      })
  } else {
    next()
  }
}

function relogUser(to, next) {
  if (to.name != 'login') {
    if (Store.state.status != 'logedIn' && to.name != 'login') {
      if (localStorage.getItem('user')) {
        let user = JSON.parse(localStorage.getItem('user'))
        Store.dispatch('relog', user)
          .then(() => next())
          .catch(() => next('/'))
      } else {
        next('/')
      }
    } else {
      next()
    } 
  } else {
    handleLoginPage(next)
  }
}

router.beforeEach((to, from, next) => {
  updateTitleDescription(to, from)
  relogUser(to, next)
})

router.afterEach((to) => {
  document.title = to.meta.title
})

// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.
//component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),


export default router 
