<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Overlay pour mobile -->
    <div 
      v-if="sidebarOpen && isMobile" 
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <div 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        sidebarCollapsed && !isMobile ? 'lg:w-16' : 'lg:w-64'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Header du sidebar -->
        <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div v-if="!sidebarCollapsed || isMobile" class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold bg-gradient-to-r from-primary-600 to-success-500 bg-clip-text text-transparent">
              QuickLink
            </NuxtLink>
          </div>
          <div v-else class="flex justify-center w-full">
            <div class="w-8 h-8 bg-gradient-to-r from-primary-600 to-success-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">Q</span>
            </div>
          </div>
          
          <!-- Bouton pour fermer sur mobile -->
          <button 
            v-if="isMobile"
            @click="sidebarOpen = false"
            class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NuxtLink 
            to="/dashboard"
            :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              $route.path === '/dashboard' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"></path>
            </svg>
            <span v-if="!sidebarCollapsed || isMobile">Dashboard</span>
          </NuxtLink>

          <NuxtLink 
            to="/dashboard/links"
            :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              $route.path.startsWith('/dashboard/links') 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
            <span v-if="!sidebarCollapsed || isMobile">Mes liens</span>
          </NuxtLink>

          <NuxtLink 
            to="/dashboard/qrcode"
            :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              $route.path === '/dashboard/qrcode' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01"></path>
            </svg>
            <span v-if="!sidebarCollapsed || isMobile">QR Code</span>
          </NuxtLink>

          <NuxtLink 
            to="/dashboard/analytics"
            :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              $route.path === '/dashboard/analytics' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <span v-if="!sidebarCollapsed || isMobile">Analytics</span>
          </NuxtLink>

          <!-- Divider -->
          <div class="border-t border-gray-200 my-4"></div>

          <NuxtLink 
            to="/dashboard/settings"
            :class="[
              'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              $route.path === '/dashboard/settings' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span v-if="!sidebarCollapsed || isMobile">Paramètres</span>
          </NuxtLink>
        </nav>

        <!-- Footer du sidebar -->
        <div class="border-t border-gray-200 p-4">
          <!-- Bouton pour replier/déplier sur desktop -->
          <button 
            v-if="!isMobile"
            @click="sidebarCollapsed = !sidebarCollapsed"
            class="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg 
              :class="['w-5 h-5 transition-transform', sidebarCollapsed ? 'rotate-180' : '']" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
            <span v-if="!sidebarCollapsed" class="ml-2">Réduire</span>
          </button>

          <!-- Lien retour vers le site -->
          <NuxtLink 
            to="/"
            :class="[
              'flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors',
              isMobile || !sidebarCollapsed ? 'justify-start' : 'justify-center'
            ]"
          >
            <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span v-if="!sidebarCollapsed || isMobile">Retour au site</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header mobile -->
      <div class="lg:hidden bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between h-16 px-4">
          <button 
            @click="sidebarOpen = true"
            class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          <div class="text-lg font-semibold text-gray-900">
            {{ pageTitle }}
          </div>
          
          <div class="w-10"></div> <!-- Spacer pour centrer le titre -->
        </div>
      </div>

      <!-- Contenu de la page -->
      <main class="flex-1 overflow-auto">
        <div class="p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// État du sidebar
const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)
const isMobile = ref(false)

// Titre de la page basé sur la route
const pageTitle = computed(() => {
  const path = route.path
  if (path === '/dashboard') return 'Dashboard'
  if (path.startsWith('/dashboard/links')) return 'Mes liens'
  if (path === '/dashboard/qrcode') return 'QR Code'
  if (path === '/dashboard/analytics') return 'Analytics'
  if (path === '/dashboard/settings') return 'Paramètres'
  return 'Dashboard'
})

// Détection de la taille d'écran
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    sidebarOpen.value = false
  }
}

// Fermer le sidebar mobile lors du changement de route
watch(() => route.path, () => {
  if (isMobile.value) {
    sidebarOpen.value = false
  }
})

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  
  // Récupérer l'état du sidebar depuis le localStorage
  const savedCollapsed = localStorage.getItem('sidebarCollapsed')
  if (savedCollapsed !== null) {
    sidebarCollapsed.value = JSON.parse(savedCollapsed)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

// Sauvegarder l'état du sidebar
watch(sidebarCollapsed, (newValue) => {
  localStorage.setItem('sidebarCollapsed', JSON.stringify(newValue))
})
</script>
