import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/global.css'
import './styles/transitions.css'
import './styles/glitch.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
