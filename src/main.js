import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './styles/global.css'
import './styles/transitions.css'
import './styles/glitch.css'

import { initParticles } from './particles'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

// Start particle system outside Vue — pure DOM canvas
initParticles()
