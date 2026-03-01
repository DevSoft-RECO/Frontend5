<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Búsqueda de Cliente
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Validación de datos y consulta de saldos de colocación.
        </p>
      </div>
    </div>

    <!-- Search Card -->
    <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div class="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
            <div class="w-full md:w-1/3">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Buscar por</label>
                <select v-model="searchField" 
                        class="w-full rounded-xl border-gray-200 shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all">
                    <option value="dpi">DPI / CUI</option>
                    <option value="codigo_cliente">Código de Cliente</option>
                </select>
            </div>
            
            <div class="flex-1">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Valor de búsqueda</label>
                <div class="flex gap-2">
                    <input v-model="searchQuery" 
                           type="text" 
                           :placeholder="searchField === 'dpi' ? 'Ej. 1234567890101' : 'Ej. 1675931'" 
                           class="flex-1 rounded-xl border-gray-200 shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                           @keyup.enter="handleSearch"
                    >
                    <button @click="handleSearch" 
                            :disabled="loading || !searchQuery"
                            class="px-6 py-2 bg-verde-cope hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 disabled:opacity-50 transition-all flex items-center gap-2">
                        <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{{ loading ? 'Buscando...' : 'Consultar' }}</span>
                    </button>
                </div>
            </div>
        </div>
        <p v-if="error" class="text-red-500 text-sm mt-4 text-center font-medium">{{ error }}</p>
    </div>

    <div v-if="result" class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
        
        <!-- Result Card: Personal Info -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex items-center gap-3">
                <div class="w-8 h-8 bg-verde-cope/10 text-verde-cope rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Información Personal</h3>
            </div>
            
            <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div class="space-y-1">
                    <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">Código de Cliente</span>
                    <p class="text-gray-900 dark:text-gray-100 font-bold text-lg">{{ result.personal.codigo_cliente }}</p>
                </div>
                
                <div class="space-y-1">
                    <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">Nombre Completo</span>
                    <p class="text-gray-900 dark:text-gray-100 font-medium">
                        {{ [result.personal.nombre1, result.personal.nombre2, result.personal.nombre3, result.personal.apellido1, result.personal.apellido2].filter(Boolean).join(' ') }}
                    </p>
                </div>

                <div class="space-y-1">
                    <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">DPI / CUI</span>
                    <p class="text-gray-900 dark:text-gray-100">{{ result.personal.dpi }}</p>
                </div>

                <div class="space-y-1">
                    <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">Género</span>
                    <p class="text-gray-900 dark:text-gray-100">{{ result.personal.genero || 'No especificado' }}</p>
                </div>

                <div class="space-y-1">
                    <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">Celular</span>
                    <p class="text-gray-900 dark:text-gray-100">{{ result.personal.celular || 'N/A' }}</p>
                </div>

                <div class="space-y-1">
                    <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">Edad</span>
                    <p class="text-gray-900 dark:text-gray-100">{{ result.personal.edad }} años</p>
                </div>

                <div class="sm:col-span-2 space-y-1">
                    <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">Ubicación</span>
                    <p class="text-gray-900 dark:text-gray-100">
                        {{ result.personal.muni_domicilio }}, {{ result.personal.depto_domicilio }}
                    </p>
                </div>
            </div>
            
            <!-- Quick Balances from Client CSV -->
            <div class="bg-gray-50 dark:bg-gray-900/30 p-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4">
                <div class="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <span class="block text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-1">Saldo Aportaciones</span>
                    <p class="text-verde-cope font-bold text-lg">{{ formatCurrency(result.personal.saldo_aportaciones) }}</p>
                </div>
                <div class="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <span class="block text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-1">Saldo Ahorros</span>
                    <p class="text-blue-600 font-bold text-lg">{{ formatCurrency(result.personal.saldo_ahorros) }}</p>
                </div>
            </div>
        </div>

        <!-- Result Card: Colocacion Info -->
        <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-600/10 text-blue-600 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Créditos (Colocación)</h3>
            </div>

            <div v-if="result.colocacion" class="p-6 flex-1 space-y-6">
                <div class="space-y-1">
                    <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">No. Documento</span>
                    <p class="text-gray-900 dark:text-gray-100 font-mono font-bold">{{ result.colocacion.numerodocumento }}</p>
                </div>

                <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                    <span class="block text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">Días de Mora</span>
                    <p class="text-orange-700 dark:text-orange-300 font-bold text-3xl">{{ result.colocacion.diasmora }}</p>
                </div>

                <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <span class="block text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Saldo Capital</span>
                    <p class="text-blue-700 dark:text-blue-300 font-bold text-3xl">{{ formatCurrency(result.colocacion.saldocapital) }}</p>
                </div>

                <div class="text-[10px] text-gray-400 text-right italic pt-4">
                    Actualizado: {{ formatDate(result.colocacion.updated_at) }}
                </div>
            </div>

            <div v-else class="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                </div>
                <div>
                    <p class="text-gray-900 dark:text-white font-bold text-lg">Sin Créditos Activos</p>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">Esta persona no posee créditos todavía en nuestro sistema.</p>
                </div>
            </div>
        </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

interface ClientPersonal {
    codigo_cliente: number
    nombre1: string
    nombre2: string
    nombre3: string
    apellido1: string
    apellido2: string
    celular: string
    genero: string
    dpi: string
    depto_domicilio: string
    muni_domicilio: string
    edad: number
    saldo_aportaciones: number
    saldo_ahorros: number
}

interface ColocacionData {
    numerodocumento: string
    diasmora: number
    saldocapital: string | number
    updated_at: string
}

interface SearchResult {
    personal: ClientPersonal
    colocacion: ColocacionData | null
}

const searchField = ref<'dpi' | 'codigo_cliente'>('dpi')
const searchQuery = ref('')
const result = ref<SearchResult | null>(null)
const loading = ref(false)
const error = ref('')

const handleSearch = async () => {
    if (!searchQuery.value) return
    
    loading.value = true
    error.value = ''
    result.value = null

    try {
        const response = await axios.post('http://localhost:8004/api/clientes/search', {
            field: searchField.value,
            query: searchQuery.value
        })
        
        if (response.data.success) {
            result.value = response.data.data
        }
    } catch (err: any) {
        if (err.response && err.response.status === 404) {
            error.value = 'No se encontró ningún registro con el valor proporcionado.'
        } else {
            error.value = 'Ocurrió un error al realizar la consulta. Intente nuevamente.'
            console.error(err)
        }
    } finally {
        loading.value = false
    }
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('es-GT', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    })
}

const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num)) return 'Q 0.00'
    return new Intl.NumberFormat('es-GT', { 
        style: 'currency', 
        currency: 'GTQ' 
    }).format(num)
}
</script>

<style scoped>
.animate-in {
    animation-duration: 0.5s;
    animation-fill-mode: both;
}

@keyframes slideInFromBottom {
    0% { transform: translateY(1rem); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
}

.slide-in-from-bottom-4 {
    animation-name: slideInFromBottom;
}
</style>
