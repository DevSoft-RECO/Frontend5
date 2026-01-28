<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Carga de Clientes
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Importación masiva de clientes mediante archivos CSV.
        </p>
      </div>
    </div>

    <!-- Main Card -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Left Column: Instructions -->
        <div class="space-y-4">
            <h3 class="font-semibold text-lg text-gray-800 dark:text-gray-200">Instrucciones</h3>
            <ul class="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>El archivo debe estar delimitado por pipes (<code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">|</code>).</li>
                <li>La primera columna debe ser el ID numérico del cliente.</li>
                <li><strong>Filtro de Fechas:</strong>
                    <ul class="list-circle list-inside ml-4 mt-1">
                        <li>Para un <strong>rango</strong>: Seleccione fecha "Desde" y "Hasta".</li>
                        <li>Para un <strong>solo día</strong>: Seleccione únicamente la fecha "Desde".</li>
                    </ul>
                </li>
            </ul>
            
            <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 mt-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-blue-700 dark:text-blue-300">
                            El proceso se ejecutará en segundo plano. Podrás seguir navegando mientras se completa.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Column: Form -->
        <div class="space-y-6">
            
            <!-- File Input -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Archivo CSV</label>
                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-verde-cope transition-colors cursor-pointer relative bg-gray-50 dark:bg-gray-900/50"
                     @click="triggerFileInput"
                     @drop.prevent="handleDrop"
                     @dragover.prevent>
                    
                    <div class="space-y-1 text-center">
                        <div v-if="selectedFile" class="text-verde-cope font-medium">
                            {{ selectedFile.name }}
                        </div>
                        <svg v-else class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                            <span v-if="!selectedFile">Haz click para subir o arrastra aquí</span>
                        </div>
                    </div>
                    <input ref="fileInput" type="file" class="sr-only" accept=".csv,.txt" @change="handleFileSelect" />
                </div>
            </div>

            <!-- Date Range Filters -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Desde</label>
                    <input v-model="form.desde" type="date"
                           class="w-full rounded-md border-gray-300 shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                           :disabled="form.full">
                </div>
                <div>
                     <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hasta (Opcional)</label>
                    <input v-model="form.hasta" type="date"
                           class="w-full rounded-md border-gray-300 shadow-sm focus:border-verde-cope focus:ring focus:ring-verde-cope focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                           :disabled="form.full">
                </div>
            </div>

            <!-- Submit Button -->
            <button @click="handleSubmit" 
                    :disabled="!selectedFile || importStore.isUploading"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-verde-cope hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cope disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <svg v-if="importStore.isUploading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ importStore.isUploading ? 'Subiendo...' : 'Iniciar Importación' }}
            </button>

            <!-- Advanced Options (Full Load) -->
            <details class="group">
                <summary class="flex items-center text-xs text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 select-none">
                    <svg class="h-4 w-4 mr-1 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    Opciones Avanzadas
                </summary>
                <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between py-3 px-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                        <div class="flex flex-col">
                            <span class="text-sm font-medium text-red-800 dark:text-red-300">Carga Completa (Emergencia)</span>
                            <span class="text-xs text-red-600 dark:text-red-400">Ignora fechas y procesa todo.</span>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="form.full" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                        </label>
                    </div>
                </div>
            </details>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useImportStore } from '@/stores/importStore'
import Swal from 'sweetalert2'

const importStore = useImportStore()
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)

const form = reactive({
    desde: '',
    hasta: '',
    full: false
})

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0] as File
    }
}

const handleDrop = (event: DragEvent) => {
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        selectedFile.value = event.dataTransfer.files[0] as File
    }
}

const handleSubmit = async () => {
    if (!selectedFile.value) return

    if (form.full) {
        // Security Check for Full Load
        const { value: password } = await Swal.fire({
            title: 'Confirmación de Seguridad',
            text: "La carga completa es una operación intensiva. Ingresa la contraseña de administrador:",
            input: 'password',
            inputPlaceholder: 'Contraseña',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        })

        // Simple hardcoded check as requested/discussed "emergency pin"
        // In production this should be a backend validation or auth check.
        if (password !== 'admin123') { 
            Swal.fire('Error', 'Contraseña incorrecta', 'error')
            return
        }
    } else {
        // Validation for Date Range
        if (!form.desde) {
            Swal.fire('Atención', 'Debes especificar al menos la fecha "Desde" o activar la carga completa.', 'warning')
            return
        }
    }

    importStore.startImport(selectedFile.value, {
        desde: form.desde.replace(/-/g, ''), // YYYY-MM-DD -> YYYYMMDD
        hasta: form.hasta ? form.hasta.replace(/-/g, '') : null,
        full: form.full
    })
    
    // Clear file selection after start
    if (fileInput.value) fileInput.value.value = ''
    selectedFile.value = null
}
</script>
