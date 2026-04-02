/**
 * main.js
 * Punto de entrada — Vue 3.
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
