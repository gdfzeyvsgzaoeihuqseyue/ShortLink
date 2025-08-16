<template>
  <div class="card p-6">
    <h3 class="text-xl font-bold text-gray-900 mb-6">Générateur de QR Code</h3>
    
    <!-- Tabs pour choisir le mode -->
    <div class="flex bg-gray-100 rounded-lg p-1 mb-6">
      <button 
        @click="mode = 'url'" 
        :class="[
          'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
          mode === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        À partir d'une URL
      </button>
      <button 
        @click="mode = 'link'" 
        :class="[
          'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
          mode === 'link' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        À partir d'un lien court
      </button>
    </div>

    <form @submit.prevent="generateQRCode" class="space-y-6">
      <!-- Input selon le mode -->
      <div v-if="mode === 'url'">
        <label class="block text-sm font-medium text-gray-700 mb-2">URL à encoder</label>
        <input
          v-model="inputUrl"
          type="url"
          required
          placeholder="https://exemple.com"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          :disabled="qrStore.loading"
        />
      </div>

      <div v-else>
        <label class="block text-sm font-medium text-gray-700 mb-2">Sélectionner un lien court</label>
        <select
          v-model="selectedLinkId"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          :disabled="qrStore.loading"
        >
          <option value="">Choisir un lien...</option>
          <option v-for="link in linksStore.links" :key="link.id" :value="link.id">
            {{ link.shortLink }} - {{ truncateUrl(link.longUrl, 50) }}
          </option>
        </select>
      </div>

      <!-- Options avancées -->
      <div class="border-t pt-6">
        <button
          type="button"
          @click="showAdvanced = !showAdvanced"
          class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-4"
        >
          <svg 
            :class="['w-4 h-4 mr-2 transition-transform', showAdvanced ? 'rotate-90' : '']" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          Options avancées
        </button>

        <div v-show="showAdvanced" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Format -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select v-model="options.format" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
                <option value="svg">SVG</option>
              </select>
            </div>

            <!-- Taille -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Taille (px)</label>
              <input
                v-model.number="options.size"
                type="number"
                min="100"
                max="2000"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <!-- Couleur de premier plan -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Couleur du QR code</label>
              <div class="flex items-center space-x-2">
                <input
                  v-model="options.foregroundColor"
                  type="color"
                  class="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  v-model="options.foregroundColor"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <!-- Couleur d'arrière-plan -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Couleur de fond</label>
              <div class="flex items-center space-x-2">
                <input
                  v-model="options.backgroundColor"
                  type="color"
                  class="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  v-model="options.backgroundColor"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <!-- Niveau de correction d'erreur -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Correction d'erreur</label>
              <select v-model="options.errorCorrectionLevel" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="L">Faible (~7%)</option>
                <option value="M">Moyen (~15%)</option>
                <option value="Q">Élevé (~25%)</option>
                <option value="H">Très élevé (~30%)</option>
              </select>
            </div>

            <!-- Marge -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Marge</label>
              <input
                v-model.number="options.margin"
                type="number"
                min="0"
                max="20"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <!-- Logo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Logo (optionnel)</label>
            <input
              ref="logoInput"
              type="file"
              accept="image/*"
              @change="handleLogoUpload"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <p class="text-xs text-gray-500 mt-1">Formats acceptés: PNG, JPEG, WebP</p>
          </div>

          <!-- Taille du logo -->
          <div v-if="options.logoFile">
            <label class="block text-sm font-medium text-gray-700 mb-2">Taille du logo (%)</label>
            <input
              v-model.number="options.logoSize"
              type="range"
              min="5"
              max="30"
              class="w-full"
            />
            <div class="text-sm text-gray-600 text-center">{{ options.logoSize }}%</div>
          </div>

          <!-- Signature -->
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input
                v-model="options.addSignature"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-2 text-sm font-medium text-gray-700">Ajouter la signature "by PGS"</span>
            </label>
          </div>

          <!-- Options de signature -->
          <div v-if="options.addSignature" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Couleur de la signature</label>
              <div class="flex items-center space-x-2">
                <input
                  v-model="options.signatureColor"
                  type="color"
                  class="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  v-model="options.signatureColor"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Taille de police</label>
              <input
                v-model.number="options.signatureFontSize"
                type="number"
                min="8"
                max="24"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <!-- Qualité (pour JPEG/WebP) -->
          <div v-if="options.format === 'jpeg' || options.format === 'webp'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Qualité ({{ options.quality }}%)</label>
            <input
              v-model.number="options.quality"
              type="range"
              min="1"
              max="100"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Bouton de génération -->
      <button
        type="submit"
        :disabled="qrStore.loading || (!inputUrl && !selectedLinkId)"
        class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="qrStore.loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Génération en cours...
        </span>
        <span v-else>
          <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01"></path>
          </svg>
          Générer le QR Code
        </span>
      </button>
    </form>

    <!-- Affichage du QR Code généré -->
    <div v-if="qrStore.hasQRCode" class="mt-8 p-6 bg-success-50 rounded-xl border border-success-200">
      <h4 class="text-lg font-semibold text-success-800 mb-4">✅ QR Code généré avec succès !</h4>
      
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Prévisualisation -->
        <div class="flex-1 text-center">
          <div class="inline-block p-4 bg-white rounded-lg shadow-sm">
            <img 
              :src="qrStore.qrCodeUrl" 
              alt="QR Code généré" 
              class="max-w-full h-auto"
              style="max-width: 300px;"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex-1 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              @click="downloadQRCode"
              class="btn-primary"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Télécharger
            </button>

            <button
              @click="copyQRCodeUrl"
              class="btn-secondary"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              {{ copied ? 'Copié!' : 'Copier l\'image' }}
            </button>
          </div>

          <button
            @click="clearQRCode"
            class="w-full text-gray-600 hover:text-gray-800 text-sm"
          >
            Générer un nouveau QR Code
          </button>
        </div>
      </div>
    </div>

    <!-- Affichage des erreurs -->
    <div v-if="qrStore.error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
      <p class="text-red-700">{{ qrStore.error }}</p>
      <button @click="qrStore.clearError" class="text-red-600 hover:text-red-800 text-sm mt-2">
        Fermer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useQRCodeStore, type QRCodeOptions } from '~/stores/qrcode'
import { useLinksStore } from '~/stores/links'

const qrStore = useQRCodeStore()
const linksStore = useLinksStore()

// État local
const mode = ref<'url' | 'link'>('url')
const inputUrl = ref('')
const selectedLinkId = ref('')
const showAdvanced = ref(false)
const copied = ref(false)
const logoInput = ref<HTMLInputElement>()

// Options du QR Code
const options = reactive<QRCodeOptions>({
  format: 'png',
  size: 300,
  quality: 92,
  foregroundColor: '#000000',
  backgroundColor: '#FFFFFF',
  errorCorrectionLevel: 'M',
  margin: 4,
  logoFile: null,
  logoSize: 20,
  addSignature: true,
  signatureColor: '#666666',
  signatureFontSize: 12
})

// Méthodes
const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    options.logoFile = file
  }
}

const generateQRCode = async () => {
  qrStore.clearError()
  
  if (mode.value === 'url') {
    await qrStore.generateQRCodeFromUrl(inputUrl.value, options)
  } else {
    await qrStore.generateQRCodeFromLink(selectedLinkId.value, options)
  }
}

const downloadQRCode = () => {
  const filename = mode.value === 'url' 
    ? `qrcode-url-${Date.now()}.${options.format}`
    : `qrcode-link-${Date.now()}.${options.format}`
  
  qrStore.downloadQRCode(filename)
}

const copyQRCodeUrl = async () => {
  if (!qrStore.qrCodeUrl) return
  
  try {
    // Pour les navigateurs modernes, copier l'image dans le presse-papiers
    const response = await fetch(qrStore.qrCodeUrl)
    const blob = await response.blob()
    
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ])
    
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
    // Fallback: copier l'URL de l'image
    try {
      await navigator.clipboard.writeText(qrStore.qrCodeUrl)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (fallbackErr) {
      console.error('Erreur lors de la copie de l\'URL:', fallbackErr)
    }
  }
}

const clearQRCode = () => {
  qrStore.clearQRCode()
  inputUrl.value = ''
  selectedLinkId.value = ''
  options.logoFile = null
  if (logoInput.value) {
    logoInput.value.value = ''
  }
}

const truncateUrl = (url: string, maxLength: number) => {
  return url.length > maxLength ? url.substring(0, maxLength) + '...' : url
}

// Charger les liens au montage si nécessaire
onMounted(() => {
  if (linksStore.links.length === 0) {
    linksStore.fetchLinks()
  }
})
</script>
