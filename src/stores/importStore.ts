import { defineStore } from 'pinia'
import axios from 'axios'
import Swal from 'sweetalert2'

// Define URL base. Ideally this comes from env or a common config
// Assuming standard Laravel API path
const API_BASE = 'http://localhost:8004/api/import'

interface ImportState {
  activeJobId: string | null
  isUploading: boolean
  isProcessing: boolean
  progress: number
  processedCount: number
  skippedCount: number
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'failed'
  message: string
  isWidgetMinimized: boolean
  pollingInterval: any | null
}

export const useImportStore = defineStore('import', {
  state: (): ImportState => ({
    activeJobId: null,
    isUploading: false,
    isProcessing: false,
    progress: 0,
    processedCount: 0,
    skippedCount: 0,
    status: 'idle',
    message: '',
    isWidgetMinimized: false,
    pollingInterval: null
  }),

  actions: {
    async startImport(file: File, dates: { desde: string | null, hasta: string | null, full: boolean }) {
      this.isUploading = true
      this.status = 'uploading'
      this.message = 'Subiendo archivo...'
      this.progress = 0
      this.processedCount = 0
      this.skippedCount = 0

      const formData = new FormData()
      formData.append('file', file)
      if (dates.desde) formData.append('desde', dates.desde)
      if (dates.hasta) formData.append('hasta', dates.hasta)
      if (dates.full) formData.append('full', '1')

      try {
        const response = await axios.post(`${API_BASE}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        if (response.data.success) {
          this.activeJobId = response.data.jobId
          this.isUploading = false
          this.isProcessing = true
          this.status = 'processing'
          this.message = 'Procesando en segundo plano...'
          this.startPolling()

          Swal.fire({
            icon: 'info',
            title: 'Importación Iniciada',
            text: 'El proceso continuará en segundo plano. Puedes minimizar esta ventana y seguir trabajando.',
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false
          })
        }
      } catch (error: any) {
        this.resetState()
        this.status = 'failed'
        Swal.fire('Error', error.response?.data?.message || 'Error al subir archivo', 'error')
      }
    },

    startPolling() {
      if (this.pollingInterval) clearInterval(this.pollingInterval)

      this.pollingInterval = setInterval(async () => {
        if (!this.activeJobId) return

        try {
          const response = await axios.get(`${API_BASE}/status/${this.activeJobId}`)
          const data = response.data

          if (data.status === 'not_found') {
            this.stopPolling()
            this.status = 'failed'
            this.message = data.message
            return
          }

          this.status = data.status
          this.message = data.message

          // Update stats
          if (data.processed !== undefined) this.processedCount = data.processed
          if (data.skipped !== undefined) this.skippedCount = data.skipped
          if (data.progress !== undefined) this.progress = data.progress

          if (data.status === 'completed' || data.status === 'failed') {
            this.stopPolling()
            this.isProcessing = false

            if (data.status === 'completed') {
              Swal.fire({
                icon: 'success',
                title: '¡Importación Completada!',
                text: `${this.processedCount} registros actualizados.`,
                toast: true,
                position: 'bottom-end',
                showConfirmButton: true
              })
            }
          }

        } catch (error) {
          console.error("Polling error", error)
        }
      }, 2000) // Poll every 2 seconds
    },

    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
        this.pollingInterval = null
      }
    },

    resetState() {
      this.stopPolling()
      this.activeJobId = null
      this.isUploading = false
      this.isProcessing = false
      this.progress = 0
      this.processedCount = 0
      this.skippedCount = 0
      this.status = 'idle'
      this.message = ''
    },

    toggleMinimize() {
      this.isWidgetMinimized = !this.isWidgetMinimized
    },

    closeWidget() {
      if (this.isProcessing) {
        Swal.fire({
          title: '¿Ocultar widget?',
          text: "El proceso continuará, pero dejarás de verlo aquí.",
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, ocultar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.resetState()
          }
        })
      } else {
        this.resetState()
      }
    }
  }
})
