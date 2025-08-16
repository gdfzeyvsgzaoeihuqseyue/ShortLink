<template>
  <footer class="bg-gray-900 text-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="col-span-1 md:col-span-2">
          <div class="text-2xl font-bold bg-gradient-to-r from-primary-400 to-success-400 bg-clip-text text-transparent mb-4">
            QuickLink
          </div>
          <p class="text-gray-300 mb-6 max-w-md">
            La solution moderne pour raccourcir vos liens et analyser leur performance en temps réel.
          </p>
        </div>
        
        <div>
          <h3 class="font-semibold mb-4">Produit</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/pricing" class="text-gray-300 hover:text-white transition-colors">Tarifs</NuxtLink></li>
            <li><NuxtLink to="/dashboard" class="text-gray-300 hover:text-white transition-colors">Dashboard</NuxtLink></li>
            <li><NuxtLink to="/api" class="text-gray-300 hover:text-white transition-colors">API</NuxtLink></li>
          </ul>
        </div>
        
        <div>
          <h3 class="font-semibold mb-4">Support</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/about" class="text-gray-300 hover:text-white transition-colors">À propos</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-gray-300 hover:text-white transition-colors">Contact</NuxtLink></li>
            <li><NuxtLink to="/legal" class="text-gray-300 hover:text-white transition-colors">Mentions légales</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="text-gray-300 hover:text-white transition-colors">Confidentialité</NuxtLink></li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-gray-800 mt-12 pt-8">
        <p class="text-center text-gray-400">
          © {{ new Date().getFullYear() }} QuickLink. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
</template>