<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600">Gérez et analysez vos liens raccourcis</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total des liens</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalLinks }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total des clics</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalClicks }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Clics aujourd'hui</p>
              <p class="text-2xl font-bold text-gray-900">{{ todayClicks }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Liens actifs</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeLinks }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Create -->
      <div class="mb-8">
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Créer un nouveau lien</h2>
          <UrlShortener />
        </div>
      </div>

      <!-- Links Table -->
      <div class="card p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-900">Mes liens</h2>
          <button class="btn-primary">
            Nouveau lien
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Lien original</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Lien court</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Clics</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="link in linksStore.links" :key="link.id" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="py-4 px-4">
                  <div class="max-w-xs truncate" :title="link.longUrl">
                    {{ link.longUrl }}
                  </div>
                </td>
                <td class="py-4 px-4">
                  <a :href="link.shortLink" target="_blank" class="text-primary-600 hover:text-primary-700 font-medium">
                    {{ link.shortLink }}
                  </a>
                </td>
                <td class="py-4 px-4">
                  <span class="font-semibold">{{ link.clicks || 0 }}</span>
                </td>
                <td class="py-4 px-4 text-gray-600">
                  {{ formatDate(link.createdAt) }}
                </td>
                <td class="py-4 px-4">
                  <div class="flex space-x-2">
                    <button @click="copyLink(link.shortLink)" class="text-primary-600 hover:text-primary-700">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button @click="viewAnalytics(link)" class="text-secondary-600 hover:text-secondary-700">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </button>
                    <NuxtLink :to="`/dashboard/links/${link.id}`" class="text-gray-600 hover:text-gray-700">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </NuxtLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading state -->
        <div v-if="linksStore.loading && linksStore.links.length === 0" class="text-center py-12">
          <svg class="animate-spin w-8 h-8 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-500">Chargement des liens...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="linksStore.links.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun lien trouvé</h3>
          <p class="text-gray-500 mb-4">Commencez par créer votre premier lien raccourci</p>
          <button @click="$el.querySelector('input[type=url]')?.focus()" class="btn-primary">
            Créer mon premier lien
          </button>
        </div>

        <!-- Error state -->
        <div v-if="linksStore.error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div class="flex justify-between items-start">
            <p class="text-red-700 font-medium">{{ linksStore.error }}</p>
            <button @click="linksStore.clearError" class="text-red-500 hover:text-red-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="linksStore.pagination.totalPages > 1" class="mt-6 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Affichage de {{ linksStore.pagination.linksOnPage }} sur {{ linksStore.pagination.totalLinks }} liens
          </div>
          <div class="flex space-x-2">
            <button 
              @click="linksStore.fetchLinks(linksStore.pagination.currentPage - 1)"
              :disabled="linksStore.pagination.currentPage <= 1 || linksStore.loading"
              class="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Précédent
            </button>
            <span class="px-3 py-1 text-sm text-gray-700">
              Page {{ linksStore.pagination.currentPage }} sur {{ linksStore.pagination.totalPages }}
            </span>
            <button 
              @click="linksStore.fetchLinks(linksStore.pagination.currentPage + 1)"
              :disabled="linksStore.pagination.currentPage >= linksStore.pagination.totalPages || linksStore.loading"
              class="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const linksStore = useLinksStore()

// Récupérer les données au montage du composant
onMounted(async () => {
  await linksStore.fetchLinks()
})

// Computed properties basées sur le store
const links = computed(() => linksStore.links)
const totalLinks = computed(() => linksStore.stats.totalLinks)
const totalClicks = computed(() => linksStore.stats.totalClicks)
const todayClicks = computed(() => {
  return linksStore.stats.clicksToday
})
const activeLinks = computed(() => {
  return linksStore.links.filter(link => (link.clicks || 0) > 0).length
})

// Actions
const refreshLinks = async () => {
  await linksStore.refreshLinks()
}

const formatDate = (dateString) => {
  // Convertir le timestamp en date si nécessaire
  const date = typeof dateString === 'number' ? new Date(dateString) : new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}

const copyLink = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    alert('Lien copié!')
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
  }
}

const viewAnalytics = (link) => {
  alert(`Analytics pour ${link.shortLink}\n\nClics: ${link.clicks || 0}\nCréé le: ${formatDate(link.createdAt)}`)
}
</script>