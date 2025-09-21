import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import MainMenu from './components/MainMenu.vue'
import GameBoard from './components/GameBoard.vue'
import './style.css'

const routes = [
  { path: '/', name: 'menu', component: MainMenu },
  { path: '/game', name: 'game', component: GameBoard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')