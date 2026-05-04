import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import './styles.css'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'caccia',
    themes: {
      caccia: {
        dark: false,
        colors: {
          primary: '#12324a',
          secondary: '#d4e4f2',
          accent: '#a81d1d',
          background: '#f4efe6',
          surface: '#fffdf8'
        }
      }
    }
  }
})

createApp(App).use(router).use(vuetify).mount('#app')
