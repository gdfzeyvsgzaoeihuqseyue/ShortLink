<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600">Gérez et analysez vos liens raccourcis</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <IconLink class="w-6 h-6 text-primary-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total des liens</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalLinks }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <IconClick class="w-6 h-6 text-success-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total des clics</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalClicks }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <IconQrcode class="w-6 h-6 text-warning-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">QR Codes</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalQRCodes }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <IconTrendingUp class="w-6 h-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Clics ce mois</p>
              <p class="text-2xl font-bold text-gray-900">{{ monthlyClicks }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Liens récents et QR Codes récents -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Liens récents -->
        <div class="card p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">Liens récents</h2>
            <div class="flex gap-2">
              <button @click="openCreateLinkModal" class="flex items-center btn-primary text-sm px-3 py-2">
                <IconPlus class="w-4 h-4 mr-1" />
                Nouveau
              </button>
              <NuxtLink to="/db/links" class="btn-secondary text-sm px-3 py-2">
                <IconClearAll class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>

          <div v-if="linksStore.loading" class="text-center py-8">
            <IconLoader class="animate-spin w-6 h-6 text-primary-600 mx-auto" />
          </div>
          <div v-else-if="recentLinks.length === 0" class="text-center py-8">
            <IconLink class="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500 mb-4">Aucun lien créé</p>
            <button @click="openCreateLinkModal" class="btn-primary text-sm">
              Créer mon premier lien
            </button>
          </div>
          <div v-else class="space-y-3">
            <div v-for="link in recentLinks" :key="link.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex-1 min-w-0">
                <NuxtLink :to="`/db/links/${link.id}`"
                  class="text-sm font-medium text-gray-900 hover:underline truncate block" :title="link.longUrl">
                  {{ truncateWord(link.longUrl, 40) }}
                </NuxtLink>
                <div class="flex items-center space-x-4 mt-1">
                  <span class="text-xs text-primary-600">{{ link.shortCode }}</span>
                  <span class="text-xs text-gray-500">{{ link.clicks || 0 }} clics</span>
                  <span class="text-xs text-gray-500">{{ formatDate(link.createdAt) }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button @click="copyLink(link.shortLink)" class="text-gray-400 hover:text-primary-600 p-1">
                  <IconCopy class="w-4 h-4" />
                </button>
                <NuxtLink :to="`/db/links/${link.id}`" class="text-gray-400 hover:text-primary-600 p-1">
                  <IconExternalLink class="w-4 h-4" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- QR Codes récents -->
        <div class="card p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">QR Codes récents</h2>
            <div class="flex gap-2">
              <NuxtLink to="/db/qrcode/create" class="flex items-center btn-primary text-sm px-3 py-2">
                <IconPlus class="w-4 h-4 mr-1" />
                Nouveau
              </NuxtLink>
              <button @click="fetchQRCodes" class="btn-secondary text-sm px-3 py-2">
                <IconRefresh class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div v-if="qrCodesLoading" class="text-center py-8">
            <IconLoader class="animate-spin w-6 h-6 text-primary-600 mx-auto" />
          </div>
          <div v-else-if="recentQRCodes.length === 0" class="text-center py-8">
            <IconQrcode class="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500 mb-4">Aucun QR Code créé</p>
            <NuxtLink to="/db/qrcode/create" class="btn-primary text-sm">
              Créer un QR Code
            </NuxtLink>
          </div>
          <div v-else class="space-y-3">
            <div v-for="qrCode in recentQRCodes" :key="qrCode.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex items-center space-x-3 min-w-0">
                <div class="w-10 h-10 bg-white rounded-lg p-1 border flex-shrink-0">
                  <img :src="qrCode.qrCodeBase64" alt="QR Code" class="w-full h-full object-contain" />
                </div>
                <div class="flex-1 min-w-0 overflow-hidden">
                  <p class="text-sm font-medium text-gray-900 truncate" :title="qrCode.title">
                    {{ truncateWord(qrCode.title, 40) }}
                  </p>
                  <div class="flex items-center space-x-4 mt-1">
                    <span class="text-xs text-gray-500">{{ qrCode.qrCodeType }}</span>
                    <span class="text-xs text-gray-500">{{ formatDate(qrCode.createdAt) }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2 flex-shrink-0">
                <button @click="downloadQRCode(qrCode)" class="text-gray-400 hover:text-primary-600 p-1">
                  <IconDownload class="w-4 h-4" />
                </button>
                <NuxtLink :to="`/db/qrcode/${qrCode.id}`" class="text-gray-400 hover:text-primary-600 p-1">
                  <IconExternalLink class="w-4 h-4" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="card p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Actions rapides</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button @click="openCreateLinkModal"
            class="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div class="text-center">
              <IconPlus class="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p class="text-sm font-medium text-gray-700">Créer un lien</p>
            </div>
          </button>

          <NuxtLink to="/db/qrcode/create"
            class="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div class="text-center">
              <IconQrcode class="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p class="text-sm font-medium text-gray-700">Générer QR Code</p>
            </div>
          </NuxtLink>

          <NuxtLink to="/db/analytics"
            class="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div class="text-center">
              <IconChartBar class="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p class="text-sm font-medium text-gray-700">Voir Analytics</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <EditLinkModal :visible="showEditModal" :link="linkToEdit" :loading="linksStore.loading" :error="linksStore.error"
        @submit="updateLinkFromModal" @cancel="cancelEdit" />

      <DeleteLinkModal :visible="showDeleteModal" :link="linkToDelete" :loading="linksStore.loading" @confirm="deleteLink"
        @cancel="cancelDelete" />
    </div>

    <AppNotification :isVisible="showNotification" :message="notificationMessage" :type="notificationType"
      @close="closeNotification" />

    <CreateLinkModal :visible="showCreateLinkModal" @close="closeCreateLinkModal"
      @link-created="handleLinkCreatedAndRefresh" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useLinksStore } from '~/stores/links';
import type { ShortLink } from '~/types';
import { IconChartBar, IconClick, IconCopy, IconDownload, IconExternalLink, IconLink, IconLoader, IconPlus, IconQrcode, IconRefresh, IconTrendingUp, IconClearAll } from '@tabler/icons-vue'
import { CreateLinkModal, DeleteLinkModal, EditLinkModal } from '@/components/link'

// Interface pour les QR Codes
interface QRCode {
  id: string;
  title: string;
  qrCodeBase64: string;
  qrCodeType: string;
  createdAt: string;
}

interface QRCodeResponse {
  success: boolean;
  message: string;
  data: QRCode[];
}

definePageMeta({
  layout: 'dashboard'
});

const linksStore = useLinksStore();

// État pour les QR Codes
const recentQRCodes = ref<QRCode[]>([]);
const qrCodesLoading = ref(false);
const qrCodesError = ref('');

// Modales
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const linkToEdit = ref<ShortLink | null>(null);
const linkToDelete = ref<ShortLink | null>(null);
const showCreateLinkModal = ref(false);

// Notifications
const notificationMessage = ref('');
const notificationType = ref<'success' | 'error' | 'info'>('success');
const showNotification = ref(false);
let notificationTimeout: NodeJS.Timeout | null = null;

// Fonctions de notification
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

// Surveillance des erreurs
watch(() => linksStore.error, (newError) => {
  if (newError) {
    showFloatingNotification(newError, 'error');
  }
});

// Récupération des QR Codes
const fetchQRCodes = async () => {
  qrCodesLoading.value = true;
  qrCodesError.value = '';

  try {
    const config = useRuntimeConfig();
    const response = await $fetch<QRCodeResponse>(`${config.public.pgsBaseAPI}/shortlinks/qrcodes?limit=10`);
    recentQRCodes.value = response.data || [];
  } catch (err: any) {
    console.error('Erreur lors de la récupération des QR codes:', err);
    qrCodesError.value = 'Erreur lors du chargement des QR codes';
  } finally {
    qrCodesLoading.value = false;
  }
};

// Montage du composant
onMounted(async () => {
  await linksStore.fetchLinks();
  await fetchQRCodes();
});

// Computed properties pour les statistiques
const totalLinks = computed(() => linksStore.pagination.totalLinks);
const totalClicks = computed(() => linksStore.stats.totalClicks);
const totalQRCodes = computed(() => recentQRCodes.value.length);
const monthlyClicks = computed(() => {
  // Calculer les clics du mois en cours
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return linksStore.links.reduce((total, link) => {
    const linkDate = new Date(typeof link.createdAt === 'number' ? link.createdAt : link.createdAt);
    if (linkDate >= startOfMonth) {
      return total + (link.clicks || 0);
    }
    return total;
  }, 0);
});

// Liens récents 
const recentLinks = computed(() => {
  return [...linksStore.links]
    .sort((a, b) => {
      const aTime = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt).getTime();
      const bTime = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt).getTime();
      return bTime - aTime;
    })
    .slice(0, 10);
});

// Actions sur les modales
const openCreateLinkModal = () => {
  showCreateLinkModal.value = true;
};

const closeCreateLinkModal = () => {
  showCreateLinkModal.value = false;
  linksStore.clearError();
};

const handleLinkCreatedAndRefresh = async () => {
  await linksStore.fetchLinks();
};

// Fonctions utilitaires
const formatDate = (dateString: string | number) => {
  const date = typeof dateString === 'number' ? new Date(dateString) : new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

const truncateWord = (url: string, maxLength: number) => {
  return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
};

// Actions sur les liens
const copyLink = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    showFloatingNotification('Lien copié !', 'success');
  } catch (err) {
    console.error('Erreur lors de la copie:', err);
    showFloatingNotification('Impossible de copier le lien.', 'error');
  }
};

// Actions sur les QR Codes
const downloadQRCode = (qrCode: QRCode) => {
  const link = document.createElement('a');
  link.href = qrCode.qrCodeBase64;
  link.download = `${qrCode.title || 'qrcode'}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const updateLinkFromModal = async (newUrl: string) => {
  if (!linkToEdit.value) return;
  linksStore.clearError();

  const ok = await linksStore.updateLink(linkToEdit.value.id, newUrl);
  if (ok) {
    showEditModal.value = false;
    linkToEdit.value = null;
    showFloatingNotification('Lien mis à jour avec succès !', 'success');
  } else {
    showFloatingNotification(linksStore.error || 'Erreur lors de la mise à jour.', 'error');
  }
};

const cancelEdit = () => {
  showEditModal.value = false;
  linkToEdit.value = null;
  linksStore.clearError();
};

const deleteLink = async () => {
  if (!linkToDelete.value) return;

  linksStore.clearError();

  const deletedSuccessfully = await linksStore.deleteLink(linkToDelete.value.id);

  if (deletedSuccessfully) {
    showDeleteModal.value = false;
    linkToDelete.value = null;
    showFloatingNotification('Lien supprimé avec succès !', 'success');
  } else {
    showFloatingNotification(linksStore.error || 'Erreur lors de la suppression.', 'error');
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  linkToDelete.value = null;
  linksStore.clearError();
};

// SEO
usePageSeo('dashboard')
</script>
