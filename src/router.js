import { createRouter, createWebHashHistory } from 'vue-router'
import SearchView from './views/SearchView.vue'
import InterpolProfileView from './views/InterpolProfileView.vue'
import { canAccessProfile } from './stores/access'

// Il dossier è accessibile solo se sbloccato dalla pagina di ricerca:
// l'accesso diretto via URL viene rimandato alla ricerca.
function requireSearchAccess(to) {
  if (canAccessProfile(to.params.slug)) {
    return true
  }

  return { name: 'interpol' }
}

const routes = [
  {
    path: '/',
    name: 'interpol',
    component: SearchView
  },
  {
    path: '/interpol/dossier/:slug',
    name: 'interpol-profile',
    component: InterpolProfileView,
    beforeEnter: requireSearchAccess
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
