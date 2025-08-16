<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600">Gérez et analysez vos liens raccourcis</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total des liens</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalLinks }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total des clics</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalClicks }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Clics aujourd'hui</p>
              <p class="text-2xl font-bold text-gray-900">{{ todayClicks }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Liens actifs</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeLinks }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Links Table -->
      <div class="card p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-900">Mes liens</h2>
          <div class="space-x-6">
            <button @click="openCreateLinkModal" class="btn-primary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                </path>
              </svg>
              Nouveau lien
            </button>
            <NuxtLink to="/dashboard/links" class="btn-primary bg-black text-white">
              Plus
            </NuxtLink>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Lien original</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Lien court</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Clics</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="linksStore.loading && linksStore.links.length === 0">
                <td colspan="5" class="text-center py-12">
                  <svg class="animate-spin w-8 h-8 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  <p class="text-gray-500">Chargement des liens...</p>
                </td>
              </tr>
              <tr v-else-if="linksStore.links.length === 0">
                <td colspan="5" class="text-center py-12">
                  <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun lien trouvé</h3>
                  <p class="text-gray-500 mb-4">Commencez par créer votre premier lien raccourci</p>
                  <button @click="openCreateLinkModal" class="btn-primary">
                    Créer mon premier lien
                  </button>
                </td>
              </tr>
              <tr v-for="link in linksStore.links" :key="link.id" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="py-4 px-4">
                  <div class="max-w-xs truncate" :title="link.longUrl">
                    {{ link.longUrl }}
                  </div>
                </td>
                <td class="py-4 px-4">
                  <a :href="link.shortLink" target="_blank" class="text-primary-600 hover:text-primary-700 font-medium">
                    {{ link.shortLink }}
                  </a>
                </td>
                <td class="py-4 px-4">
                  <span class="font-semibold">{{ link.clicks || 0 }}</span>
                </td>
                <td class="py-4 px-4 text-gray-600">
                  {{ formatDate(link.createdAt) }}
                </td>
                <td class="py-4 px-4">
                  <div class="flex space-x-2">
                    <button @click="copyLink(link.shortLink)" class="text-primary-600 hover:text-primary-700">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button @click="viewAnalytics(link)" class="text-secondary-600 hover:text-secondary-700">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </button>
                    <button @click="generateQRCode(link)" class="text-purple-600 hover:text-purple-700">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01"></path>
                      </svg>
                    </button>

                    <NuxtLink :to="`/dashboard/links/${link.id}`" class="text-gray-600 hover:text-gray-700">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </NuxtLink>
                    <button @click="editLink(link)" class="text-warning-600 hover:text-warning-700">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="confirmDelete(link)" class="text-red-600 hover:text-red-700">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="linksStore.pagination.totalPages > 1" class="mt-6 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Affichage de {{ linksStore.pagination.linksOnPage }} sur {{ linksStore.pagination.totalLinks }} liens
          </div>
          <div class="flex space-x-2">
            <button @click="linksStore.fetchLinks(linksStore.pagination.currentPage - 1)"
              :disabled="linksStore.pagination.currentPage <= 1 || linksStore.loading"
              class="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
              Précédent
            </button>
            <span class="px-3 py-1 text-sm text-gray-700">
              Page {{ linksStore.pagination.currentPage }} sur {{ linksStore.pagination.totalPages }}
            </span>
            <button @click="linksStore.fetchLinks(linksStore.pagination.currentPage + 1)"
              :disabled="linksStore.pagination.currentPage >= linksStore.pagination.totalPages || linksStore.loading"
              class="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
              Suivant
            </button>
          </div>
        </div>
      </div>

      <!-- Modals existants -->
      <EditLinkModal :visible="showEditModal" :link="linkToEdit" :loading="linksStore.loading" :error="linksStore.error"
        @submit="updateLinkFromModal" @cancel="cancelEdit" />

      <DeleteModal :visible="showDeleteModal" :link="linkToDelete" :loading="linksStore.loading" @confirm="deleteLink"
        @cancel="cancelDelete" />
    </div>
  </div>

  <!-- Notification flottante (gérée globalement) -->
  <AppNotification :isVisible="showNotification" :message="notificationMessage" :type="notificationType"
    @close="closeNotification" />

  <!-- Nouveau modal de création de lien -->
  <CreateLinkModal :visible="showCreateLinkModal" @close="closeCreateLinkModal"
    @link-created="handleLinkCreatedAndRefresh" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useLinksStore, type ShortLink } from '~/stores/links';

definePageMeta({
  layout: 'dashboard'
});

const linksStore = useLinksStore();
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const linkToEdit = ref<ShortLink | null>(null);
const linkToDelete = ref<ShortLink | null>(null);

// Propriétés pour la notification flottante
const notificationMessage = ref('');
const notificationType = ref<'success' | 'error' | 'info'>('success');
const showNotification = ref(false);
let notificationTimeout: NodeJS.Timeout | null = null;

// Propriété pour le modal de création de lien
const showCreateLinkModal = ref(false);

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

// Gérer l'affichage des erreurs du store
watch(() => linksStore.error, (newError) => {
  if (newError) {
    showFloatingNotification(newError, 'error');
  }
});

// Récupérer les données au montage du composant
onMounted(async () => {
  await linksStore.fetchLinks();
});

// Computed properties basées sur le store
const links = computed(() => linksStore.links);
const totalLinks = computed(() => linksStore.stats.totalLinks);
const totalClicks = computed(() => linksStore.stats.totalClicks);
const todayClicks = computed(() => {
  // Supposons que linksStore.stats.clicksToday existe et soit mis à jour
  return linksStore.stats.clicksToday || 0; // Ajout d'une valeur par défaut
});
const activeLinks = computed(() => {
  return linksStore.links.filter(link => (link.clicks || 0) > 0).length;
});

// Fonctions pour le modal de création de lien
const openCreateLinkModal = () => {
  showCreateLinkModal.value = true;
};

const closeCreateLinkModal = () => {
  showCreateLinkModal.value = false;
  // Optionnel: Vider les erreurs du store après la fermeture du modal si elles étaient liées à la création
  linksStore.clearError();
};

const handleLinkCreatedAndRefresh = async () => {
  // Ceci est appelé quand un lien est créé avec succès dans UrlShortener
  await linksStore.fetchLinks(); // Recharger les liens pour afficher le nouveau lien
  // showFloatingNotification est déjà gérée par UrlShortener en interne
};


// Actions
const refreshLinks = async () => {
  await linksStore.refreshLinks();
  if (!linksStore.error) {
    showFloatingNotification('Liste de liens actualisée !', 'success');
  }
};

const formatDate = (dateString: string | number) => {
  const date = typeof dateString === 'number' ? new Date(dateString) : new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

const copyLink = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    showFloatingNotification('Lien copié !', 'success');
  } catch (err) {
    console.error('Erreur lors de la copie:', err);
    showFloatingNotification('Impossible de copier le lien.', 'error');
  }
};

const viewAnalytics = (link: ShortLink) => {
  showFloatingNotification(`Analytics pour ${link.shortCode}: Clics ${link.clicks || 0}`, 'info');
  // Pour des analytics plus complexes, une modale dédiée serait préférable.
};

const generateQRCode = (link: ShortLink) => {
  // Rediriger vers la page de génération de QR code avec le lien pré-sélectionné
  navigateTo(`/dashboard/qrcode?linkId=${link.id}`);
};

const editLink = (link: ShortLink) => {
  linksStore.clearError();
  linkToEdit.value = link;
  showEditModal.value = true;
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

const confirmDelete = (link: ShortLink) => {
  linksStore.clearError();
  linkToDelete.value = link;
  showDeleteModal.value = true;
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

// Nuxt SEO
useSeoMeta({
  title: 'Dashboard',
  description: 'Gérez et analysez vos liens raccourcis',
  robots: 'index, follow',
});
</script>
