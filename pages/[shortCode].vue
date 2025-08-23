<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="card p-8 max-w-md w-full text-center lg:max-w-2xl">
      <div v-if="loading" class="space-y-4">
        <IconLoader class="animate-spin w-12 h-12 text-primary-600 mx-auto" />
        <h2 class="text-xl font-semibold text-gray-900">Chargement du lien...</h2>
        <p class="text-gray-600">Veuillez patienter.</p>
      </div>

      <div v-else-if="error" class="space-y-4">
        <IconAlertTriangle class="w-12 h-12 text-red-500 mx-auto" />
        <h2 class="text-xl font-semibold text-gray-900">Erreur</h2>
        <p class="text-gray-600">{{ error }}</p>
        <div class="space-y-2">
          <NuxtLink to="/" class="btn-primary inline-block">
            Retour à l'accueil
          </NuxtLink>
          <NuxtLink to="/db" class="btn-secondary inline-block ml-2">
            Créer un lien
          </NuxtLink>
        </div>
      </div>

      <div v-else-if="showCountdown && linksStore.currentLink" class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-900">Vous allez être redirigé</h2>

        <div class="bg-gray-100 p-4 rounded-lg text-left space-y-2">
          <div v-if="linksStore.currentLink.metadata?.image" class="mb-4">
            <img :src="linksStore.currentLink.metadata.image" alt="Image de prévisualisation"
              class="w-full h-auto rounded-md object-cover max-h-48" />
          </div>
          <p class="text-lg font-semibold text-gray-800">
            {{ linksStore.currentLink.metadata?.title || linksStore.currentLink.longUrl }}
          </p>
          <p v-if="linksStore.currentLink.metadata?.description" class="text-gray-600 text-sm">
            {{ linksStore.currentLink.metadata.description }}
          </p>
          <p class="text-gray-500 text-xs break-all">URL: {{ linksStore.currentLink.longUrl }}</p>
        </div>

        <p v-if="!redirectionCancelled" class="text-gray-700 text-lg">
          Redirection automatique dans <span class="font-bold text-primary-600">{{ countdownSeconds }}</span> secondes...
        </p>
        <p v-else class="text-gray-700 text-lg font-bold text-red-600">
          Redirection annulée.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <button @click="performRedirect" :disabled="redirectionCancelled"
            class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
            Rediriger maintenant
          </button>
          <button @click="cancelRedirection" :disabled="redirectionCancelled"
            class="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed">
            Annuler la redirection
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconAlertTriangle, IconLoader } from '@tabler/icons-vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLinksStore } from '~/stores/links';

// Récupérer le code court à partir des paramètres de l'URL
const route = useRoute();
const shortCode = route.params.shortCode as string;

// Initialiser le store des liens
const linksStore = useLinksStore();

// États du composant
const loading = ref(true);
const error = ref<string | null>(null);
const countdownSeconds = ref(10);
const showCountdown = ref(false);
const redirectionCancelled = ref(false); // Nouvelle variable d'état

let redirectTimeout: NodeJS.Timeout | null = null;
let countdownInterval: NodeJS.Timeout | null = null;

// Fonction pour effectuer la redirection
const performRedirect = () => {
  if (redirectionCancelled.value) return; // Ne rien faire si annulé

  if (redirectTimeout) clearTimeout(redirectTimeout);
  if (countdownInterval) clearInterval(countdownInterval);

  const config = useRuntimeConfig();
  window.location.href = `${config.public.pgsBaseAPI}/shortlinks/redirect/${shortCode}`;
};

// Fonction pour annuler la redirection
const cancelRedirection = () => {
  if (redirectTimeout) clearTimeout(redirectTimeout);
  if (countdownInterval) clearInterval(countdownInterval);
  redirectionCancelled.value = true;
};

onMounted(async () => {
  if (!shortCode) {
    loading.value = false;
    error.value = 'Code court manquant.';
    return;
  }

  try {
    // 1. Récupérer les détails du lien
    const linkDetails = await linksStore.fetchLinkById(shortCode);

    if (!linkDetails) {
      loading.value = false;
      error.value = linksStore.error || 'Lien introuvable ou inaccessible.';
      return;
    }

    // Si le lien est désactivé, afficher l'erreur immédiatement
    if (linkDetails.disabled) {
      loading.value = false;
      error.value = 'Ce lien est désactivé.';
      return;
    }

    // Extraire les métadonnées de l'URL longue
    await linksStore.extractMetadata(linkDetails.longUrl);

    // Mettre fin au chargement et afficher la section de compte à rebours/métadonnées
    loading.value = false;
    showCountdown.value = true;

    // 3. Démarrer le compte à rebours
    countdownInterval = setInterval(() => {
      if (redirectionCancelled.value) { // Vérifier si annulé pendant le compte à rebours
        clearInterval(countdownInterval!);
        return;
      }
      countdownSeconds.value--;
      if (countdownSeconds.value <= 0) {
        clearInterval(countdownInterval!);
        performRedirect();
      }
    }, 1000);

    // Définir le délai pour la redirection automatique
    redirectTimeout = setTimeout(() => {
      performRedirect();
    }, 10000); // 10 secondes

  } catch (err: any) {
    loading.value = false;
    error.value = err.message || 'Une erreur est survenue lors du chargement du lien.';
  }
});

// Nettoyer les timers et le store lors du démontage du composant
onUnmounted(() => {
  if (redirectTimeout) clearTimeout(redirectTimeout);
  if (countdownInterval) clearInterval(countdownInterval);
  linksStore.clearCurrentLink();
  linksStore.clearMetadataError();
});

// SEO
useSeoMeta({
  title: `Redirection de ${shortCode}`,
  description: 'Redirection vers le lien original...',
  robots: 'noindex, nofollow'
});
</script>
