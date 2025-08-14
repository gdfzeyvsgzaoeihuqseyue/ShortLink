<template>
  <div>
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-600 via-purple-700 to-success-600 opacity-10"></div>
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Raccourcissez vos liens
            <span class="bg-gradient-to-r from-primary-600 to-success-500 bg-clip-text text-transparent">
              intelligemment
            </span>
          </h1>
          <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Transformez vos liens longs en liens courts mémorables et suivez leur performance en temps réel avec des analyses détaillées.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <NuxtLink to="/dashboard" class="btn-primary text-lg px-8 py-4">
              Commencer gratuitement
            </NuxtLink>
            <NuxtLink to="/pricing" class="btn-secondary text-lg px-8 py-4">
              Voir les tarifs
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- URL Shortener -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <UrlShortener />
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Pourquoi choisir QuickLink ?
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Des fonctionnalités puissantes pour optimiser vos liens et maximiser votre impact.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card p-8 text-center hover:shadow-2xl transition-shadow duration-300">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Raccourcissement instantané</h3>
            <p class="text-gray-600">
              Transformez n'importe quel lien long en URL courte et mémorable en quelques secondes.
            </p>
          </div>
          
          <div class="card p-8 text-center hover:shadow-2xl transition-shadow duration-300">
            <div class="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Analytics détaillées</h3>
            <p class="text-gray-600">
              Suivez les clics, analysez l'audience et mesurez la performance de vos liens.
            </p>
          </div>
          
          <div class="card p-8 text-center hover:shadow-2xl transition-shadow duration-300">
            <div class="w-16 h-16 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Sécurisé & Fiable</h3>
            <p class="text-gray-600">
              Infrastructure sécurisée avec 99.9% de disponibilité et protection contre le spam.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-gradient-to-r from-primary-600 to-success-600">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div class="text-white">
            <div class="text-4xl md:text-5xl font-bold mb-2">1M+</div>
            <div class="text-primary-100 text-lg">Liens raccourcis</div>
          </div>
          <div class="text-white">
            <div class="text-4xl md:text-5xl font-bold mb-2">50K+</div>
            <div class="text-primary-100 text-lg">Utilisateurs actifs</div>
          </div>
          <div class="text-white">
            <div class="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
            <div class="text-primary-100 text-lg">Temps de disponibilité</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Prêt à optimiser vos liens ?
        </h2>
        <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Rejoignez des milliers d'utilisateurs qui font confiance à QuickLink pour leurs besoins de raccourcissement de liens.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/dashboard" class="btn-primary text-lg px-8 py-4">
            Commencer maintenant
          </NuxtLink>
          <NuxtLink to="/contact" class="btn-secondary text-lg px-8 py-4">
            Nous contacter
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'QuickLink - Raccourcisseur d\'URL intelligent',
  description: 'Transformez vos liens longs en URLs courtes avec des analyses détaillées. Service gratuit et sécurisé.',
})
</script>