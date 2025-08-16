<template>
  <div v-if="isVisible" :class="{
    'bg-green-500': type === 'success',
    'bg-red-500': type === 'error',
    'bg-blue-500': type === 'info',
  }"
    class="fixed top-4 right-4 p-4 rounded-lg text-white shadow-lg flex items-center justify-between z-[1000] transition-opacity duration-300"
    style="min-width: 250px; max-width: 90%; opacity: 1;">
    <span>{{ message }}</span>
    <button @click="$emit('close')" class="ml-4 text-white hover:text-gray-200">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value: string) => ['success', 'error', 'info'].includes(value)
  }
});

const emit = defineEmits(['close']);
</script>