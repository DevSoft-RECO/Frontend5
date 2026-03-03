<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Escrutinio por Urna
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Capture los resultados finales de cada mesa de votación.
        </p>
      </div>
      <div class="w-full md:w-64">
        <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Seleccionar Urna / Mesa</label>
        <select v-model="selectedUrna" 
                @change="onUrnaChange"
                class="w-full rounded-xl border-gray-200 shadow-sm focus:border-verde-cope text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white">
            <option disabled value="">Seleccione una urna</option>
            <option v-for="urna in urnas" :key="urna.id" :value="urna.id">
                {{ urna.nombre }}
            </option>
        </select>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!selectedUrna" 
         class="bg-white dark:bg-gray-800 p-12 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
        <div class="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
            <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Seleccione una Urna</h3>
        <p class="text-gray-500 max-w-xs mx-auto">Debe seleccionar un centro de votación para comenzar a registrar los votos de los candidatos.</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-cope"></div>
    </div>

    <div v-else class="space-y-6">
        <!-- Results Summary Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nulos -->
            <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-6">
                <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-600">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div class="flex-1">
                    <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Votos Nulos</label>
                    <input type="number" v-model.number="resultados.votos_nulos" min="0" 
                           class="w-full text-2xl font-black bg-transparent border-none focus:ring-0 p-0 text-gray-900 dark:text-white"
                           placeholder="0">
                </div>
            </div>
            <!-- Blancos -->
            <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-6">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center text-gray-500">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div class="flex-1">
                    <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Votos Blancos</label>
                    <input type="number" v-model.number="resultados.votos_blancos" min="0" 
                           class="w-full text-2xl font-black bg-transparent border-none focus:ring-0 p-0 text-gray-900 dark:text-white"
                           placeholder="0">
                </div>
            </div>
        </div>

        <!-- Candidates List -->
        <h2 class="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Votos por Candidato</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="candidato in resultados.candidatos" :key="candidato.id" 
                 class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center relative overflow-hidden group">
                
                <!-- Avatar -->
                <div class="w-20 h-20 mb-4 relative">
                    <img :src="candidato.foto_url || '/placeholder-user.png'" 
                         class="w-full h-full rounded-2xl object-cover shadow-lg border-4 border-gray-50 dark:border-gray-900"
                         alt="Avatar">
                </div>

                <h3 class="text-base font-bold text-gray-900 dark:text-white text-center mb-1">{{ candidato.nombre_completo }}</h3>
                <p class="text-[10px] font-black text-azul-cope uppercase tracking-tighter mb-6">Candidato Registrado</p>

                <!-- Voter Entry -->
                <div class="w-full pt-4 border-t border-gray-50 dark:border-gray-700">
                    <label class="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">Votos en esta mesa</label>
                    <input type="number" 
                           v-model.number="candidato.votos"
                           min="0"
                           class="w-full rounded-xl border-gray-200 focus:border-verde-cope bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white font-mono font-bold text-center text-xl"
                           placeholder="0">
                </div>
            </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end pt-6">
            <button @click="saveBatchResults" 
                    :disabled="saving"
                    class="px-12 py-4 bg-verde-cope hover:bg-green-600 disabled:bg-gray-300 text-white rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 font-black uppercase tracking-widest text-sm">
                <svg v-if="!saving" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                <svg v-else class="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {{ saving ? 'Guardando...' : 'Guardar Resultados de Mesa' }}
            </button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

const urnas = ref<any[]>([])
const selectedUrna = ref('')
const loading = ref(false)
const saving = ref(false)
const hasExistingData = ref(false)

const resultados = ref<{
    votos_nulos: number,
    votos_blancos: number,
    candidatos: any[]
}>({
    votos_nulos: 0,
    votos_blancos: 0,
    candidatos: []
})

const fetchUrnas = async () => {
    try {
        const response = await api.get('/urnas')
        if (response.data.success) urnas.value = response.data.data
    } catch (error) {
        console.error('Error fetching urnas:', error)
    }
}

const onUrnaChange = () => {
    if (selectedUrna.value) {
        fetchResultadosUrna()
    }
}

const fetchResultadosUrna = async () => {
    loading.value = true
    try {
        const response = await api.get(`/votos/urna/${selectedUrna.value}`)
        if (response.data.success) {
            resultados.value = {
                votos_nulos: response.data.data.urna.votos_nulos,
                votos_blancos: response.data.data.urna.votos_blancos,
                candidatos: response.data.data.candidatos
            }
            
            // Determinar si ya existen datos (al menos un voto registrado o nulos/blancos > 0)
            const tieneVotosCandidatos = resultados.value.candidatos.some(c => (c.votos || 0) > 0)
            hasExistingData.value = resultados.value.votos_nulos > 0 || 
                                    resultados.value.votos_blancos > 0 || 
                                    tieneVotosCandidatos
        }
    } catch (error) {
        console.error('Error fetching resultados:', error)
        Swal.fire('Error', 'No se pudieron cargar los datos de la urna', 'error')
    } finally {
        loading.value = false
    }
}

const saveBatchResults = async () => {
    saving.value = true
    try {
        const payload = {
            votos_nulos: resultados.value.votos_nulos,
            votos_blancos: resultados.value.votos_blancos,
            votos_candidatos: resultados.value.candidatos.map(c => ({
                id: c.id,
                votos: c.votos || 0
            }))
        }

        // Si ya hay datos, pedir contraseña para confirmar actualización
        if (hasExistingData.value) {
            const { value: password } = await Swal.fire({
                title: 'Confirmar Actualización',
                text: 'Esta urna ya tiene datos registrados. Ingrese la contraseña para autorizar el cambio y evitar fraude.',
                input: 'password',
                inputLabel: 'Contraseña de Seguridad',
                inputPlaceholder: 'Ingrese contraseña',
                showCancelButton: true,
                confirmButtonColor: '#10b981', // verde-cope
                confirmButtonText: 'Autorizar y Guardar',
                cancelButtonText: 'Cancelar',
                inputValidator: (value) => {
                    if (!value) {
                        return '¡La contraseña es obligatoria!'
                    }
                    if (value !== 'admin123') {
                        return 'Contraseña incorrecta'
                    }
                }
            })

            if (!password) {
                saving.value = false
                return
            }
        }

        const response = await api.post(`/votos/urna/${selectedUrna.value}/guardar`, payload)

        if (response.data.success) {
            hasExistingData.value = true
            Swal.fire({
                title: '¡Éxito!',
                text: 'Resultados de la urna guardados correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            })
        }
    } catch (error) {
        console.error('Error saving results:', error)
        Swal.fire('Error', 'No se pudieron guardar los resultados', 'error')
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    fetchUrnas()
})
</script>
