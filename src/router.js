import { createRouter, createWebHashHistory } from 'vue-router'
import SearchView from './views/SearchView.vue'
import InterpolProfileView from './views/InterpolProfileView.vue'
import InterpolNotFoundView from './views/InterpolNotFoundView.vue'

const routes = [
  {
    path: '/',
    name: 'interpol',
    component: SearchView
  },
  {
    path: '/interpol/dossier/:slug',
    name: 'interpol-profile',
    component: InterpolProfileView
  },
  {
    path: '/interpol/not-found',
    name: 'interpol-not-found',
    component: InterpolNotFoundView
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
