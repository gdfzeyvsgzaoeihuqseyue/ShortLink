<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="url" class="block text-sm font-medium text-gray-700 mb-2">URL à analyser</label>
      <input
        id="url"
        v-model="form.url"
        type="url"
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        :disabled="socialsContactsStore.loading"
        placeholder="https://www.example.com"
      />
    </div>

    <div class="space-y-2">
      <div class="flex items-center">
        <input
          id="analyzeContactPage"
          v-model="form.analyzeContactPage"
          type="checkbox"
          class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          :disabled="socialsContactsStore.loading || form.analyzeAllPages"
        />
        <label for="analyzeContactPage" class="ml-2 text-sm font-medium text-gray-700">
          Analyser les pages contact et à propos
        </label>
      </div>
      <div class="flex items-center">
        <input
          id="analyzeAllPages"
          v-model="form.analyzeAllPages"
          type="checkbox"
          class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          :disabled="socialsContactsStore.loading"
        />
        <label for="analyzeAllPages" class="ml-2 text-sm font-medium text-gray-700">
          Analyser plus de pages du site (limité à 50)
        </label>
      </div>
    </div>

    <div v-if="!form.analyzeAllPages">
      <label for="specificPages" class="block text-sm font-medium text-gray-700 mb-2">
        Pages spécifiques à analyser (une par ligne, chemins relatifs ou URLs complètes)
      </label>
      <textarea
        id="specificPages"
        v-model="form.specificPagesInput"
        rows="4"
        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
        :disabled="socialsContactsStore.loading"
        placeholder="/mentions-legales&#10;https://www.example.com/blog"
      ></textarea>
    </div>

    <button
      type="submit"
      :disabled="socialsContactsStore.loading || !form.url"
      class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="socialsContactsStore.loading" class="flex items-center justify-center">
        <IconLoader2 class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
        Analyse en cours...
      </span>
      <span v-else>Lancer l'extraction</span>
    </button>
  </form>

  <div v-if="socialsContactsStore.error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
    <p class="text-red-700">{{ socialsContactsStore.error }}</p>
  </div>

  <!-- Real-time progress display -->
  <div v-if="socialsContactsStore.loading || socialsContactsStore.progressMessages.length > 0" class="mt-8 border-t pt-6">
    <h4 class="text-lg font-bold text-gray-900 mb-4">Progression de l'extraction</h4>
    <div class="bg-gray-100 p-4 rounded-lg max-h-60 overflow-y-auto text-sm space-y-2">
      <div v-for="(message, index) in socialsContactsStore.progressMessages" :key="index"
        :class="{
          'text-blue-700': message.type === 'info',
          'text-green-700': message.type === 'start' || message.type === 'complete' || message.type === 'success',
          'text-gray-700': message.type === 'progress',
          'text-orange-700': message.type === 'warning',
          'text-red-700': message.type === 'error',
        }">
        <span class="font-semibold">[{{ (message.type || 'info').toUpperCase() }}]</span>
        <span v-if="message.url" class="ml-1">{{ message.url }}:</span>
        <span class="ml-1">{{ message.message }}</span>
      </div>
    </div>
  </div>

  <div v-if="socialsContactsStore.result" class="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
    <h4 class="text-lg font-semibold text-green-800 mb-4">Résultats de l'extraction</h4>
    <div class="space-y-4">
      <div>
        <h5 class="font-medium text-gray-700 mb-2">Emails trouvés:</h5>
        <ul v-if="socialsContactsStore.result.emails.length" class="list-disc list-inside text-gray-600">
          <li v-for="email in socialsContactsStore.result.emails" :key="email">{{ email }}</li>
        </ul>
        <p v-else class="text-gray-600">Aucun email trouvé.</p>
      </div>
      <div>
        <h5 class="font-medium text-gray-700 mb-2">Numéros de téléphone trouvés:</h5>
        <ul v-if="socialsContactsStore.result.phoneNumbers.length" class="list-disc list-inside text-gray-600">
          <li v-for="phone in socialsContactsStore.result.phoneNumbers" :key="phone">{{ phone }}</li>
        </ul>
        <p v-else class="text-gray-600">Aucun numéro de téléphone trouvé.</p>
      </div>
      <div>
        <h5 class="font-medium text-gray-700 mb-2">Liens sociaux trouvés:</h5>
        <ul v-if="Object.keys(socialsContactsStore.result.socialLinks).length" class="list-disc list-inside text-gray-600">
          <li v-for="(link, platform) in socialsContactsStore.result.socialLinks" :key="platform">
            {{ platform }}: <a :href="link" target="_blank" class="text-primary-600 hover:underline">{{ link }}</a>
          </li>
        </ul>
        <p v-else class="text-gray-600">Aucun lien social trouvé.</p>
      </div>
    </div>
    <button @click="socialsContactsStore.clearResults" class="mt-4 btn-secondary">
      Effacer les résultats
    </button>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { useSocialsContactsStore } from '~/stores/socialsContacts';
import { IconLoader2 } from '@tabler/icons-vue';

const socialsContactsStore = useSocialsContactsStore();

const form = reactive({
  url: '',
  analyzeContactPage: true,
  analyzeAllPages: false,
  specificPagesInput: '', // String input for textarea
});

// Watch for analyzeAllPages to disable analyzeContactPage
watch(() => form.analyzeAllPages, (newValue) => {
  if (newValue) {
    form.analyzeContactPage = false;
    form.specificPagesInput = ''; // Clear specific pages if crawling all
  }
});

const handleSubmit = async () => {
  const specificPagesArray = form.specificPagesInput
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  await socialsContactsStore.extractData(
    form.url,
    form.analyzeContactPage,
    form.analyzeAllPages,
    specificPagesArray
  );
};
</script>
