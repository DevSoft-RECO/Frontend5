<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Panel de Control
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Resumen de métricas y resultados - Gestión {{ stats.year }}
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
      <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group transition-all hover:shadow-2xl">
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
      <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group transition-all hover:shadow-2xl">
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
      <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group transition-all hover:shadow-2xl">
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
    <div class="bg-gradient-to-br from-azul-cope to-blue-900 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
      <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-45 transition-transform duration-700">
        <svg class="w-56 h-56" fill="white" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <div class="relative z-10 max-w-2xl">
        <h2 class="text-white text-3xl font-black mb-4 uppercase tracking-tighter italic">Navegación Rápida</h2>
        <p class="text-blue-100 mb-8 font-medium text-lg opacity-80">Gestione el flujo de asociados y el escrutinio de votos desde una sola consola centralizada.</p>
        <div class="flex flex-wrap gap-4">
          <RouterLink to="/admin/consultas/busqueda-cliente" class="px-8 py-4 bg-verde-cope hover:bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all transform hover:-translate-y-1 active:scale-95">
            Verificar Asociado
          </RouterLink>
          <RouterLink to="/admin/votos/registrar" class="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-black uppercase tracking-widest text-sm backdrop-blur-xl transition-all active:scale-95">
            Registrar Votos
          </RouterLink>
          <RouterLink to="/admin/urnas" class="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-black uppercase tracking-widest text-sm backdrop-blur-xl transition-all active:scale-95">
            Gestionar Urnas
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Resultados Electorales Section -->
    <div v-if="stats.candidatos && stats.candidatos.length > 0" 
         class="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden relative">
      <!-- Decorative Background -->
      <div class="absolute top-0 right-0 p-8 opacity-5">
        <svg class="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
      </div>

      <div class="relative z-10">
        <div class="flex items-center justify-between mb-8">
            <div>
                <h2 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Resultados de Votos {{ stats.year }}</h2>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Monitoreo de votos en tiempo real por candidato</p>
            </div>
            <div class="px-4 py-2 bg-verde-cope/10 text-verde-cope rounded-2xl font-black text-xs uppercase shadow-sm border border-verde-cope/20">
                En Vivo
            </div>
        </div>

        <div class="space-y-6">
            <div v-for="(candidato, index) in sortedCandidatos" :key="candidato.id" 
                 class="group relative flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl transition-all hover:bg-gray-50 dark:hover:bg-gray-900/40">
                
                <!-- Candidate Info -->
                <div class="flex items-center gap-4 w-full md:w-64 shrink-0">
                    <div class="relative shrink-0">
                        <img :src="candidato.foto_url || '/placeholder-user.png'" 
                             class="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-gray-800 shadow-lg group-hover:scale-110 transition-transform duration-500" 
                             alt="Avatar">
                        <div class="absolute -top-2 -left-2 w-6 h-6 bg-azul-cope text-white text-[10px] font-black flex items-center justify-center rounded-lg shadow-md border-2 border-white dark:border-gray-800">
                            {{ index + 1 }}
                        </div>
                    </div>
                    <div class="min-w-0">
                        <h4 class="font-black text-gray-900 dark:text-white truncate leading-none mb-1">{{ candidato.nombre_completo }}</h4>
                        <span class="text-[10px] font-black text-azul-cope uppercase tracking-tight">Votos Totales (Todas las Mesas)</span>
                    </div>
                </div>

                <!-- Bar Container -->
                <div class="flex-1 flex items-center gap-4">
                    <div class="relative flex-1 h-3 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden border border-gray-200/20">
                        <div class="absolute inset-y-0 left-0 bg-gradient-to-r transition-all duration-1000 ease-out shadow-lg"
                             :class="[
                                index === 0 ? 'from-verde-cope to-green-500' : 
                                index === 1 ? 'from-azul-cope to-blue-500' : 'from-gray-400 to-gray-500'
                             ]"
                             :style="{ width: `${(candidato.total_votos / maxVotes) * 100}%` }">
                             <!-- Subtle Glow -->
                             <div class="absolute top-0 right-0 bottom-0 w-8 bg-white/20 blur-sm animate-pulse"></div>
                        </div>
                    </div>
                    <div class="shrink-0 text-right min-w-[100px]">
                        <span class="text-xl font-black text-gray-900 dark:text-white tabular-nums">{{ candidato.total_votos }}</span>
                        <span class="text-[10px] font-black text-gray-400 uppercase ml-1.5">Votos</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const stats = ref<any>({
  total: 0,
  sistema: 0,
  manual: 0,
  year: new Date().getFullYear(),
  candidatos: []
})

const lastUpdate = ref('')

const sortedCandidatos = computed(() => {
    if (!stats.value.candidatos) return []
    return [...stats.value.candidatos].sort((a: any, b: any) => b.total_votos - a.total_votos)
})

const maxVotes = computed(() => {
    if (!stats.value.candidatos || stats.value.candidatos.length === 0) return 1
    const max = Math.max(...stats.value.candidatos.map((c: any) => c.total_votos))
    return max === 0 ? 1 : max
})

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

<style scoped>
/* Optional: Custom font or animations for the bars */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 1000ms;
}
</style>
