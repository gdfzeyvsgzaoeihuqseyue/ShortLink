<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto p-6 relative">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <UrlShortener @link-created="handleLinkCreated" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import UrlShortener from '~/components/UrlShortener.vue';

// Définit les props acceptées par ce composant
const props = defineProps({
  visible: {
    type: Boolean,
    default: false 
  }
});

// Définit les événements que ce composant peut émettre
const emit = defineEmits(['close', 'linkCreated']);

// Gère l'événement 'linkCreated' émis par UrlShortener
const handleLinkCreated = () => {
  emit('linkCreated'); 
  emit('close'); 
};
</script>

