<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="pagespeed-url" class="block text-sm font-medium text-gray-700 mb-2">URL à analyser</label>
      <input
        id="pagespeed-url"
        v-model="url"
        type="url"
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        :disabled="pageSpeedStore.loading"
        placeholder="https://www.example.com"
      />
    </div>

    <button
      type="submit"
      :disabled="pageSpeedStore.loading || !url"
      class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="pageSpeedStore.loading" class="flex items-center justify-center">
        <IconLoader2 class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
        Analyse en cours...
      </span>
      <span v-else>Lancer l'analyse PageSpeed</span>
    </button>
  </form>

  <div v-if="pageSpeedStore.error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
    <p class="text-red-700">{{ pageSpeedStore.error }}</p>
  </div>

  <div v-if="pageSpeedStore.result" class="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
    <h4 class="text-lg font-semibold text-blue-800 mb-4">Résultats PageSpeed pour {{ pageSpeedStore.result.url }}</h4>
    <div class="space-y-4">
      <div>
        <h5 class="font-medium text-gray-700 mb-2">Score de performance:</h5>
        <div class="text-2xl font-bold" :class="getScoreColorClass(pageSpeedStore.result.performanceScore)">
          {{ Math.round(pageSpeedStore.result.performanceScore) }}
        </div>
        <p class="text-sm text-gray-600">
          (0-49: Mauvais, 50-89: Moyen, 90-100: Bon)
        </p>
      </div>

      <div>
        <h5 class="font-medium text-gray-700 mb-2">Métriques clés:</h5>
        <ul class="space-y-2">
          <li v-for="(metric, key) in pageSpeedStore.result.metrics" :key="key" class="flex items-center justify-between">
            <template v-if="metric"> <!-- Correction ici -->
              <span class="text-gray-600">{{ metric.title }}:</span>
              <span class="font-semibold" :class="getScoreColorClass(metric.score * 100)">
                {{ metric.displayValue }}
              </span>
            </template>
          </li>
        </ul>
      </div>
    </div>
    <button @click="pageSpeedStore.clearResults" class="mt-4 btn-secondary">
      Effacer les résultats
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePageSpeedStore } from '~/stores/pageSpeed';
import { IconLoader2 } from '@tabler/icons-vue';

const pageSpeedStore = usePageSpeedStore();
const url = ref('');

const handleSubmit = async () => {
  await pageSpeedStore.analyzeUrl(url.value);
};

const getScoreColorClass = (score: number) => {
  if (score >= 90) {
    return 'text-green-600';
  } else if (score >= 50) {
    return 'text-orange-600';
  } else {
    return 'text-red-600';
  }
};
</script>
