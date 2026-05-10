import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import SearchView from './views/SearchView.vue'
import InterpolProfileView from './views/InterpolProfileView.vue'
import InterpolNotFoundView from './views/InterpolNotFoundView.vue'
import { hasUnlockedSearch } from './stores/riddle'

function requireUnlockedSearch() {
  if (hasUnlockedSearch()) {
    return true
  }

  return { name: 'home' }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/interpol',
    name: 'interpol',
    component: SearchView,
    beforeEnter: requireUnlockedSearch
  },
  {
    path: '/interpol/dossier/:slug',
    name: 'interpol-profile',
    component: InterpolProfileView,
    beforeEnter: requireUnlockedSearch
  },
  {
    path: '/interpol/not-found',
    name: 'interpol-not-found',
    component: InterpolNotFoundView,
    beforeEnter: requireUnlockedSearch
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
