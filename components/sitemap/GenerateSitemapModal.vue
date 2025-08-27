<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-gray-900">Générer un nouveau Sitemap</h3>
        <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-600">
          <IconX class="w-6 h-6" />
        </button>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <div>
          <label for="url" class="block text-sm font-medium text-gray-700 mb-2">URL du site à analyser <span class="text-red-500">*</span></label>
          <input id="url" v-model="form.url" type="url" required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :disabled="loading" placeholder="https://example.com" />
        </div>

        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Titre du Sitemap (optionnel)</label>
          <input id="title" v-model="form.title" type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :disabled="loading" placeholder="Mon super site" />
        </div>

        <div class="border-t pt-6">
          <button type="button" @click="showAdvanced = !showAdvanced"
            class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-4">
            <IconChevronRight :class="['w-4 h-4 mr-2 transition-transform', showAdvanced ? 'rotate-90' : '']" />
            Options avancées
          </button>

          <div v-show="showAdvanced" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center">
              <input id="includePriority" v-model="form.includePriority" type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" :disabled="loading" />
              <label for="includePriority" class="ml-2 text-sm font-medium text-gray-700">Inclure la priorité</label>
            </div>
            <div class="flex items-center">
              <input id="includeLastmod" v-model="form.includeLastmod" type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" :disabled="loading" />
              <label for="includeLastmod" class="ml-2 text-sm font-medium text-gray-700">Inclure la dernière modification</label>
            </div>
            <div class="flex items-center">
              <input id="includeChangefreq" v-model="form.includeChangefreq" type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" :disabled="loading" />
              <label for="includeChangefreq" class="ml-2 text-sm font-medium text-gray-700">Inclure la fréquence de changement</label>
            </div>
            <div>
              <label for="changefreq" class="block text-sm font-medium text-gray-700 mb-2">Fréquence de changement</label>
              <select id="changefreq" v-model="form.changefreq"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                :disabled="loading">
                <option value="always">Toujours</option>
                <option value="hourly">Horaire</option>
                <option value="daily">Quotidien</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuel</option>
                <option value="yearly">Annuel</option>
                <option value="never">Jamais</option>
              </select>
            </div>
            <div>
              <label for="maxPages" class="block text-sm font-medium text-gray-700 mb-2">Nombre max de pages (0 pour illimité)</label>
              <input id="maxPages" v-model.number="form.maxPages" type="number" min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                :disabled="loading" />
            </div>
            <div class="flex items-center">
              <input id="followRobotsTxt" v-model="form.followRobotsTxt" type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" :disabled="loading" />
              <label for="followRobotsTxt" class="ml-2 text-sm font-medium text-gray-700">Respecter robots.txt</label>
            </div>
            <div class="flex items-center">
              <input id="ignoreNoindex" v-model="form.ignoreNoindex" type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" :disabled="loading" />
              <label for="ignoreNoindex" class="ml-2 text-sm font-medium text-gray-700">Ignorer "noindex"</label>
            </div>
            <div class="flex items-center">
              <input id="ignoreNofollow" v-model="form.ignoreNofollow" type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" :disabled="loading" />
              <label for="ignoreNofollow" class="ml-2 text-sm font-medium text-gray-700">Ignorer "nofollow"</label>
            </div>
            <div class="flex items-center">
              <input id="ignoreNonCanonical" v-model="form.ignoreNonCanonical" type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" :disabled="loading" />
              <label for="ignoreNonCanonical" class="ml-2 text-sm font-medium text-gray-700">Ignorer non-canonique</label>
            </div>
            <div class="flex items-center">
              <input id="includeImages" v-model="form.includeImages" type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" :disabled="loading" />
              <label for="includeImages" class="ml-2 text-sm font-medium text-gray-700">Inclure les images</label>
            </div>
          </div>
        </div>

        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p class="text-red-700">{{ error }}</p>
        </div>

        <div class="flex space-x-3 pt-6">
          <button type="submit" :disabled="loading" class="flex-1 btn-primary disabled:opacity-50">
            <span v-if="loading" class="flex items-center justify-center">
              <IconLoader2 class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Génération en cours...
            </span>
            <span v-else>Générer le Sitemap</span>
          </button>
          <button type="button" @click="$emit('cancel')" class="flex-1 btn-secondary" :disabled="loading">
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { IconX, IconChevronRight, IconLoader2 } from '@tabler/icons-vue';
import type { SitemapGenerationOptions } from '@/types';

const props = defineProps<{
  visible: boolean;
  loading?: boolean;
  error?: string | null;
  initialUrl?: string; // URL pré-remplie
}>();

const emit = defineEmits<{
  (e: 'submit', options: SitemapGenerationOptions): void;
  (e: 'cancel'): void;
}>();

const showAdvanced = ref(false);

const form = reactive<SitemapGenerationOptions>({
  url: '',
  title: '',
  includePriority: true,
  includeLastmod: false,
  includeChangefreq: true,
  changefreq: 'weekly',
  maxPages: 0,
  followRobotsTxt: true,
  ignoreNoindex: true,
  ignoreNofollow: false,
  ignoreNonCanonical: true,
  includeImages: false,
});

watch(() => props.visible, (newVal) => {
  if (newVal) {
    // Réinitialiser le formulaire et pré-remplir si initialUrl est fourni
    Object.assign(form, {
      url: props.initialUrl || '',
      title: '',
      includePriority: true,
      includeLastmod: false,
      includeChangefreq: true,
      changefreq: 'weekly',
      maxPages: 0,
      followRobotsTxt: true,
      ignoreNoindex: true,
      ignoreNofollow: false,
      ignoreNonCanonical: true,
      includeImages: false,
    });
    showAdvanced.value = false; // Cacher les options avancées par défaut
  }
});

const onSubmit = () => {
  emit('submit', { ...form });
};
</script>
