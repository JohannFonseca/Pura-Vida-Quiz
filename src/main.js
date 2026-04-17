/**
 * main.js
 * 
 * Este es el "Corazón" que arranca todo. Aquí es donde le decimos a Vue:
 * "Ey, usa este componente (App.vue) y muéstralo en el index.html".
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// 1. Creamos la aplicación usando el componente raíz App.vue
const app = createApp(App)

// 2. Le decimos que use el sistema de rutas que configuramos
app.use(router)

// 3. Finalmente, conectamos la app con el div con id="app" del index.html
app.mount('#app')
