import { defineStore } from 'pinia';

export interface QRCodeOptions {
  format?: 'png' | 'svg' | 'jpeg' | 'webp'
  size?: number
  quality?: number
  foregroundColor?: string
  backgroundColor?: string
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  margin?: number
  logoFile?: File | null
  logoSize?: number
  addSignature?: boolean
  signatureColor?: string
  signatureFontSize?: number
}

export interface QRCodeResponse {
  success: boolean
  message: string
  blob?: Blob
  url?: string
}

export const useQRCodeStore = defineStore('qrcode', () => {
  const config = useRuntimeConfig()

  // State
  const loading = ref(false)
  const error = ref<string>('')
  const generatedQRCode = ref<Blob | null>(null)
  const qrCodeUrl = ref<string>('')

  // Actions
  const generateQRCodeFromLink = async (linkId: string, options: QRCodeOptions = {}): Promise<QRCodeResponse | null> => {
    loading.value = true
    error.value = ''
    
    try {
      const params = new URLSearchParams()
      
      // Ajouter les options comme paramètres de requête
      if (options.format) params.append('format', options.format)
      if (options.size) params.append('size', options.size.toString())
      if (options.quality) params.append('quality', options.quality.toString())
      if (options.foregroundColor) params.append('foregroundColor', options.foregroundColor)
      if (options.backgroundColor) params.append('backgroundColor', options.backgroundColor)
      if (options.errorCorrectionLevel) params.append('errorCorrectionLevel', options.errorCorrectionLevel)
      if (options.margin !== undefined) params.append('margin', options.margin.toString())
      if (options.logoSize) params.append('logoSize', options.logoSize.toString())
      if (options.addSignature !== undefined) params.append('addSignature', options.addSignature.toString())
      if (options.signatureColor) params.append('signatureColor', options.signatureColor)
      if (options.signatureFontSize) params.append('signatureFontSize', options.signatureFontSize.toString())

      const baseUrl = config.public.pgsBaseAPI
      const url = `${baseUrl}/shortlinks/${linkId}/qrcode?${params.toString()}`

      // Créer FormData si un logo est fourni
      let requestOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Accept': `image/${options.format || 'png'}`
        }
      }

      if (options.logoFile) {
        const formData = new FormData()
        formData.append('logoFile', options.logoFile)
        
        // Ajouter les autres paramètres au FormData
        Object.entries(options).forEach(([key, value]) => {
          if (key !== 'logoFile' && value !== undefined) {
            formData.append(key, value.toString())
          }
        })

        requestOptions = {
          method: 'POST',
          body: formData
        }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }))
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`)
      }

      const blob = await response.blob()
      generatedQRCode.value = blob
      
      // Créer une URL pour l'affichage
      if (qrCodeUrl.value) {
        URL.revokeObjectURL(qrCodeUrl.value)
      }
      qrCodeUrl.value = URL.createObjectURL(blob)

      return {
        success: true,
        message: 'QR Code généré avec succès',
        blob,
        url: qrCodeUrl.value
      }

    } catch (err: any) {
      console.error('Erreur lors de la génération du QR code:', err)
      error.value = err.message || 'Une erreur est survenue lors de la génération du QR code'
      return null
    } finally {
      loading.value = false
    }
  }

  const generateQRCodeFromUrl = async (url: string, options: QRCodeOptions = {}): Promise<QRCodeResponse | null> => {
    loading.value = true
    error.value = ''
    
    try {
      const baseUrl = config.public.pgsBaseAPI
      const endpoint = `${baseUrl}/shortlinks/qrcode`

      // Préparer les données
      const formData = new FormData()
      formData.append('url', url)
      
      // Ajouter les options
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'logoFile' && value instanceof File) {
            formData.append(key, value)
          } else {
            formData.append(key, value.toString())
          }
        }
      })

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }))
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`)
      }

      const blob = await response.blob()
      generatedQRCode.value = blob
      
      // Créer une URL pour l'affichage
      if (qrCodeUrl.value) {
        URL.revokeObjectURL(qrCodeUrl.value)
      }
      qrCodeUrl.value = URL.createObjectURL(blob)

      return {
        success: true,
        message: 'QR Code généré avec succès',
        blob,
        url: qrCodeUrl.value
      }

    } catch (err: any) {
      console.error('Erreur lors de la génération du QR code:', err)
      error.value = err.message || 'Une erreur est survenue lors de la génération du QR code'
      return null
    } finally {
      loading.value = false
    }
  }

  const downloadQRCode = (filename?: string) => {
    if (!generatedQRCode.value || !qrCodeUrl.value) {
      error.value = 'Aucun QR code à télécharger'
      return
    }

    const link = document.createElement('a')
    link.href = qrCodeUrl.value
    link.download = filename || `qrcode-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearQRCode = () => {
    if (qrCodeUrl.value) {
      URL.revokeObjectURL(qrCodeUrl.value)
    }
    generatedQRCode.value = null
    qrCodeUrl.value = ''
    error.value = ''
  }

  const clearError = () => {
    error.value = ''
  }

  // Getters
  const hasQRCode = computed(() => !!generatedQRCode.value)
  const isGenerating = computed(() => loading.value)

  return {
    // State
    loading: readonly(loading),
    error: readonly(error),
    generatedQRCode: readonly(generatedQRCode),
    qrCodeUrl: readonly(qrCodeUrl),

    // Actions
    generateQRCodeFromLink,
    generateQRCodeFromUrl,
    downloadQRCode,
    clearQRCode,
    clearError,

    // Getters
    hasQRCode,
    isGenerating
  }
})
