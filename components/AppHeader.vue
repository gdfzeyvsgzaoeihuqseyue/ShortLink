<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
    <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <NuxtLink to="/" class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-success-500 bg-clip-text text-transparent">
            QuickLink
          </NuxtLink>
        </div>
        
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <NuxtLink to="/" class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              Accueil
            </NuxtLink>
            <NuxtLink to="/pricing" class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              Tarifs
            </NuxtLink>
            <NuxtLink to="/about" class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              À propos
            </NuxtLink>
            <NuxtLink to="/contact" class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              Contact
            </NuxtLink>
            <NuxtLink to="/dashboard" class="btn-primary">
              Dashboard
            </NuxtLink>
          </div>
        </div>

        <div class="md:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-700 hover:text-primary-600">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile menu -->
    <div v-show="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <NuxtLink to="/" class="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium">Accueil</NuxtLink>
        <NuxtLink to="/pricing" class="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium">Tarifs</NuxtLink>
        <NuxtLink to="/about" class="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium">À propos</NuxtLink>
        <NuxtLink to="/contact" class="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium">Contact</NuxtLink>
        <NuxtLink to="/dashboard" class="block px-3 py-2 text-primary-600 font-medium">Dashboard</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
const mobileMenuOpen = ref(false)
</script>