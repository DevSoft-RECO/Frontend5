<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Gestión de Urnas y Candidatos
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Administración de mesas de votación y registro de candidatos globales con fotografía.
        </p>
      </div>
      <div class="flex gap-2">
        <button @click="openUrnaModal()" 
                class="px-4 py-2 bg-azul-cope hover:bg-blue-800 text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 text-sm">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Nueva Urna
        </button>
        <button @click="openCandidatoModal()" 
                class="px-4 py-2 bg-verde-cope hover:bg-green-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 text-sm">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            Nuevo Candidato
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Urnas Card -->
      <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden h-fit">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg class="w-5 h-5 text-azul-cope" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                Listado de Urnas (Mesas)
            </h2>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                        <th class="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</th>
                        <th class="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Descripción</th>
                        <th class="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr v-for="urna in urnas" :key="urna.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                        <td class="px-6 py-4 font-bold text-azul-cope">{{ urna.nombre }}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">{{ urna.descripcion || 'Sin descripción' }}</td>
                        <td class="px-6 py-4 text-right">
                            <div class="flex justify-end gap-2">
                                <button @click="openUrnaModal(urna)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                </button>
                                <button @click="deleteUrna(urna.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      <!-- Candidatos Card -->
      <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden h-fit">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg class="w-5 h-5 text-verde-cope" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Listado de Candidatos Globales
            </h2>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                        <th class="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Perfil</th>
                        <th class="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</th>
                        <th class="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Año</th>
                        <th class="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr v-for="candidato in candidatos" :key="candidato.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                        <td class="px-6 py-4">
                            <img :src="candidato.foto_url || '/placeholder-user.png'" 
                                 class="w-10 h-10 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700 shadow-sm"
                                 alt="Foto">
                        </td>
                        <td class="px-6 py-4 text-sm font-bold text-gray-900 dark:text-gray-100">{{ candidato.nombre_completo }}</td>
                        <td class="px-6 py-4 text-sm text-center font-mono font-bold">{{ candidato.anio }}</td>
                        <td class="px-6 py-4 text-right">
                            <div class="flex justify-end gap-2">
                                <button @click="openCandidatoModal(candidato)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                </button>
                                <button @click="deleteCandidato(candidato.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import Swal from 'sweetalert2'

const urnas = ref<any[]>([])
const candidatos = ref<any[]>([])

const fetchUrnas = async () => {
    try {
        const response = await api.get('/urnas')
        if (response.data.success) urnas.value = response.data.data
    } catch (error) {
        console.error('Error fetching urnas:', error)
    }
}

const fetchCandidatos = async () => {
    try {
        const response = await api.get('/candidatos')
        if (response.data.success) candidatos.value = response.data.data
    } catch (error) {
        console.error('Error fetching candidatos:', error)
    }
}

const openUrnaModal = async (urna: any = null) => {
    const { value: formValues } = await Swal.fire({
        title: urna ? 'Editar Urna (Mesa)' : 'Nueva Urna (Mesa)',
        html: `
            <div class="space-y-4 py-2">
                <div class="text-left">
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Nombre de la Urna</label>
                    <input id="swal-nombre" class="w-full rounded-xl border-gray-200 shadow-sm focus:border-verde-cope" placeholder="Ej. MES Nº 1" value="${urna ? urna.nombre : ''}">
                </div>
                <div class="text-left">
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Descripción (Opcional)</label>
                    <textarea id="swal-descripcion" class="w-full rounded-xl border-gray-200 shadow-sm focus:border-verde-cope" placeholder="Detalles adicionales...">${urna ? (urna.descripcion || '') : ''}</textarea>
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#5eb301',
        customClass: { popup: 'rounded-3xl shadow-2xl' },
        preConfirm: () => {
            const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value
            const descripcion = (document.getElementById('swal-descripcion') as HTMLTextAreaElement).value
            if (!nombre) {
                Swal.showValidationMessage('El nombre es obligatorio')
                return false
            }
            return { nombre, descripcion }
        }
    })

    if (formValues) {
        try {
            if (urna) {
                await api.put(`/urnas/${urna.id}`, formValues)
            } else {
                await api.post('/urnas', formValues)
            }
            Swal.fire('¡Éxito!', 'La urna se guardó correctamente', 'success')
            fetchUrnas()
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar la urna', 'error')
        }
    }
}

const deleteUrna = async (id: number) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Se eliminarán los registros de votos asociados a esta urna.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
        try {
            await api.delete(`/urnas/${id}`)
            Swal.fire('Eliminado', 'La urna ha sido eliminada.', 'success')
            fetchUrnas()
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar la urna', 'error')
        }
    }
}

const openCandidatoModal = async (candidato: any = null) => {
    const { value: formValues } = await Swal.fire({
        title: candidato ? 'Editar Candidato' : 'Nuevo Candidato',
        html: `
            <div class="space-y-4 py-2">
                <div class="text-left">
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Nombre Completo</label>
                    <input id="swal-nombre" class="w-full rounded-xl border-gray-200 shadow-sm focus:border-verde-cope" placeholder="Nombre y Apellidos" value="${candidato ? candidato.nombre_completo : ''}">
                </div>
                <div class="text-left">
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Año de Participación</label>
                    <input id="swal-anio" type="number" class="w-full rounded-xl border-gray-200 shadow-sm focus:border-verde-cope" value="${candidato ? candidato.anio : new Date().getFullYear()}">
                </div>
                <div class="text-left">
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Foto de Perfil</label>
                    <input id="swal-foto" type="file" accept="image/*" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#5eb301',
        customClass: { popup: 'rounded-3xl shadow-2xl' },
        preConfirm: () => {
            const nombre_completo = (document.getElementById('swal-nombre') as HTMLInputElement).value
            const anio = (document.getElementById('swal-anio') as HTMLInputElement).value
            const fotoInput = (document.getElementById('swal-foto') as HTMLInputElement)
            const foto = fotoInput.files ? fotoInput.files[0] : null

            if (!nombre_completo || !anio) {
                Swal.showValidationMessage('El nombre y el año son obligatorios')
                return false
            }
            return { nombre_completo, anio, foto }
        }
    })

    if (formValues) {
        const formData = new FormData()
        formData.append('nombre_completo', formValues.nombre_completo)
        formData.append('anio', formValues.anio)
        if (formValues.foto) {
            formData.append('foto', formValues.foto)
        }

        try {
            if (candidato) {
                formData.append('_method', 'PUT')
                await api.post(`/candidatos/${candidato.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            } else {
                await api.post('/candidatos', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            }
            Swal.fire('¡Éxito!', 'Candidato guardado', 'success')
            fetchCandidatos()
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar el candidato', 'error')
        }
    }
}

const deleteCandidato = async (id: number) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Se eliminarán todos los resultados de votos para este candidato.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
        try {
            await api.delete(`/candidatos/${id}`)
            Swal.fire('Eliminado', 'Candidato eliminado.', 'success')
            fetchCandidatos()
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el candidato', 'error')
        }
    }
}

onMounted(() => {
    fetchUrnas()
    fetchCandidatos()
})
</script>
