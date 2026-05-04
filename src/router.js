import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import SearchView from './views/SearchView.vue'
import { hasUnlockedSearch } from './stores/riddle'

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
    beforeEnter: () => {
      if (hasUnlockedSearch()) {
        return true
      }

      return { name: 'home' }
    }
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
