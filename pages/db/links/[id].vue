<!-- <template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <NuxtLink to="/db/links" class="text-primary-600 hover:text-primary-700 flex items-center">
            <IconChevronLeft class="w-5 h-5 mr-2" />
            Retour aux liens
          </NuxtLink>
        </div>

        <div v-if="linksStore.currentLink">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Détails du lien</h1>
          <p class="text-gray-600">Informations et historique pour {{ linksStore.currentLink.shortCode }}</p>
        </div>
      </div>

      <div v-if="linksStore.loading" class="flex justify-center py-12">
        <IconLoader class="animate-spin w-8 h-8 text-primary-600" />
      </div>

      <div v-else-if="linksStore.error" class="card p-8 text-center">
        <IconAlertTriangle class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
        <p class="text-gray-600 mb-4">{{ linksStore.error }}</p>
        <NuxtLink to="/db/links" class="btn-primary">Retour au dashboard</NuxtLink>
      </div>

      <div v-else-if="linksStore.currentLink" class="space-y-8">
        <LinkInfoCard
          :link="linksStore.currentLink"
          :status-loading="statusLoading"
          :copied="copied"
          :total-logs="logsStore.totalLogs"
          @toggle-status="toggleLinkStatus"
          @show-analytics="showAnalyticsModal = true"
          @copy-link="copyToClipboard"
          @generate-qr-code="generateQRCode"
          @edit-link="editLink"
          @confirm-delete="confirmDelete"
        />
        <LinkMetadataCard
          :link-metadata="linksStore.currentLink?.metadata"
          :loading="linksStore.metadataLoading"
          :error="linksStore.metadataError"
          @refresh="refreshMetadata"
        />
        <LinkHistoryCard
          :logs="logsStore.logs"
          :loading="logsStore.loading"
          :error="logsStore.error"
          @refresh-logs="refreshLogs"
        />
      </div>
    </div>
  </div>

  <div v-if="showAnalyticsModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="relative">
      <LinkAnalyticsDetails :analytics="analyticsStore.currentLinkAnalytics" :loading="analyticsStore.loading"
        :error="analyticsStore.error" :link-id="linkId" @close="showAnalyticsModal = false" />
    </div>
  </div>

  <EditLinkModal :visible="showEditModal" :link="linksStore.currentLink" @submit="handleUpdateLink"
    @cancel="cancelEdit" />
  <DeleteLinkModal :visible="showDeleteModal" :link="linksStore.currentLink" @confirm="deleteLink"
    @cancel="cancelDelete" />
  <AppNotification :isVisible="showNotification" :message="notificationMessage" :type="notificationType"
    @close="closeNotification" />
</template>

<script setup lang="ts">
import { IconAlertTriangle, IconChevronLeft, IconLoader } from '@tabler/icons-vue';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLinksStore } from '~/stores/links';
import { useLogsStore } from '~/stores/logs';
import { useAnalyticsStore } from '~/stores/analytics';
import {
  DeleteLinkModal,
  EditLinkModal,
  LinkAnalyticsDetails,
  LinkMetadataCard,
  LinkInfoCard,
  LinkHistoryCard 
} from '@/components/link';

definePageMeta({
  layout: 'dashboard'
});

const route = useRoute();
const router = useRouter();
const linksStore = useLinksStore();
const logsStore = useLogsStore();
const analyticsStore = useAnalyticsStore();

const linkId = route.params.id as string;
const copied = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showAnalyticsModal = ref(false);
const statusLoading = ref(false);

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
  }, 3000);
};

const closeNotification = () => {
  showNotification.value = false;
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
};

onMounted(async () => {
  if (linkId) {
    await Promise.all([
      linksStore.fetchLinkById(linkId),
      logsStore.fetchLinkLogs(linkId),
    ]);
    if (linksStore.currentLink && !linksStore.currentLink.metadata) {
      await linksStore.extractMetadata(linksStore.currentLink.longUrl);
    }
  }
});

watch(showAnalyticsModal, (newValue) => {
  if (newValue && linkId) {
    analyticsStore.fetchAnalyticsForLink(linkId);
  } else if (!newValue) {
    analyticsStore.clearError();
  }
});

onUnmounted(() => {
  linksStore.clearCurrentLink();
  logsStore.clearLogs();
  analyticsStore.clearError();
  linksStore.clearMetadataError();
});

const refreshLogs = async () => {
  if (linkId) {
    await logsStore.fetchLinkLogs(linkId);
  }
};

const refreshMetadata = async () => {
  if (linksStore.currentLink) {
    await linksStore.extractMetadata(linksStore.currentLink.longUrl);
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

const generateQRCode = () => {
  navigateTo(`/db/qrcode/create?linkId=${linkId}`);
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
    await router.push('/db/links');
  } else {
    showFloatingNotification(linksStore.error || 'Erreur lors de la suppression.', 'error');
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  linksStore.clearError();
  linksStore.clearMetadataError();
};

const toggleLinkStatus = async (event: Event) => {
  if (!linksStore.currentLink) return;
  const target = event.target as HTMLInputElement;
  const shouldDisable = !target.checked;
  statusLoading.value = true;
  try {
    const success = await linksStore.toggleLinkStatus(linksStore.currentLink.id, shouldDisable);
    if (success) {
      const action = shouldDisable ? 'désactivé' : 'activé';
      showFloatingNotification(`Lien ${action} avec succès !`, 'success');
      await logsStore.fetchLinkLogs(linkId);
    } else {
      target.checked = !shouldDisable;
      showFloatingNotification(linksStore.error || 'Erreur lors du changement de statut.', 'error');
    }
  } catch (error) {
    target.checked = !shouldDisable;
    showFloatingNotification('Une erreur inattendue est survenue.', 'error');
  } finally {
    statusLoading.value = false;
  }
};

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
</script> -->




























<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <NuxtLink to="/db/links" class="text-primary-600 hover:text-primary-700 flex items-center">
            <IconChevronLeft class="w-5 h-5 mr-2" />
            Retour aux liens
          </NuxtLink>
        </div>

        <div v-if="linksStore.currentLink">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Détails du lien</h1>
          <p class="text-gray-600">Informations et historique pour {{ linksStore.currentLink.shortCode }}</p>
        </div>
      </div>

      <div v-if="linksStore.loading" class="flex justify-center py-12">
        <IconLoader class="animate-spin w-8 h-8 text-primary-600" />
      </div>

      <div v-else-if="linksStore.error" class="card p-8 text-center">
        <IconAlertTriangle class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
        <p class="text-gray-600 mb-4">{{ linksStore.error }}</p>
        <NuxtLink to="/db/links" class="btn-primary">Retour au dashboard</NuxtLink>
      </div>

      <div v-else-if="linksStore.currentLink" class="space-y-8">
        <LinkInfoCard
          :link="linksStore.currentLink"
          :status-loading="statusLoading"
          :copied="copied"
          :total-logs="logsStore.totalLogs"
          @toggle-status="toggleLinkStatus"
          @show-analytics="showAnalyticsModal = true"
          @copy-link="copyToClipboard"
          @generate-qr-code="generateQRCode"
          @edit-link="editLink"
          @show-delete-info="showDeleteInfo"
        />
        <LinkMetadataCard
          :link-metadata="linksStore.currentLink?.metadata"
          :loading="linksStore.metadataLoading"
          :error="linksStore.metadataError"
          @refresh="refreshMetadata"
        />
        <LinkHistoryCard
          :logs="logsStore.logs"
          :loading="logsStore.loading"
          :error="logsStore.error"
          @refresh-logs="refreshLogs"
        />
      </div>
    </div>
  </div>

  <div v-if="showAnalyticsModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="relative">
      <LinkAnalyticsDetails :analytics="analyticsStore.currentLinkAnalytics" :loading="analyticsStore.loading"
        :error="analyticsStore.error" :link-id="linkId" @close="showAnalyticsModal = false" />
    </div>
  </div>

  <EditLinkModal :visible="showEditModal" :link="linksStore.currentLink" @submit="handleUpdateLink"
    @cancel="cancelEdit" />
  <DeleteLinkModal :visible="showDeleteModal" :link="linksStore.currentLink" @confirm="deleteLink"
    @cancel="cancelDelete" />
  <AppNotification :isVisible="showNotification" :message="notificationMessage" :type="notificationType"
    @close="closeNotification" />
</template>

<script setup lang="ts">
import { IconAlertTriangle, IconChevronLeft, IconLoader } from '@tabler/icons-vue';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLinksStore } from '~/stores/links';
import { useLogsStore } from '~/stores/logs';
import { useAnalyticsStore } from '~/stores/analytics';
import {
  DeleteLinkModal,
  EditLinkModal,
  LinkAnalyticsDetails,
  LinkMetadataCard,
  LinkInfoCard,
  LinkHistoryCard
} from '@/components/link';

definePageMeta({
  layout: 'dashboard'
});

const route = useRoute();
const router = useRouter();
const linksStore = useLinksStore();
const logsStore = useLogsStore();
const analyticsStore = useAnalyticsStore();

const linkId = route.params.id as string;
const copied = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false); // Laissé pour la logique existante
const showAnalyticsModal = ref(false);
const statusLoading = ref(false);

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
  }, 3000);
};

const closeNotification = () => {
  showNotification.value = false;
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
};

onMounted(async () => {
  if (linkId) {
    await Promise.all([
      linksStore.fetchLinkById(linkId),
      logsStore.fetchLinkLogs(linkId),
    ]);
    if (linksStore.currentLink && !linksStore.currentLink.metadata) {
      await linksStore.extractMetadata(linksStore.currentLink.longUrl);
    }
  }
});

watch(showAnalyticsModal, (newValue) => {
  if (newValue && linkId) {
    analyticsStore.fetchAnalyticsForLink(linkId);
  } else if (!newValue) {
    analyticsStore.clearError();
  }
});

onUnmounted(() => {
  linksStore.clearCurrentLink();
  logsStore.clearLogs();
  analyticsStore.clearError();
  linksStore.clearMetadataError();
});

const refreshLogs = async () => {
  if (linkId) {
    await logsStore.fetchLinkLogs(linkId);
  }
};

const refreshMetadata = async () => {
  if (linksStore.currentLink) {
    await linksStore.extractMetadata(linksStore.currentLink.longUrl);
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

const generateQRCode = () => {
  navigateTo(`/db/qrcode/create?linkId=${linkId}`);
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

const showDeleteInfo = () => {
  navigateTo('/db/deleteInfo');
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
    await router.push('/db/links');
  } else {
    showFloatingNotification(linksStore.error || 'Erreur lors de la suppression.', 'error');
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  linksStore.clearError();
  linksStore.clearMetadataError();
};

const toggleLinkStatus = async (event: Event) => {
  if (!linksStore.currentLink) return;
  const target = event.target as HTMLInputElement;
  const shouldDisable = !target.checked;
  statusLoading.value = true;
  try {
    const success = await linksStore.toggleLinkStatus(linksStore.currentLink.id, shouldDisable);
    if (success) {
      const action = shouldDisable ? 'désactivé' : 'activé';
      showFloatingNotification(`Lien ${action} avec succès !`, 'success');
      await logsStore.fetchLinkLogs(linkId);
    } else {
      target.checked = !shouldDisable;
      showFloatingNotification(linksStore.error || 'Erreur lors du changement de statut.', 'error');
    }
  } catch (error) {
    target.checked = !shouldDisable;
    showFloatingNotification('Une erreur inattendue est survenue.', 'error');
  } finally {
    statusLoading.value = false;
  }
};

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