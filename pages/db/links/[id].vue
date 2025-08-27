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

        <!-- Nouvelle section pour les outils SEO -->
        <div class="card p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Outils SEO</h2>
          <div class="flex flex-wrap gap-4">
            <button @click="openGenerateSitemapModal" class="btn-primary flex items-center">
              <IconSitemap class="w-5 h-5 mr-2" />
              Générer un Sitemap pour ce lien
            </button>
            <button @click="openGenerateRobotsTxtModal" class="btn-primary flex items-center">
              <IconFileText class="w-5 h-5 mr-2" />
              Générer un robots.txt pour ce lien
            </button>
          </div>
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
    <!-- Ligne modifiée : suppression de .value car linkToDelete est déjà un ref de ShortLink | null -->
    <DeleteLinkModal :visible="showDeleteModal" :link="linkToDelete" @confirm="deleteLink"
      @cancel="cancelDelete" />

    <GenerateSitemapModal :visible="showGenerateSitemapModal" :loading="sitemapStore.loading" :error="sitemapStore.error"
      :initial-url="linksStore.currentLink?.longUrl"
      @submit="handleGenerateSitemap" @cancel="closeGenerateSitemapModal" />

    <GenerateRobotsTxtModal :visible="showGenerateRobotsTxtModal" :loading="robotsTxtStore.loading" :error="robotsTxtStore.error"
      :initial-config="initialRobotsTxtConfig"
      @submit="handleGenerateRobotsTxt" @cancel="closeGenerateRobotsTxtModal" />

    <AppNotification :isVisible="showNotification" :message="notificationMessage" :type="notificationType"
      @close="closeNotification" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLinksStore } from '~/stores/links';
import { useLogsStore } from '~/stores/logs';
import { useAnalyticsStore } from '~/stores/analytics';
import { useSitemapStore } from '~/stores/sitemap';
import { useRobotsTxtStore } from '~/stores/robotstxt'; // Import du store robots.txt
import {
  DeleteLinkModal,
  EditLinkModal,
  LinkAnalyticsDetails,
  LinkMetadataCard,
  LinkInfoCard,
  LinkHistoryCard
} from '@/components/link';
import { GenerateSitemapModal } from '@/components/sitemap';
import { GenerateRobotsTxtModal } from '@/components/robotstxt'; // Import de la modale robots.txt
import { IconAlertTriangle, IconChevronLeft, IconLoader, IconSitemap, IconFileText } from '@tabler/icons-vue'; // Ajout de IconFileText
import type { GenerateSitemapResponse, SitemapGenerationOptions, GenerateRobotsTxtPayload, GenerateRobotsTxtResponse, RobotsTxtConfig } from '@/types';
import type { ShortLink } from '~/types'; // Import de ShortLink pour le typage de linkToDelete

definePageMeta({
  layout: 'dashboard'
});

const route = useRoute();
const router = useRouter();
const linksStore = useLinksStore();
const logsStore = useLogsStore();
const analyticsStore = useAnalyticsStore();
const sitemapStore = useSitemapStore();
const robotsTxtStore = useRobotsTxtStore(); // Utilisation du store robots.txt

const linkId = route.params.id as string;
const copied = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showAnalyticsModal = ref(false);
const statusLoading = ref(false);
const showGenerateSitemapModal = ref(false);
const showGenerateRobotsTxtModal = ref(false); // État pour la modale robots.txt

// Déclaration de linkToDelete avec le type ShortLink | null
const linkToDelete = ref<ShortLink | null>(null);

const notificationMessage = ref('');
const notificationType = ref<'success' | 'error' | 'info'>('success');
const showNotification = ref(false);
let notificationTimeout: NodeJS.Timeout | null = null;

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

watch(() => linksStore.error, (newError) => {
  if (newError) {
    showFloatingNotification(newError, 'error');
  }
});

watch(() => sitemapStore.error, (newError) => {
  if (newError) {
    showFloatingNotification(newError, 'error');
  }
});

// Watch for robots.txt store errors
watch(() => robotsTxtStore.error, (newError) => {
  if (newError) {
    showFloatingNotification(newError, 'error');
  }
});

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
  sitemapStore.clearError();
  robotsTxtStore.clearError(); // Nettoyer l'erreur du store robots.txt
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

const deleteLink = async () => {
  if (!linkToDelete.value) return; // Utiliser linkToDelete.value ici

  linksStore.clearError();

  const deletedSuccessfully = await linksStore.deleteLink(linkToDelete.value.id); // Utiliser linkToDelete.value.id

  if (deletedSuccessfully) {
    showDeleteModal.value = false;
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

// Sitemap generation functions
const openGenerateSitemapModal = () => {
  showGenerateSitemapModal.value = true;
  sitemapStore.clearError();
};

const closeGenerateSitemapModal = () => {
  showGenerateSitemapModal.value = false;
  sitemapStore.clearError();
};

const handleGenerateSitemap = async (options: SitemapGenerationOptions) => {
  const result: GenerateSitemapResponse | null = await sitemapStore.generateSitemap(options);
  if (result) {
    showFloatingNotification(`Sitemap généré avec succès pour ${result.urlsCount} URLs !`, 'success');
    closeGenerateSitemapModal();
  } else {
    // Error message is already handled by the watcher
  }
};

// Robots.txt generation functions
const initialRobotsTxtConfig = ref<RobotsTxtConfig | null>(null);

const openGenerateRobotsTxtModal = () => {
  if (linksStore.currentLink) {
    // Pré-remplir avec l'URL du lien court comme sitemapUrl potentiel
    initialRobotsTxtConfig.value = {
      id: '', // Not relevant for initial config
      title: `robots.txt pour ${linksStore.currentLink.shortCode}`,
      userAgents: { '*': { allow: ['/'], disallow: [] } },
      sitemapUrl: linksStore.currentLink.shortLink, // Utiliser le lien court comme sitemapUrl par défaut
      customRules: '',
      lastGenerated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } else {
    initialRobotsTxtConfig.value = null;
  }
  showGenerateRobotsTxtModal.value = true;
  robotsTxtStore.clearError();
};

const closeGenerateRobotsTxtModal = () => {
  showGenerateRobotsTxtModal.value = false;
  robotsTxtStore.clearError();
  initialRobotsTxtConfig.value = null;
};

const handleGenerateRobotsTxt = async (payload: GenerateRobotsTxtPayload) => {
  const result: GenerateRobotsTxtResponse | null = await robotsTxtStore.generateRobotsTxt(payload);
  if (result) {
    showFloatingNotification(`Configuration robots.txt "${result.data.title}" générée avec succès !`, 'success');
    // Optionnel: télécharger le fichier directement après génération
    const blob = new Blob([result.robotsTxtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `robots-${result.data.title.replace(/\s/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    closeGenerateRobotsTxtModal();
  } else {
    // Error message is already handled by the watcher
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
