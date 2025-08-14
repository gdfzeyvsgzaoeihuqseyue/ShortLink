<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="card p-8 max-w-md w-full text-center">
      <div v-if="redirectStore.loading" class="space-y-4">
        <svg class="animate-spin w-12 h-12 text-primary-600 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 class="text-xl font-semibold text-gray-900">Redirection en cours...</h2>
        <p class="text-gray-600">Vous allez être redirigé dans un instant.</p>
      </div>

      <div v-else-if="redirectStore.error" class="space-y-4">
        <svg class="w-12 h-12 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h2 class="text-xl font-semibold text-gray-900">Lien non trouvé</h2>
        <p class="text-gray-600">{{ redirectStore.error }}</p>
        <div class="space-y-2">
          <NuxtLink to="/" class="btn-primary inline-block">
            Retour à l'accueil
          </NuxtLink>
          <NuxtLink to="/dashboard" class="btn-secondary inline-block ml-2">
            Créer un lien
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const redirectStore = useRedirectStore()

const shortCode = route.params.shortCode as string

// Effectuer la redirection au montage du composant
onMounted(async () => {
  if (shortCode) {
    await redirectStore.redirectToLongUrl(shortCode)
  }
})

// SEO
useSeoMeta({
  title: `Redirection - ${shortCode}`,
  description: 'Redirection vers le lien original...',
  robots: 'noindex, nofollow'
})
</script>
