<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 p-4">
    <div class="bg-white rounded-xl shadow-lg p-8 sm:p-10 md:p-12 max-w-2xl w-full text-center">
      <h1 class="text-7xl font-extrabold text-red-600 mb-4">403</h1>
      <h2 class="text-2xl sm:text-3xl font-semibold mb-6">Accès Interdit</h2>
      <p class="text-base sm:text-lg leading-relaxed text-gray-700 mb-8">
        Désolé, vous n'avez pas l'autorisation d'accéder à cette page.
        Le site est actuellement en mode test.
      </p>
      <NuxtLink to="/"
        class="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 transition-colors duration-300">
        <IconHome class="w-5 h-5 mr-2" />
        Retour à l'accueil
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { IconHome } from '@tabler/icons-vue';

definePageMeta({
  layout: false 
});

useSeoMeta({
  title: 'Accès Interdit',
  description: 'Vous n\'avez pas l\'autorisation d\'accéder à cette page.',
  robots: 'noindex, nofollow'
});
</script>
