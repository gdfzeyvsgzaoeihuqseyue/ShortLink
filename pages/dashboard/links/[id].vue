<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <NuxtLink to="/dashboard/links" class="text-primary-600 hover:text-primary-700 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Retour aux liens
          </NuxtLink>
        </div>
        <div v-if="linksStore.currentLink">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Détails du lien</h1>
          <p class="text-gray-600">Informations et historique pour {{ linksStore.currentLink.shortCode }}</p>
        </div>
      </div>

      <div v-if="linksStore.loading" class="flex justify-center py-12">
        <svg class="animate-spin w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="linksStore.error" class="card p-8 text-center">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
        <p class="text-gray-600 mb-4">{{ linksStore.error }}</p>
        <NuxtLink to="/dashboard/links" class="btn-primary">Retour au dashboard</NuxtLink>
      </div>

      <div v-else-if="linksStore.currentLink" class="space-y-8">
        <div class="card p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Informations du lien</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">URL originale</label>
                <div class="p-3 bg-gray-50 rounded-lg border">
                  <a :href="linksStore.currentLink.longUrl" target="_blank" class="text-primary-600 hover:text-primary-700 break-all">
                    {{ linksStore.currentLink.longUrl }}
                  </a>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Lien raccourci</label>
                <div class="flex items-center space-x-2">
                  <div class="flex-1 p-3 bg-gray-50 rounded-lg border">
                    <a :href="linksStore.currentLink.shortLink" target="_blank" class="text-primary-600 hover:text-primary-700 font-medium">
                      {{ linksStore.currentLink.shortLink }}
                    </a>
                  </div>
                  <button @click="copyToClipboard(linksStore.currentLink.shortLink)" class="btn-secondary">
                    {{ copied ? 'Copié!' : 'Copier' }}
                  </button>
                </div>
              </div>
              <div class="flex space-x-3">
                <button @click="editLink" class="btn-primary">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </button>
                <button @click="confirmDelete" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-colors">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer
                </button>
              </div>
            </div>
            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-primary-50 rounded-lg">
                  <div class="text-2xl font-bold text-primary-600">{{ linksStore.currentLink.clicks || 0 }}</div>
                  <div class="text-sm text-primary-700">Clics total</div>
                </div>
                <div class="text-center p-4 bg-success-50 rounded-lg">
                  <div class="text-2xl font-bold text-success-600">{{ logsStore.totalLogs }}</div>
                  <div class="text-sm text-success-700">Événements</div>
                </div>
              </div>
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-700">Créé le :</span>
                  <span class="text-gray-900 ml-2">{{ formatDate(linksStore.currentLink.createdAt) }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-700">Modifié le :</span>
                  <span class="text-gray-900 ml-2">{{ formatDate(linksStore.currentLink.updatedAt) }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-700">Code court :</span>
                  <span class="text-gray-900 ml-2 font-mono">{{ linksStore.currentLink.shortCode }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card p-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Historique des événements</h2>
            <button @click="refreshLogs" :disabled="logsStore.loading" class="btn-secondary disabled:opacity-50">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Actualiser
            </button>
          </div>

          <div v-if="logsStore.loading" class="text-center py-8">
            <svg class="animate-spin w-6 h-6 text-primary-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-500">Chargement de l'historique...</p>
          </div>
          <div v-else-if="logsStore.error" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-gray-500 mb-4">{{ logsStore.error }}</p>
            <button @click="refreshLogs" class="btn-secondary">Réessayer</button>
          </div>
          <div v-else-if="logsStore.logs.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun événement</h3>
            <p class="text-gray-500">Aucun événement n'a été enregistré pour ce lien.</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="log in logsStore.logs" :key="log.id" class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getEventTypeClass(log.eventType)">
                      {{ getEventTypeLabel(log.eventType) }}
                    </span>
                    <span class="text-sm text-gray-500">{{ formatDateTime(log.LogAt) }}</span>
                  </div>
                  <div v-if="log.oldUrl || log.newUrl" class="text-sm text-gray-600 space-y-1">
                    <div v-if="log.oldUrl" class="flex items-start">
                      <span class="font-medium mr-2">Ancienne URL:</span>
                      <span class="break-all">{{ log.oldUrl }}</span>
                    </div>
                    <div v-if="log.newUrl" class="flex items-start">
                      <span class="font-medium mr-2">Nouvelle URL:</span>
                      <span class="break-all">{{ log.newUrl }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-sm text-gray-500">Par: {{ log.updatedBy || 'Système' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <EditLinkModal :visible="showEditModal" :link="linksStore.currentLink" @submit="handleUpdateLink" @cancel="cancelEdit" />
  <DeleteModal :visible="showDeleteModal" :link="linksStore.currentLink" @confirm="deleteLink" @cancel="cancelDelete" />
  <AppNotification :isVisible="showNotification" :message="notificationMessage" :type="notificationType" @close="closeNotification" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLinksStore, type ShortLink } from '~/stores/links';
import { useLogsStore } from '~/stores/logs';

definePageMeta({
  layout: 'dashboard'
});

const route = useRoute();
const router = useRouter();
const linksStore = useLinksStore();
const logsStore = useLogsStore();

const linkId = route.params.id as string;
const copied = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);

const notificationMessage = ref('');
const notificationType = ref<'success' | 'error' | 'info'>('success');
const showNotification = ref(false);
let notificationTimeout: NodeJS.Timeout | null = null;

// Fonction pour afficher la notification flottante
const showFloatingNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;

  notificationTimeout = setTimeout(() => {
    closeNotification();
  }, 3000); // Notification visible pendant 3 secondes
};

const closeNotification = () => {
  showNotification.value = false;
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
};

// Charger les données au montage
onMounted(async () => {
  if (linkId) {
    await Promise.all([
      linksStore.fetchLinkById(linkId),
      logsStore.fetchLinkLogs(linkId),
    ]);
  }
});

// Nettoyer les données au démontage pour éviter les fuites de mémoire
onUnmounted(() => {
  linksStore.clearCurrentLink();
  logsStore.clearLogs();
});

// Actions sur le lien
const refreshLogs = async () => {
  if (linkId) {
    await logsStore.fetchLinkLogs(linkId);
  }
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
    showFloatingNotification('Lien copié dans le presse-papiers !', 'success');
  } catch (err) {
    console.error('Erreur lors de la copie:', err);
    showFloatingNotification('Impossible de copier le lien.', 'error');
  }
};

const editLink = () => {
  showEditModal.value = true;
};

const handleUpdateLink = async (newLongUrl: string) => {
  if (!linksStore.currentLink) {
    showFloatingNotification('Aucun lien à mettre à jour.', 'error');
    return;
  }
  
  const success = await linksStore.updateLink(linksStore.currentLink.id, newLongUrl);
  
  if (success) {
    showEditModal.value = false;
    await logsStore.fetchLinkLogs(linkId);
    showFloatingNotification('Lien mis à jour avec succès !', 'success');
  } else {
    showFloatingNotification(linksStore.error || 'Erreur lors de la mise à jour.', 'error');
  }
};

const cancelEdit = () => {
  showEditModal.value = false;
  linksStore.clearError();
};

const confirmDelete = () => {
  if (!linksStore.currentLink) {
    showFloatingNotification('Aucun lien à supprimer.', 'error');
    return;
  }
  showDeleteModal.value = true;
};

const deleteLink = async () => {
  if (!linksStore.currentLink) {
    showFloatingNotification('Aucun lien à supprimer.', 'error');
    return;
  }
  
  const success = await linksStore.deleteLink(linksStore.currentLink.id);
  
  if (success) {
    showDeleteModal.value = false;
    linksStore.clearCurrentLink();
    showFloatingNotification('Lien supprimé avec succès !', 'success');
    await router.push('/dashboard/links');
  } else {
    showFloatingNotification(linksStore.error || 'Erreur lors de la suppression.', 'error');
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  linksStore.clearError();
};

// Fonctions d'aide
const formatDate = (dateString: string | number) => {
  const date = typeof dateString === 'number' ? new Date(dateString) : new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR');
};

type EventType = 'created' | 'updated' | 'clicked' | 'deleted' | 'default';

const getEventTypeClass = (eventType: string) => {
  const classes: Record<EventType, string> = {
    'created': 'bg-green-100 text-green-800',
    'updated': 'bg-yellow-100 text-yellow-800',
    'clicked': 'bg-blue-100 text-blue-800',
    'deleted': 'bg-red-100 text-red-800',
    'default': 'bg-gray-100 text-gray-800',
  };
  const key = eventType as EventType;
  return classes[key] || classes.default;
};

const getEventTypeLabel = (eventType: string) => {
  const labels: Record<EventType, string> = {
    'created': 'Créé',
    'updated': 'Modifié',
    'clicked': 'Cliqué',
    'deleted': 'Supprimé',
    'default': eventType,
  };
  const key = eventType as EventType;
  return labels[key] || labels.default;
};

// SEO
const linkDetailsTitle = ref('Détails du lien');
watch(() => linksStore.currentLink, (newLink) => {
  if (newLink) {
    linkDetailsTitle.value = `Détails de ${newLink.shortCode}`;
  }
}, { immediate: true });

useSeoMeta({
  title: linkDetailsTitle,
  description: 'Détails et historique d\'un lien raccourci.',
  robots: 'noindex, nofollow',
});
</script>
