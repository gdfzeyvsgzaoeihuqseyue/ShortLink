<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header avec navigation -->
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <NuxtLink to="/dashboard" class="text-primary-600 hover:text-primary-700 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Retour au dashboard
          </NuxtLink>
        </div>
        
        <div v-if="linksStore.currentLink">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Détails du lien</h1>
          <p class="text-gray-600">Informations et historique pour {{ linksStore.currentLink.shortCode }}</p>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="linksStore.loading" class="flex justify-center py-12">
        <svg class="animate-spin w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Error state -->
      <div v-else-if="linksStore.error" class="card p-8 text-center">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
        <p class="text-gray-600 mb-4">{{ linksStore.error }}</p>
        <NuxtLink to="/dashboard" class="btn-primary">
          Retour au dashboard
        </NuxtLink>
      </div>

      <!-- Link details -->
      <div v-else-if="linksStore.currentLink" class="space-y-8">
        <!-- Informations principales -->
        <div class="card p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Informations du lien</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">URL originale</label>
                <div class="p-3 bg-gray-50 rounded-lg border">
                  <a :href="linksStore.currentLink.longUrl" target="_blank" 
                     class="text-primary-600 hover:text-primary-700 break-all">
                    {{ linksStore.currentLink.longUrl }}
                  </a>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Lien raccourci</label>
                <div class="flex items-center space-x-2">
                  <div class="flex-1 p-3 bg-gray-50 rounded-lg border">
                    <a :href="linksStore.currentLink.shortLink" target="_blank" 
                       class="text-primary-600 hover:text-primary-700 font-medium">
                      {{ linksStore.currentLink.shortLink }}
                    </a>
                  </div>
                  <button @click="copyToClipboard(linksStore.currentLink.shortLink)" 
                          class="btn-secondary">
                    {{ copied ? 'Copié!' : 'Copier' }}
                  </button>
                </div>
              </div>
            </div>
            
            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-primary-50 rounded-lg">
                  <div class="text-2xl font-bold text-primary-600">{{ linksStore.currentLink.clicks || 0 }}</div>
                  <div class="text-sm text-primary-700">Clics total</div>
                </div>
                <div class="text-center p-4 bg-success-50 rounded-lg">
                  <div class="text-2xl font-bold text-success-600">{{ logsStore.totalLogs }}</div>
                  <div class="text-sm text-success-700">Événements</div>
                </div>
              </div>
              
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-700">Créé le :</span>
                  <span class="text-gray-900 ml-2">{{ formatDate(linksStore.currentLink.createdAt) }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-700">Modifié le :</span>
                  <span class="text-gray-900 ml-2">{{ formatDate(linksStore.currentLink.updatedAt) }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-700">Code court :</span>
                  <span class="text-gray-900 ml-2 font-mono">{{ linksStore.currentLink.shortCode }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Historique des événements -->
        <div class="card p-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Historique des événements</h2>
            <button @click="refreshLogs" :disabled="logsStore.loading" 
                    class="btn-secondary disabled:opacity-50">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Actualiser
            </button>
          </div>

          <!-- Loading logs -->
          <div v-if="logsStore.loading" class="text-center py-8">
            <svg class="animate-spin w-6 h-6 text-primary-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-500">Chargement de l'historique...</p>
          </div>

          <!-- Error logs -->
          <div v-else-if="logsStore.error" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-gray-500 mb-4">{{ logsStore.error }}</p>
            <button @click="logsStore.clearError" class="btn-secondary">
              Réessayer
            </button>
          </div>

          <!-- Empty logs -->
          <div v-else-if="logsStore.logs.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun événement</h3>
            <p class="text-gray-500">Aucun événement n'a été enregistré pour ce lien.</p>
          </div>

          <!-- Logs list -->
          <div v-else class="space-y-4">
            <div v-for="log in logsStore.logs" :key="log.id" 
                 class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getEventTypeClass(log.eventType)">
                      {{ getEventTypeLabel(log.eventType) }}
                    </span>
                    <span class="text-sm text-gray-500">
                      {{ formatDateTime(log.LogAt) }}
                    </span>
                  </div>
                  
                  <div v-if="log.ancienneUrl || log.nouvelleUrl" class="text-sm text-gray-600 space-y-1">
                    <div v-if="log.ancienneUrl" class="flex items-start">
                      <span class="font-medium mr-2">Ancienne URL:</span>
                      <span class="break-all">{{ log.ancienneUrl }}</span>
                    </div>
                    <div v-if="log.nouvelleUrl" class="flex items-start">
                      <span class="font-medium mr-2">Nouvelle URL:</span>
                      <span class="break-all">{{ log.nouvelleUrl }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="text-sm text-gray-500">
                  Par: {{ log.updatedBy || 'Système' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const linksStore = useLinksStore()
const logsStore = useLogsStore()

const linkId = route.params.id as string
const copied = ref(false)

// Charger les données au montage
onMounted(async () => {
  if (linkId) {
    await Promise.all([
      linksStore.fetchLinkById(linkId),
      logsStore.fetchLinkLogs(linkId)
    ])
  }
})

// Nettoyer les données au démontage
onUnmounted(() => {
  linksStore.clearCurrentLink()
  logsStore.clearLogs()
})

// Actions
const refreshLogs = async () => {
  if (linkId) {
    await logsStore.fetchLinkLogs(linkId)
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
  }
}

// Helpers
const formatDate = (dateString: string | number) => {
  const date = typeof dateString === 'number' ? new Date(dateString) : new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('fr-FR')
}

type EventType = 'created' | 'updated' | 'clicked' | 'deleted' | 'default';


const getEventTypeClass = (eventType: string) => {
  const classes: Record<EventType, string> = {
    'created': 'bg-success-100 text-success-800',
    'updated': 'bg-warning-100 text-warning-800',
    'clicked': 'bg-primary-100 text-primary-800',
    'deleted': 'bg-red-100 text-red-800',
    'default': 'bg-gray-100 text-gray-800'
  };

  const key = eventType as EventType;
  return classes[key] || classes.default;
};

const getEventTypeLabel = (eventType: string) => {
  const labels: Record<EventType, string> = {
    'created': 'Créé',
    'updated': 'Modifié',
    'clicked': 'Cliqué',
    'deleted': 'Supprimé',
    'default': eventType 
  };

  const key = eventType as EventType;
  return labels[key] || labels.default;
};

// SEO
useSeoMeta({
  title: `Détails du lien - ${linkId}`,
  description: 'Détails et historique d\'un lien raccourci',
  robots: 'noindex, nofollow'
})
</script>
