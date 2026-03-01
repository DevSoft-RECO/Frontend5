<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-4">
    
    <!-- Premium Upload Card -->
    <div class="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row">
        
        <!-- Left Side: Visual & Instructions -->
        <div class="w-full md:w-2/5 bg-slate-50 dark:bg-gray-900/50 p-8 flex flex-col justify-between border-r border-gray-100 dark:border-gray-700">
            <div>
                <div class="flex items-center justify-center w-12 h-12 bg-blue-600/10 text-blue-600 rounded-xl mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Carga de Colocación</h2>
                <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                    Actualiza los saldos y días de mora de los documentos de colocación de forma masiva.
                </p>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                    <h3 class="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">Guía Paso a Paso</h3>
                    <ol class="relative border-l border-gray-200 dark:border-gray-700 ml-2 space-y-6">                  
                        <li class="mb-2 ml-4">
                            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">1. Formato de Archivo</h4>
                            <p class="text-xs text-gray-500 mt-1">Asegúrate que sea <strong>CSV</strong>, separado por punto y coma (<code>;</code>).</p>
                        </li>
                        <li class="mb-2 ml-4">
                            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">2. Columnas Requeridas</h4>
                            <p class="text-xs text-gray-500 mt-1">CLIENTE; NUMERODOCUMENTO; DIASMORA; SALDOCAPITAL.</p>
                        </li>
                        <li class="ml-4">
                            <div class="absolute w-3 h-3 bg-blue-600 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900"></div>
                            <h4 class="text-sm font-semibold text-blue-600">3. Inicia el Proceso</h4>
                            <p class="text-xs text-gray-500 mt-1">Sube el archivo y presiona el botón. El proceso se ejecutará en segundo plano.</p>
                        </li>
                    </ol>
                </div>
            </div>
            
            <p class="text-xs text-gray-400 mt-6">
                v1.2.0 &bull; Sistema Importación YK
            </p>
        </div>

        <!-- Right Side: Interaction Form -->
        <div class="w-full md:w-3/5 p-8 bg-white dark:bg-gray-800">
            <div class="max-w-md mx-auto h-full flex flex-col justify-center">
                
                <!-- Dropzone -->
                <div 
                    @click="triggerFileInput"
                    @drop.prevent="handleDrop"
                    @dragover.prevent
                    class="group relative border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-600 hover:bg-blue-600/5 dark:hover:bg-blue-600/10 rounded-2xl p-10 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center gap-4"
                >
                    <div class="w-16 h-16 bg-blue-600/10 dark:bg-blue-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-8 h-8 text-blue-600" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.085 2.583H7.75a2.583 2.583 0 0 0-2.583 2.584v20.666a2.583 2.583 0 0 0 2.583 2.584h15.5a2.583 2.583 0 0 0 2.584-2.584v-15.5m-7.75-7.75 7.75 7.75m-7.75-7.75v7.75h7.75M15.5 23.25V15.5m-3.875 3.875h7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    
                    <div class="space-y-1">
                        <p class="text-gray-700 dark:text-gray-200 font-medium text-lg">
                            <span v-if="selectedFile">{{ selectedFile.name }}</span>
                            <span v-else>Arrastra tu archivo aquí</span>
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            o <span class="text-blue-600 underline font-medium">haz clic para explorar</span>
                        </p>
                    </div>
                    <input ref="fileInput" type="file" class="hidden" accept=".csv,.txt" @change="handleFileSelect" />
                </div>

                <!-- Controls Area -->
                <div class="mt-8 space-y-6">
                    
                    <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                        <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            <strong class="text-gray-700 dark:text-gray-200">Nota:</strong> Esta importación actualizará los saldos de capital y días de mora basados en el número de documento.
                        </p>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-3 pt-2">
                        <button 
                            @click="selectedFile = null" 
                            v-if="selectedFile"
                            class="px-5 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        
                        <button 
                            @click="handleSubmit" 
                            :disabled="!selectedFile || importStore.isUploading"
                            class="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 transition-all flex justify-center items-center gap-2"
                        >
                            <svg v-if="importStore.isUploading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>{{ importStore.isUploading ? 'Subiendo...' : 'Iniciar Importación' }}</span>
                        </button>
                    </div>

                </div>

            </div>
        </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useImportStore } from '@/stores/importStore'

const importStore = useImportStore()
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)

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

    importStore.startImport(
        selectedFile.value, 
        { desde: null, hasta: null, full: true },
        'colocacion'
    )
    
    // Clear file selection after start
    if (fileInput.value) fileInput.value.value = ''
    selectedFile.value = null
}
</script>
