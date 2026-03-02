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

    <!-- Stats Grid (Attendance) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Card -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group transition-all hover:shadow-2xl">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-azul-cope/5 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-azul-cope/10 rounded-2xl flex items-center justify-center text-azul-cope">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Asistencia Total</h3>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-black text-gray-900 dark:text-white transition-all transform group-hover:translate-x-1">{{ stats.total }}</span>
            <span class="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-lg">Asociados</span>
          </div>
          <p class="text-xs text-gray-400 mt-2">Registros consolidados de asistencia hoy</p>
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

    <!-- Resultados Electorales Section -->
    <div v-if="stats.candidatos && stats.candidatos.length > 0" 
         id="results-container"
         class="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden relative transition-all duration-500">
      <!-- Decorative Background -->
      <div class="absolute top-0 right-0 p-8 opacity-5">
        <svg class="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
      </div>

      <div class="relative z-10" :class="[isFullscreen ? 'flex-1 flex flex-col' : '']">
        <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-4">
            <div class="space-y-4">
                <div>
                   <h2 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Resultados Asamblea {{ stats.year }}</h2>
                   <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Total de votos de la Asamblea</p>
                </div>
                <!-- Enhanced Stats Badges (Enlarged) -->
                <div class="flex flex-wrap gap-4">
                    <div class="px-6 py-3 bg-verde-cope text-white rounded-2xl text-sm font-black uppercase shadow-xl shadow-verde-cope/20 flex flex-col items-center min-w-[130px] transition-transform hover:scale-105">
                        <span class="text-[11px] opacity-70">Votos Válidos</span>
                        <span class="text-2xl leading-none mt-1">{{ stats.votos_validos }}</span>
                    </div>
                    <div class="px-6 py-3 bg-red-600 text-white rounded-2xl text-sm font-black uppercase shadow-xl shadow-red-600/20 flex flex-col items-center min-w-[130px] transition-transform hover:scale-105">
                        <span class="text-[11px] opacity-70">Votos Nulos</span>
                        <span class="text-2xl leading-none mt-1">{{ stats.votos_nulos }}</span>
                    </div>
                    <div class="px-6 py-3 bg-gray-500 text-white rounded-2xl text-sm font-black uppercase shadow-xl shadow-gray-500/20 flex flex-col items-center min-w-[130px] transition-transform hover:scale-105">
                        <span class="text-[11px] opacity-70">En Blanco</span>
                        <span class="text-2xl leading-none mt-1">{{ stats.votos_blancos }}</span>
                    </div>
                    <div class="px-6 py-3 bg-azul-cope text-white rounded-2xl text-sm font-black uppercase shadow-xl shadow-azul-cope/20 flex flex-col items-center min-w-[130px] transition-transform hover:scale-105">
                        <span class="text-[11px] opacity-70">Total Votantes</span>
                        <span class="text-2xl leading-none mt-1">{{ stats.total_votantes }}</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <button v-if="!isFullscreen"
                        @click="toggleFullscreen" 
                        class="px-5 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-3">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                    <span>Pantalla Completa</span>
                </button>
                <div class="px-5 py-3 bg-verde-cope/10 text-verde-cope rounded-2xl font-black text-xs uppercase shadow-sm border border-verde-cope/20 flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-verde-cope animate-pulse"></span>
                    En Vivo
                </div>
            </div>
        </div>

        <!-- Vertical Chart Layout (Optimized for no-scroll) -->
        <div :class="[isFullscreen ? 'flex-1 flex gap-6 pb-2 items-stretch' : 'flex flex-wrap gap-4 overflow-x-auto pb-4']">
            <div v-for="(candidato, index) in sortedCandidatos" :key="candidato.id" 
                 :class="[
                    'group relative flex flex-col items-center transition-all hover:bg-gray-50 dark:hover:bg-gray-900/40 rounded-[40px] border border-transparent',
                    isFullscreen ? 'flex-1 min-w-0 px-6 pt-4 pb-0' : 'w-56 shrink-0 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4'
                 ]">
                
                <!-- 1. Candidate Photo (Top) -->
                <div class="relative mb-4 shrink-0">
                    <img :src="candidato.foto_url || '/placeholder-user.png'" 
                         class="rounded-full object-cover border-4 transition-transform duration-500 group-hover:scale-105" 
                         :class="[
                            isFullscreen ? 'w-24 h-24 md:w-36 md:h-36' : 'w-24 h-24',
                            index === 0 ? 'border-verde-cope shadow-[0_0_30px_rgba(94,179,1,0.4)]' : 'border-white dark:border-gray-800 shadow-2xl'
                         ]"
                         alt="Avatar">
                    
                    <!-- Rank Badge -->
                    <div class="absolute -top-3 -right-3 w-10 h-10 md:w-14 md:h-14 text-white text-xl font-black flex items-center justify-center rounded-2xl shadow-2xl border-4 border-white dark:border-gray-800"
                         :class="index === 0 ? 'bg-verde-cope' : 'bg-azul-cope'">
                        {{ index + 1 }}
                    </div>
                </div>

                <!-- 2. Vertical Bar (Middle) -->
                <div class="flex-1 w-full flex flex-col items-center justify-end px-4 gap-2">
                    <!-- Vote Count (Above Bar) -->
                    <div class="text-center">
                        <span class="font-black text-gray-900 dark:text-white tabular-nums leading-none block"
                              :class="[isFullscreen ? 'text-3xl md:text-5xl' : 'text-3xl']">
                            {{ candidato.total_votos }}
                        </span>
                        <span class="text-[12px] font-black uppercase italic text-gray-600 dark:text-gray-400">Votos</span>
                    </div>

                    <!-- The Bar (Taller) -->
                    <div class="relative w-10 md:w-16 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden border border-gray-200/10 p-1.5"
                         :class="[isFullscreen ? 'min-h-[160px] flex-1' : 'h-40']">
                        <div class="absolute inset-x-1.5 bottom-1.5 bg-gradient-to-t transition-all duration-1000 ease-out shadow-lg rounded-full"
                             :class="[
                                index === 0 ? 'from-verde-cope to-green-500' : 
                                index === 1 ? 'from-azul-cope to-blue-500' : 'from-gray-400 to-gray-500'
                             ]"
                             :style="{ height: `calc(${(candidato.total_votos / maxVotes) * 100}% - 12px)` }">
                             <!-- Subtle Glow -->
                             <div class="absolute inset-x-0 top-0 h-24 bg-white/20 blur-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <!-- 3. Candidate Name (Bottom) -->
                <div class="mt-4 mb-2 text-center w-full">
                    <h4 class="font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight"
                        :class="[isFullscreen ? 'text-sm md:text-xl line-clamp-2 h-10 md:h-16' : 'text-sm truncate']">
                        {{ candidato.nombre_completo }}
                    </h4>
                    <div v-if="index === 0" class="mt-1">
                        <span class="px-3 py-1 bg-verde-cope/20 text-verde-cope text-[11px] font-black rounded-xl uppercase tracking-widest border border-verde-cope/20">
                            🏆 Líder Actual
                        </span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import axios from 'axios'

const stats = ref<any>({
  total: 0,
  sistema: 0,
  manual: 0,
  year: new Date().getFullYear(),
  candidatos: [],
  votos_validos: 0,
  votos_nulos: 0,
  votos_blancos: 0,
  total_votantes: 0
})

const lastUpdate = ref('')
const isFullscreen = ref(false)

const sortedCandidatos = computed(() => {
    if (!stats.value.candidatos) return []
    return [...stats.value.candidatos].sort((a: any, b: any) => b.total_votos - a.total_votos)
})

const maxVotes = computed(() => {
    if (!stats.value.candidatos || stats.value.candidatos.length === 0) return 1
    const max = Math.max(...stats.value.candidatos.map((c: any) => (c.total_votos || 0)))
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

const toggleFullscreen = () => {
    const elem = document.getElementById('results-container');
    if (!elem) return;

    if (!document.fullscreenElement) {
        elem.requestFullscreen().catch((err) => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement;
}

onMounted(() => {
  fetchStats()
  
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  
  // Refrescar cada 10 segundos
  const interval = setInterval(fetchStats, 10000);
  
  onUnmounted(() => {
    clearInterval(interval);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  });
})
</script>

<style>
/* Global styles for Fullscreen API */
#results-container:fullscreen {
  background-color: white !important;
  padding: 3rem !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}

/* Force Dark Mode in Fullscreen */
html.dark #results-container:fullscreen {
  background-color: #0f172a !important;
  color: white !important;
}

/* Specific overrides for nested elements in fullscreen dark mode */
html.dark #results-container:fullscreen h2,
html.dark #results-container:fullscreen h4,
html.dark #results-container:fullscreen span.text-gray-900,
html.dark #results-container:fullscreen .text-white {
    color: white !important;
}

html.dark #results-container:fullscreen .text-gray-900 { color: #f9fafb !important; }
html.dark #results-container:fullscreen .text-gray-600 { color: #d1d5db !important; }
html.dark #results-container:fullscreen .bg-white { background-color: #1e293b !important; }
html.dark #results-container:fullscreen .bg-gray-100 { background-color: #334155 !important; }

/* Animation and Transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 1000ms;
}
</style>

<style scoped>
/* Scoped component styles */
@keyframes barGrow {
    from { height: 0; }
}

/* Ensure the layout respects the container's height in fullscreen */
:fullscreen #results-container {
    height: 100%;
}
</style>
