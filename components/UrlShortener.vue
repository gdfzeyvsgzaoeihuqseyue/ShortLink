<template>
  <div class="card p-8 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
      Raccourcissez votre lien instantanément
    </h2>

    <form @submit.prevent="shortenUrl" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          URL à raccourcir
        </label>
        <div class="relative">
          <input
            v-model="longUrl"
            type="url"
            placeholder="https://exemple.com/votre-lien-tres-long"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            :disabled="linksStore.loading"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        :disabled="linksStore.loading || !longUrl"
        class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="linksStore.loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Création en cours...
        </span>
        <span v-else>Raccourcir le lien</span>
      </button>
    </form>

    <!-- Résultat -->
    <div v-if="shortLink" class="mt-8 p-6 bg-success-50 rounded-xl border border-success-200">
      <h3 class="text-lg font-semibold text-success-800 mb-4">
        ✅ Lien raccourci avec succès !
      </h3>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-success-700 mb-1">Lien raccourci :</label>
          <div class="flex items-center space-x-2">
            <input
              ref="shortUrlInput"
              :value="shortLink.shortLink"
              readonly
              class="flex-1 px-3 py-2 bg-white border border-success-300 rounded-lg text-sm"
            />
            <button
              @click="copyToClipboard"
              class="px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors text-sm font-medium"
            >
              {{ copied ? 'Copié!' : 'Copier' }}
            </button>
          </div>
        </div>

        <div class="text-sm text-success-600">
          <span class="font-medium">Clics:</span> {{ shortLink.clicks || 0 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue'; 
import { useLinksStore } from '~/stores/links';

const emit = defineEmits(['linkCreated']);

const linksStore = useLinksStore();

const longUrl = ref('');
const shortLink = ref(null);
const copied = ref(false);
const shortUrlInput = ref(null);

const notificationMessage = ref('');
const notificationType = ref<'success' | 'error' | 'info'>('success');
const showNotification = ref(false);
let notificationTimeout = null;

const showFloatingNotification = (message, type = 'success') => {
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;

  notificationTimeout = setTimeout(() => {
    closeNotification();
  }, 3000);
};

const closeNotification = () => {
  showNotification.value = false;
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
};

watch(() => linksStore.error, (newError) => {
  if (newError) {
    showFloatingNotification(newError, 'error');
  }
});

const shortenUrl = async () => {
  linksStore.clearError();
  shortLink.value = null;

  const result = await linksStore.createShortLink(longUrl.value);

  if (result) {
    shortLink.value = result;
    showFloatingNotification('Lien raccourci avec succès !', 'success');
    emit('linkCreated', result); // Émet l'événement 'linkCreated' avec le nouveau lien
    // longUrl.value = ''; // Optionnel: réinitialiser le champ après succès
  }
};

const copyToClipboard = async () => {
  if (!shortLink.value) return;

  try {
    await navigator.clipboard.writeText(shortLink.value.shortLink);
    copied.value = true;
    showFloatingNotification('Lien copié dans le presse-papiers !', 'success');
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Échec de la copie:', err);
    showFloatingNotification('Impossible de copier le lien.', 'error');
  }
};
</script>
