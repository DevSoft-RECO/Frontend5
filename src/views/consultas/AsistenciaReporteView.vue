<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Registro de Asistencias
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Consulta y seguimiento cronológico de la asistencia de asociados.
        </p>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex flex-col md:flex-row gap-4 items-end">
            <div class="w-full md:w-48">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Año de Gestión</label>
                <select v-model="selectedYear" 
                        @change="fetchData(1)"
                        class="w-full rounded-xl border-gray-200 shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all">
                    <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>
            
            <div class="flex-1">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Buscar Asociado</label>
                <div class="flex gap-2">
                    <div class="relative flex-1">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </span>
                        <input v-model="searchQuery" 
                               type="text" 
                               placeholder="DPI, Código o Nombre..." 
                               class="w-full pl-10 rounded-xl border-gray-200 shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                               @keyup.enter="fetchData(1)"
                        >
                    </div>
                    <button @click="fetchData(1)" 
                            class="px-6 py-2 bg-verde-cope hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all flex items-center gap-2">
                        <span>Consultar</span>
                    </button>
                    <button @click="handleDownload" 
                            :disabled="exporting"
                            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50">
                        <svg v-if="!exporting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>{{ exporting ? 'Exportando...' : 'Descargar CSV' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Results Table -->
    <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha / Hora</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Código</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Asociado</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">DPI / CUI</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Ubicación</th>
                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Tipo</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
                        <td colspan="6" class="px-6 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div></td>
                    </tr>
                    <tr v-else v-for="item in asistencias" :key="item.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                        <td class="px-6 py-4">
                            <div class="text-sm font-bold text-gray-900 dark:text-white">{{ formatDate(item.fecha_asistencia) }}</div>
                            <div class="text-[10px] text-gray-400 uppercase">{{ formatTime(item.fecha_asistencia) }}</div>
                        </td>
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-bold">
                                {{ item.codigo_cliente }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {{ item.nombre_completo }}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">
                            {{ item.dpi }}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {{ item.ubicacion }}
                        </td>
                        <td class="px-6 py-4 text-center">
                            <span :class="[
                                'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter',
                                item.tipo_asistencia === 'sistema' 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                            ]">
                                {{ item.tipo_asistencia }}
                            </span>
                        </td>
                    </tr>
                    <tr v-if="!loading && asistencias.length === 0">
                        <td colspan="6" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center justify-center text-gray-400">
                                <svg class="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                <p class="text-lg font-bold">No se encontraron registros</p>
                                <p class="text-sm">Intente ajustando los filtros o el término de búsqueda.</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > 0" class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30 flex items-center justify-between">
            <div class="text-xs text-gray-500 dark:text-gray-400">
                Mostrando <span class="font-bold text-gray-900 dark:text-white">{{ pagination.from }}</span> a 
                <span class="font-bold text-gray-900 dark:text-white">{{ pagination.to }}</span> de 
                <span class="font-bold text-gray-900 dark:text-white">{{ pagination.total }}</span> registros
            </div>
            
            <div class="flex gap-1">
                <button v-for="page in visiblePages" 
                        :key="page"
                        @click="typeof page === 'number' && fetchData(page)"
                        :disabled="page === pagination.current_page || page === '...'"
                        :class="[
                            'w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center',
                            page === pagination.current_page 
                                ? 'bg-verde-cope text-white shadow-md shadow-green-500/20' 
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-verde-cope hover:text-verde-cope'
                        ]"
                >
                    {{ page }}
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

interface AsistenciaRegistro {
    id: number
    codigo_cliente: number
    dpi: string
    nombre_completo: string
    ubicacion: string
    fecha_asistencia: string
    tipo_asistencia: 'sistema' | 'manual'
}

interface PaginationData {
    total: number
    per_page: number
    current_page: number
    last_page: number
    from: number
    to: number
    links: any[]
}

const loading = ref(false)
const exporting = ref(false)
const asistencias = ref<AsistenciaRegistro[]>([])
const searchQuery = ref('')
const selectedYear = ref(new Date().getFullYear())
const availableYears = ref([2024, 2025, 2026, 2027, 2028])

const pagination = ref<PaginationData>({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
    links: []
})

const fetchData = async (page = 1) => {
    loading.value = true
    try {
        const response = await axios.get('http://localhost:8004/api/asistencia/reporte', {
            params: {
                page,
                query: searchQuery.value,
                year: selectedYear.value,
                per_page: pagination.value.per_page
            }
        })
        
        if (response.data.success) {
            asistencias.value = response.data.data.data
            pagination.value = {
                total: response.data.data.total,
                per_page: response.data.data.per_page,
                current_page: response.data.data.current_page,
                last_page: response.data.data.last_page,
                from: response.data.data.from || 0,
                to: response.data.data.to || 0,
                links: response.data.data.links
            }
        }
    } catch (error) {
        console.error('Error fetching asistencias:', error)
    } finally {
        loading.value = false
    }
}

const handleDownload = async () => {
    exporting.value = true
    try {
        const response = await axios.get('http://localhost:8004/api/asistencia/export', {
            params: { year: selectedYear.value },
            responseType: 'blob'
        })
        
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `asistencias_${selectedYear.value}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        console.error('Error downloading CSV:', error)
    } finally {
        exporting.value = false
    }
}

const visiblePages = computed(() => {
    const pages: (number | string)[] = []
    const total = pagination.value.last_page
    const current = pagination.value.current_page

    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
    } else {
        pages.push(1)
        if (current > 3) pages.push('...')
        
        const start = Math.max(2, current - 1)
        const end = Math.min(total - 1, current + 1)
        
        for (let i = start; i <= end; i++) pages.push(i)
        
        if (current < total - 2) pages.push('...')
        pages.push(total)
    }
    return pages
})

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-GT', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    })
}

const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('es-GT', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    })
}

onMounted(() => {
    fetchData()
})
</script>
