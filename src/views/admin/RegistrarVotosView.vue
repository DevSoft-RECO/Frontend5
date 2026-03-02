<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Registrar Votos por Urna
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Capture y actualice el total de votos obtenidos por cada candidato.
        </p>
      </div>
      <div class="w-full md:w-64">
        <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Seleccionar Urna</label>
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

    <!-- Candidates List -->
    <div v-else-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-cope"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="candidato in candidatos" :key="candidato.id" 
             class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center relative overflow-hidden group">
            
            <!-- Badge Año -->
            <div class="absolute top-4 right-4 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">
                {{ candidato.anio }}
            </div>

            <!-- Avatar -->
            <div class="w-24 h-24 mb-4 relative">
                <img :src="candidato.foto_url || '/placeholder-user.png'" 
                     class="w-full h-full rounded-2xl object-cover shadow-lg border-4 border-gray-50 dark:border-gray-900"
                     alt="Avatar">
                <div class="absolute -bottom-2 -right-2 bg-verde-cope text-white p-1.5 rounded-lg shadow-lg">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
            </div>

            <h3 class="text-lg font-bold text-gray-900 dark:text-white text-center mb-1">{{ candidato.nombre_completo }}</h3>
            <p class="text-xs font-bold text-azul-cope uppercase tracking-tighter mb-6">Candidato Registrado</p>

            <!-- Voter Entry -->
            <div class="w-full space-y-3 pt-4 border-t border-gray-50 dark:border-gray-700">
                <div>
                    <label class="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">Total de Votos Obtenidos</label>
                    <div class="flex gap-2">
                        <input type="number" 
                               v-model.number="votosTemp[candidato.id]"
                               min="0"
                               class="flex-1 rounded-xl border-gray-200 focus:border-verde-cope bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white font-mono font-bold text-center"
                               placeholder="0">
                        <button @click="saveVotes(candidato)" 
                                :disabled="updating === candidato.id"
                                class="px-4 bg-verde-cope hover:bg-green-600 disabled:bg-gray-300 text-white rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center min-w-[50px]">
                            <svg v-if="updating !== candidato.id" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                            <svg v-else class="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="flex justify-between items-center px-1">
                    <span class="text-[10px] font-bold text-gray-400 uppercase">Estado Actual:</span>
                    <span class="text-xs font-mono font-bold text-gray-900 dark:text-white">{{ candidato.total_votos }} votos</span>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const urnas = ref<any[]>([])
const selectedUrna = ref('')
const candidatos = ref<any[]>([])
const loading = ref(false)
const updating = ref<number | null>(null)
const votosTemp = ref<Record<number, number>>({})

const fetchUrnas = async () => {
    try {
        const response = await axios.get('http://localhost:8004/api/urnas')
        if (response.data.success) urnas.value = response.data.data
    } catch (error) {
        console.error('Error fetching urnas:', error)
    }
}

const onUrnaChange = () => {
    if (selectedUrna.value) {
        fetchCandidatos()
    }
}

const fetchCandidatos = async () => {
    loading.value = true
    try {
        const response = await axios.get('http://localhost:8004/api/votos/candidatos', {
            params: { urna_id: selectedUrna.value }
        })
        if (response.data.success) {
            candidatos.value = response.data.data
            // Inicializar votos temporales con el valor actual
            candidatos.value.forEach(c => {
                votosTemp.value[c.id] = c.total_votos
            })
        }
    } catch (error) {
        console.error('Error fetching candidatos:', error)
        Swal.fire('Error', 'No se pudieron cargar los candidatos', 'error')
    } finally {
        loading.value = false
    }
}

const saveVotes = async (candidato: any) => {
    const nuevosVotos = votosTemp.value[candidato.id]
    
    if (typeof nuevosVotos !== 'number' || nuevosVotos < 0) {
        Swal.fire('Atención', 'Por favor ingrese una cantidad válida de votos.', 'warning')
        return
    }

    updating.value = candidato.id
    try {
        const response = await axios.patch(`http://localhost:8004/api/votos/candidatos/${candidato.id}/actualizar`, {
            total_votos: nuevosVotos
        })

        if (response.data.success) {
            candidato.total_votos = nuevosVotos
            Swal.fire({
                title: '¡Votos Registrados!',
                text: `Se han actualizado los votos para ${candidato.nombre_completo}`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            })
        }
    } catch (error) {
        console.error('Error updating votes:', error)
        Swal.fire('Error', 'No se pudo registrar la votación', 'error')
    } finally {
        updating.value = null
    }
}

onMounted(() => {
    fetchUrnas()
})
</script>
