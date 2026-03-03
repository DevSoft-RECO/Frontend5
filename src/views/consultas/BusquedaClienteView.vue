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
        <div class="max-w-2xl mx-auto space-y-6">
            
            <!-- Tabs -->
            <div class="flex p-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl max-w-sm mx-auto">
                <button @click="activeTab = 'dpi'"
                        :class="['flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all', activeTab === 'dpi' ? 'bg-white dark:bg-gray-800 text-verde-cope shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300']">
                    Por DPI / Código
                </button>
                <button @click="activeTab = 'nombre'"
                        :class="['flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all', activeTab === 'nombre' ? 'bg-white dark:bg-gray-800 text-verde-cope shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300']">
                    Por Nombre
                </button>
            </div>

            <!-- Tab 1: DPI / Codigo -->
            <div v-show="activeTab === 'dpi'" class="space-y-4">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 text-center">Ingrese DPI o Código de Cliente</label>
                <div class="flex flex-col sm:flex-row gap-2">
                    <input v-model="searchQuery" 
                           type="text" 
                           placeholder="Ej. 1234567890101 o 1675931" 
                           class="flex-1 rounded-xl border-gray-200 shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all text-center"
                           @keyup.enter="handleSearch"
                    >
                    <button @click="handleSearch" 
                            :disabled="loading || !searchQuery"
                            class="px-8 py-3 bg-verde-cope hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group">
                        <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <svg v-else class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <span>{{ loading ? 'Buscando...' : 'Consultar' }}</span>
                    </button>
                </div>
            </div>

            <!-- Tab 2: Nombre -->
            <div v-show="activeTab === 'nombre'" class="space-y-4">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 text-center">Ingrese el Nombre Completo</label>
                <div class="flex flex-col sm:flex-row gap-2">
                    <input v-model="searchNameQuery" 
                           type="text" 
                           placeholder="Ej. Juan Perez Lopez" 
                           class="flex-1 rounded-xl border-gray-200 shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all text-center"
                           @keyup.enter="handleSearchName"
                    >
                    <button @click="handleSearchName" 
                            :disabled="loading || searchNameQuery.length < 3"
                            class="px-8 py-3 bg-azul-cope hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group">
                        <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <svg v-else class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <span>{{ loading ? 'Buscando...' : 'Buscar' }}</span>
                    </button>
                </div>
                <p v-if="searchNameQuery.length > 0 && searchNameQuery.length < 3" class="text-xs text-orange-500 text-center">Ingrese al menos 3 caracteres</p>
            </div>

            <p v-if="error" class="text-red-500 text-sm mt-4 text-center font-medium">{{ error }}</p>
        </div>
    </div>

    <!-- Name Search Results List -->
    <div v-if="nameResults.length > 0 && !result" class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
            Resultados Coincidentes ({{ nameResults.length }})
        </h3>
        <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="client in nameResults" :key="client.personal.codigo_cliente"
                 class="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-verde-cope/30 hover:bg-green-50/30 dark:hover:bg-green-900/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-full bg-verde-cope/10 text-verde-cope flex items-center justify-center font-bold shrink-0">
                        {{ client.personal.nombre1 ? client.personal.nombre1.charAt(0) : '?' }}
                    </div>
                    <div>
                        <p class="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-1">
                            {{ [client.personal.nombre1, client.personal.nombre2, client.personal.nombre3, client.personal.apellido1, client.personal.apellido2].filter(Boolean).join(' ') }}
                        </p>
                        <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                            <span class="flex items-center gap-1"><span class="font-bold">DPI:</span> {{ client.personal.dpi || 'N/A' }}</span>
                            <span class="flex items-center gap-1"><span class="font-bold">Código:</span> {{ client.personal.codigo_cliente }}</span>
                            <span class="flex items-center gap-1"><span class="font-bold">Ubicación:</span> {{ client.personal.muni_domicilio }}</span>
                        </div>
                    </div>
                </div>
                
                <button @click="selectNameResult(client)"
                        class="px-4 py-2 bg-verde-cope/10 text-verde-cope hover:bg-verde-cope hover:text-white rounded-lg font-bold text-sm transition-colors border border-verde-cope/20 whitespace-nowrap">
                    Verificar
                </button>
            </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
             <p class="text-xs text-gray-400 mb-3">¿No está en la lista la persona que busca?</p>
             <button @click="handleManualRegistration()" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold transition-colors">
                Registrar Asistencia Manualmente
             </button>
        </div>
    </div>

    <div v-if="result" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
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
                    <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">Fecha Nacimiento</span>
                    <p class="text-gray-900 dark:text-gray-100">{{ formatDate(result.personal.fecha_nacimiento) }}</p>
                </div>

                <div class="space-y-1">
                    <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">Edad</span>
                    <p class="text-gray-900 dark:text-gray-100 font-bold">{{ Math.floor(result.personal.edad) }} años</p>
                </div>

                <div class="sm:col-span-2 space-y-1">
                    <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">Ubicación</span>
                    <p class="text-gray-900 dark:text-gray-100">
                        {{ result.personal.muni_domicilio }}, {{ result.personal.depto_domicilio }}
                    </p>
                </div>
            </div>
            
            <!-- Quick Balances from Client CSV -->
            <div class="bg-gray-50 dark:bg-gray-900/30 p-6 border-t border-gray-100 dark:border-gray-700">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <span class="block text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-1">Saldo Aportaciones</span>
                        <p class="text-verde-cope font-bold text-lg">{{ formatCurrency(result.personal.saldo_aportaciones) }}</p>
                    </div>
                    <div class="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <span class="block text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-1">Saldo Ahorros</span>
                        <p class="text-blue-600 font-bold text-lg">{{ formatCurrency(result.personal.saldo_ahorros) }}</p>
                    </div>
                </div>

                <button @click="handleVerify"
                        :disabled="verifying"
                        class="w-full py-3 bg-gradient-to-r from-verde-cope to-[#4a9c02] hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 group">
                    <svg v-if="verifying" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>{{ verifying ? 'Verificando...' : 'Verificar Elegibilidad' }}</span>
                </button>
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
import api from '@/api/axios'
import Swal from 'sweetalert2'

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
    fecha_nacimiento: string
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

const activeTab = ref<'dpi' | 'nombre'>('dpi')
const searchQuery = ref('')
const searchNameQuery = ref('')
const result = ref<SearchResult | null>(null)
const nameResults = ref<SearchResult[]>([])
const loading = ref(false)
const error = ref('')
const verifying = ref(false)

const handleSearch = async () => {
    if (!searchQuery.value) return
    
    loading.value = true
    error.value = ''
    result.value = null
    nameResults.value = []

    try {
        const response = await api.post('/clientes/search', {
            query: searchQuery.value
        })
        
        if (response.data.success) {
            result.value = response.data.data
        }
    } catch (err: any) {
        if (err.response && err.response.status === 404) {
            Swal.fire({
                title: 'No se encontraron registros',
                text: 'La persona no se encuentra en los registros. ¿Posee código de cliente?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, registrar manualmente',
                cancelButtonText: 'No',
                confirmButtonColor: '#5eb301',
                cancelButtonColor: '#6b7280',
                customClass: { popup: 'rounded-3xl shadow-2xl' }
            }).then((alertResult) => {
                if (alertResult.isConfirmed) {
                    handleManualRegistration()
                }
            })
        } else {
            error.value = 'Ocurrió un error al realizar la consulta. Intente nuevamente.'
            console.error(err)
        }
    } finally {
        loading.value = false
    }
}

const handleSearchName = async () => {
    if (searchNameQuery.value.length < 3) return
    
    loading.value = true
    error.value = ''
    result.value = null
    nameResults.value = []

    try {
        const response = await api.post('/clientes/search-name', {
            query: searchNameQuery.value
        })
        
        if (response.data.success) {
            nameResults.value = response.data.data
        }
    } catch (err: any) {
        if (err.response && err.response.status === 404) {
            Swal.fire({
                title: 'No se encontraron registros',
                text: 'No se encontró a nadie con ese nombre. Verifique la escritura.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Registrar manualmente',
                cancelButtonText: 'Volver',
                confirmButtonColor: '#5eb301',
                cancelButtonColor: '#6b7280',
                customClass: { popup: 'rounded-3xl shadow-2xl' }
            }).then((alertResult) => {
                if (alertResult.isConfirmed) {
                    handleManualRegistration()
                }
            })
        } else {
            error.value = 'Ocurrió un error al realizar la consulta. Intente nuevamente.'
            console.error(err)
        }
    } finally {
        loading.value = false
    }
}

const selectNameResult = (client: SearchResult) => {
    // Treat the selected list item exactly as if we searched for it by DPI/Code directly
    result.value = client
    nameResults.value = []
}

const handleManualRegistration = async (isForcedByMora = false) => {
    const defaultCodigo = result.value?.personal?.codigo_cliente || '';
    const defaultDpi = result.value?.personal?.dpi || '';
    const defaultNombre = result.value?.personal ? [result.value.personal.nombre1, result.value.personal.nombre2, result.value.personal.nombre3, result.value.personal.apellido1, result.value.personal.apellido2].filter(Boolean).join(' ') : '';
    const defaultUbicacion = result.value?.personal ? `${result.value.personal.muni_domicilio}, ${result.value.personal.depto_domicilio}` : '';
    const defaultEdad = result.value?.personal?.edad ? Math.floor(result.value.personal.edad) : '';
    const defaultGenero = result.value?.personal?.genero?.toUpperCase() || '';

    const { value: formValues } = await Swal.fire({
        title: isForcedByMora ? 'Forzar Registro de Asistencia' : 'Registro de Asistencia Manual',
        html: `
            <div class="space-y-4 py-2">
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-left">
                        <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Código de Cliente</label>
                        <input id="swal-codigo" class="w-full rounded-xl border-gray-200 shadow-sm focus:border-verde-cope" placeholder="Ej. 1675931" value="${defaultCodigo}">
                    </div>
                    <div class="text-left">
                        <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">DPI / CUI</label>
                        <input id="swal-dpi" class="w-full rounded-xl border-gray-200 shadow-sm focus:border-verde-cope" placeholder="DPI" value="${defaultDpi}">
                    </div>
                </div>
                <div class="text-left">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre Completo</label>
                    <input id="swal-nombre" class="w-full rounded-xl border-gray-200 shadow-sm focus:border-verde-cope" placeholder="Nombre y Apellidos" value="${defaultNombre}">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-left">
                        <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Edad</label>
                        <input id="swal-edad" type="number" class="w-full rounded-xl border-gray-200 shadow-sm focus:border-verde-cope" placeholder="Edad" value="${defaultEdad}">
                    </div>
                    <div class="text-left">
                        <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Género</label>
                        <select id="swal-genero" class="w-full rounded-xl border-gray-200 shadow-sm focus:border-verde-cope">
                             <option value="" ${!defaultGenero ? 'selected' : ''}>Seleccione...</option>
                             <option value="MASCULINO" ${defaultGenero === 'MASCULINO' ? 'selected' : ''}>Masculino</option>
                             <option value="FEMENINO" ${defaultGenero === 'FEMENINO' ? 'selected' : ''}>Femenino</option>
                        </select>
                    </div>
                </div>
                <div class="text-left">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Ubicación</label>
                    <input id="swal-ubicacion" class="w-full rounded-xl border-gray-200 shadow-sm focus:border-verde-cope" placeholder="Municipio, Departamento" value="${defaultUbicacion}">
                </div>
                ${isForcedByMora ? `
                <div class="text-left mt-4 border-t border-gray-100 pt-4">
                    <label class="block text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">Observación (Justificación)</label>
                    <textarea id="swal-observacion" rows="2" class="w-full rounded-xl border-orange-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-orange-50/50 block" placeholder="Justifique por qué se inscribe aunque tenga mora..."></textarea>
                </div>
                ` : ''}
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Confirmar Asistencia',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#5eb301',
        customClass: { popup: 'rounded-3xl shadow-2xl' },
        preConfirm: () => {
            const codigo = (document.getElementById('swal-codigo') as HTMLInputElement).value
            const dpi = (document.getElementById('swal-dpi') as HTMLInputElement).value
            const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value
            const ubicacion = (document.getElementById('swal-ubicacion') as HTMLInputElement).value
            const edad = (document.getElementById('swal-edad') as HTMLInputElement).value
            const genero = (document.getElementById('swal-genero') as HTMLSelectElement).value
            const obsEl = document.getElementById('swal-observacion') as HTMLTextAreaElement | null
            const observacion = obsEl ? obsEl.value : null

            if (!codigo || !dpi || !nombre || !ubicacion || !edad || !genero) {
                Swal.showValidationMessage('Todos los campos básicos son obligatorios')
                return false
            }

            if (isForcedByMora && !observacion?.trim()) {
                Swal.showValidationMessage('Debe ingresar una observación justificando la confirmación')
                return false
            }

            return { 
                codigo_cliente: codigo, 
                dpi, 
                nombre_completo: nombre, 
                ubicacion,
                edad,
                genero,
                observacion
            }
        }
    })

    if (formValues) {
        verifying.value = true
        try {
            const response = await api.post('/asistencia/confirmar', {
                ...formValues,
                tipo_asistencia: isForcedByMora ? 'sistema' : 'manual'
            })

            if (response.data.success) {
                Swal.fire({
                    title: '¡Asistencia Registrada!',
                    text: 'El registro manual se ha grabado exitosamente.',
                    icon: 'success',
                    confirmButtonColor: '#5eb301',
                    customClass: { popup: 'rounded-3xl shadow-2xl' }
                }).then(() => {
                    searchQuery.value = '';
                    searchNameQuery.value = '';
                    result.value = null;
                    nameResults.value = [];
                })
            }
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'No se pudo realizar el registro manual', 'error')
        } finally {
            verifying.value = false
        }
    }
}

const handleVerify = async () => {
    if (!result.value) return
    
    verifying.value = true
    try {
        const response = await api.post('/asistencia/verificar', {
            codigo_cliente: result.value.personal.codigo_cliente
        })

        if (response.data.success) {
            const { approved, checks } = response.data.data
            
            let html = `
                <div class="text-left space-y-4 py-2">
                    <div class="flex items-center justify-between p-3 rounded-xl ${checks.edad.passed ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}">
                        <div class="flex items-center gap-3">
                            <span class="text-xl">${checks.edad.passed ? '✅' : '❌'}</span>
                            <div>
                                <p class="text-xs font-bold text-gray-500 uppercase tracking-tighter">Mayor de Edad</p>
                                <p class="text-sm font-medium ${checks.edad.passed ? 'text-green-700' : 'text-red-700'}">${checks.edad.message}</p>
                            </div>
                        </div>
                        <span class="text-xs font-bold">${checks.edad.val.toFixed(2)} años</span>
                    </div>

                    <div class="flex items-center justify-between p-3 rounded-xl ${checks.aportaciones.passed ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}">
                        <div class="flex items-center gap-3">
                            <span class="text-xl">${checks.aportaciones.passed ? '✅' : '❌'}</span>
                            <div>
                                <p class="text-xs font-bold text-gray-500 uppercase tracking-tighter">Saldos Mínimos</p>
                                <p class="text-sm font-medium ${checks.aportaciones.passed ? 'text-green-700' : 'text-red-700'}">${checks.aportaciones.message}</p>
                            </div>
                        </div>
                        <span class="text-xs font-bold">Q${checks.aportaciones.val}</span>
                    </div>

                    <div class="flex items-center justify-between p-3 rounded-xl ${checks.mora.passed ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}">
                        <div class="flex items-center gap-3">
                            <span class="text-xl">${checks.mora.passed ? '✅' : '❌'}</span>
                            <div>
                                <p class="text-xs font-bold text-gray-500 uppercase tracking-tighter">Historial de Crétidos</p>
                                <p class="text-sm font-medium ${checks.mora.passed ? 'text-green-700' : 'text-red-700'}">${checks.mora.message}</p>
                            </div>
                        </div>
                        ${checks.mora.has_credit ? `<span class="text-xs font-bold">Mora: ${checks.mora.val}</span>` : ''}
                    </div>
                </div>
            `

            if (approved) {
                Swal.fire({
                    title: '¡Elegibilidad Aprobada!',
                    html: html,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Confirmar Asistencia',
                    cancelButtonText: 'Cerrar',
                    confirmButtonColor: '#5eb301',
                    cancelButtonColor: '#6b7280',
                    showLoaderOnConfirm: true,
                    customClass: {
                        popup: 'rounded-3xl shadow-2xl',
                        title: 'text-2xl font-bold text-gray-900'
                    },
                    preConfirm: async () => {
                        try {
                            const confirmResponse = await api.post('/asistencia/confirmar', {
                                codigo_cliente: result.value?.personal.codigo_cliente,
                                dpi: result.value?.personal.dpi,
                                nombre_completo: [result.value?.personal.nombre1, result.value?.personal.nombre2, result.value?.personal.nombre3, result.value?.personal.apellido1, result.value?.personal.apellido2].filter(Boolean).join(' '),
                                ubicacion: `${result.value?.personal.muni_domicilio}, ${result.value?.personal.depto_domicilio}`,
                                // Optional: We could pass age/gender here to avoid the extra DB lookup on the server
                                edad: result.value?.personal.edad,
                                genero: result.value?.personal.genero
                            })
                            return confirmResponse.data
                        } catch (error: any) {
                            Swal.showValidationMessage(`Error: ${error.response?.data?.message || 'No se pudo registrar la asistencia'}`)
                        }
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                }).then((resultDialog) => {
                    if (resultDialog.isConfirmed) {
                        Swal.fire({
                            title: '¡Asistencia Registrada!',
                            text: 'La presencia del asociado ha sido grabada exitosamente.',
                            icon: 'success',
                            confirmButtonColor: '#5eb301',
                            customClass: { popup: 'rounded-3xl shadow-2xl' }
                        }).then(() => {
                            searchQuery.value = '';
                            searchNameQuery.value = '';
                            result.value = null;
                            nameResults.value = [];
                        })
                    }
                })
            } else {
                const soloMoraFalla = checks.edad.passed && checks.aportaciones.passed && !checks.mora.passed;
                
                let config: any = {
                    title: 'No Cumple Requisitos',
                    html: `
                        <p class="mb-4 text-gray-500 text-sm">El asociado no cumple con los requisitos mínimos para participar en esta gestión.</p>
                        ${html}
                    `,
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#d33',
                    customClass: {
                        popup: 'rounded-3xl shadow-2xl',
                        title: 'text-2xl font-bold text-gray-900'
                    }
                };
                
                if (soloMoraFalla) {
                    config.showCancelButton = true;
                    config.cancelButtonText = 'Forzar Confirmación';
                    config.cancelButtonColor = '#f59e0b';
                }

                Swal.fire(config).then((alertResult) => {
                    if (soloMoraFalla && alertResult.dismiss === Swal.DismissReason.cancel) {
                        handleManualRegistration(true);
                    }
                })
            }
        }
    } catch (err) {
        Swal.fire('Error', 'No se pudo verificar la elegibilidad en este momento.', 'error')
    } finally {
        verifying.value = false
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
