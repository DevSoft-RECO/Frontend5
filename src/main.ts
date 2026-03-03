import './assets/main.css'

// Autorecarga si falla la carga de un chunk (común tras despliegues en producción)
window.addEventListener('vite:preloadError', (event) => {
    console.error('Error al cargar chunk de Vite:', event);
    window.location.reload();
});

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useLayoutStore } from '@/stores/layout'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const layoutStore = useLayoutStore()
layoutStore.initTheme()

// Detectar cambios del sistema en tiempo real
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!localStorage.getItem('theme')) {
        layoutStore.initTheme()
    }
})

app.mount('#app')
