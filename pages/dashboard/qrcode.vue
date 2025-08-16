<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Générateur de QR Code</h1>
        <p class="text-gray-600">Créez des QR codes personnalisés pour vos liens ou URLs</p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Générateur principal -->
        <div class="xl:col-span-2">
          <QRCodeGenerator />
        </div>

        <!-- Sidebar avec informations et historique -->
        <div class="space-y-6">
          <!-- Informations sur les QR codes -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">À propos des QR codes</h3>
            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex items-start">
                <svg class="w-4 h-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Les QR codes peuvent stocker jusqu'à 4 296 caractères alphanumériques</span>
              </div>
              <div class="flex items-start">
                <svg class="w-4 h-4 text-success-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Correction d'erreur intégrée pour une lecture fiable</span>
              </div>
              <div class="flex items-start">
                <svg class="w-4 h-4 text-warning-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span>Formats multiples supportés (PNG, JPEG, SVG, WebP)</span>
              </div>
            </div>
          </div>

          <!-- Niveaux de correction d'erreur -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Niveaux de correction</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-700">Faible (L)</span>
                <span class="text-sm text-gray-600">~7% d'erreur</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-700">Moyen (M)</span>
                <span class="text-sm text-gray-600">~15% d'erreur</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-700">Élevé (Q)</span>
                <span class="text-sm text-gray-600">~25% d'erreur</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-700">Très élevé (H)</span>
                <span class="text-sm text-gray-600">~30% d'erreur</span>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-4">
              Un niveau plus élevé permet une meilleure récupération en cas de dommage, mais rend le QR code plus dense.
            </p>
          </div>

          <!-- Conseils d'utilisation -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Conseils d'utilisation</h3>
            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex items-start">
                <span class="w-2 h-2 bg-primary-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                <span>Utilisez un contraste élevé pour une meilleure lisibilité</span>
              </div>
              <div class="flex items-start">
                <span class="w-2 h-2 bg-success-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                <span>Testez toujours vos QR codes avant impression</span>
              </div>
              <div class="flex items-start">
                <span class="w-2 h-2 bg-warning-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                <span>Gardez une marge suffisante autour du code</span>
              </div>
              <div class="flex items-start">
                <span class="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                <span>Les logos ne doivent pas dépasser 30% de la taille</span>
              </div>
            </div>
          </div>

          <!-- Liens rapides -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Liens rapides</h3>
            <div class="space-y-2">
              <NuxtLink to="/dashboard" class="block text-sm text-primary-600 hover:text-primary-700">
                ← Retour au dashboard
              </NuxtLink>
              <NuxtLink to="/dashboard/links" class="block text-sm text-primary-600 hover:text-primary-700">
                Gérer mes liens
              </NuxtLink>
              <NuxtLink to="/dashboard/analytics" class="block text-sm text-primary-600 hover:text-primary-700">
                Voir les statistiques
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'Générateur de QR Code - Dashboard',
  description: 'Créez des QR codes personnalisés pour vos liens courts et URLs avec des options avancées.',
  robots: 'noindex, nofollow'
})
</script>
