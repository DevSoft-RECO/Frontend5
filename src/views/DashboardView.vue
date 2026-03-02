<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Panel de Control
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Resumen de métricas de asistencia - Gestión {{ stats.year }}
        </p>
      </div>
      <div class="flex items-center gap-2 text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        Actualizado: {{ lastUpdate }}
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Card -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-azul-cope/5 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-azul-cope/10 rounded-2xl flex items-center justify-center text-azul-cope">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Asistentes</h3>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-black text-gray-900 dark:text-white transition-all transform group-hover:translate-x-1">{{ stats.total }}</span>
            <span class="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-lg">+100%</span>
          </div>
          <p class="text-xs text-gray-400 mt-2">Registros consolidados del año actual</p>
        </div>
      </div>

      <!-- Sistema Card -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-green-500/5 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Registro Sistema</h3>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-black text-gray-900 dark:text-white transition-all transform group-hover:translate-x-1">{{ stats.sistema }}</span>
            <span class="text-xs font-bold text-green-500">{{ Math.round((stats.sistema/stats.total || 0) * 100) }}%</span>
          </div>
          <p class="text-xs text-gray-400 mt-2">Validados mediante búsqueda y reglas</p>
        </div>
      </div>

      <!-- Manual Card -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/5 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </div>
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Registro Manual</h3>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-black text-gray-900 dark:text-white transition-all transform group-hover:translate-x-1">{{ stats.manual }}</span>
            <span class="text-xs font-bold text-orange-400">{{ Math.round((stats.manual/stats.total || 0) * 100) }}%</span>
          </div>
          <p class="text-xs text-gray-400 mt-2">Registros de nuevos asociados hoy</p>
        </div>
      </div>
    </div>

    <!-- Quick Access Section -->
    <div class="bg-gradient-to-br from-azul-cope to-blue-900 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 right-0 p-4 opacity-10">
        <svg class="w-48 h-48 rotate-12" fill="white" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <div class="relative z-10 max-w-2xl">
        <h2 class="text-white text-2xl font-bold mb-2">Acciones Rápidas</h2>
        <p class="text-blue-100 mb-6 font-medium">Inicie una nueva verificación de asociado o consulte el reporte detallado de asistencias grabadas en tiempo real.</p>
        <div class="flex flex-wrap gap-4">
          <RouterLink to="/admin/consultas/busqueda-cliente" class="px-6 py-3 bg-verde-cope hover:bg-green-500 text-white rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-1">
            Iniciar Verificación
          </RouterLink>
          <RouterLink to="/admin/consultas/asistencias" class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold backdrop-blur-md transition-all">
            Ver Reporte Completo
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const stats = ref({
  total: 0,
  sistema: 0,
  manual: 0,
  year: new Date().getFullYear()
})

const lastUpdate = ref('')

const fetchStats = async () => {
  try {
    const response = await axios.get('http://localhost:8004/api/dashboard/stats')
    if (response.data.success) {
      stats.value = response.data.data
      lastUpdate.value = new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  }
}

onMounted(() => {
  fetchStats()
})
</script>
