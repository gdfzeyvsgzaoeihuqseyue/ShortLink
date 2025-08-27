<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestion des robots.txt</h1>
        <p class="text-gray-600">Générez et gérez les fichiers robots.txt pour vos sites web</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <button @click="refreshRobotsTxtConfigs" :disabled="robotsTxtStore.loading"
          class="flex items-center justify-center btn-secondary disabled:opacity-50">
          <IconRefresh class="w-4 h-4 mr-2" />
          Actualiser
        </button>
        <button @click="openGenerateModal" class="flex items-center justify-center btn-primary">
          <IconPlus class="w-4 h-4 mr-2" />
          Générer un robots.txt
        </button>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="relative">
            <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input v-model="searchQuery" type="text" placeholder="Rechercher une config..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64" />
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div v-if="robotsTxtStore.loading" class="flex justify-center py-12">
        <IconLoader class="animate-spin w-8 h-8 text-primary-600" />
      </div>

      <div v-else-if="robotsTxtStore.error" class="text-center py-12">
        <IconAlertTriangle class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
        <p class="text-gray-600 mb-4">{{ robotsTxtStore.error }}</p>
        <button @click="refreshRobotsTxtConfigs" class="btn-primary">Réessayer</button>
      </div>

      <div v-else-if="filteredConfigs.length === 0" class="text-center py-12">
        <IconFileText class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ searchQuery ? 'Aucun résultat trouvé' : 'Aucune configuration robots.txt trouvée' }}
        </h3>
        <p class="text-gray-500 mb-4">
          {{ searchQuery ? 'Essayez de modifier vos critères de recherche'
            : 'Commencez par générer votre première configuration robots.txt' }}
        </p>
        <button @click="openGenerateModal" class="btn-primary">
          Générer un robots.txt
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <!-- Ici, 'config' est de type Readonly<RobotsTxtConfig> -->
        <RobotsTxtItemCard v-for="config in filteredConfigs" :key="config.id" :config="config"
          @delete="confirmDelete" />
      </div>

      <div v-if="robotsTxtStore.pagination.totalPages > 1" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            Affichage de {{ robotsTxtStore.pagination.configsOnPage }} sur {{ robotsTxtStore.pagination.totalConfigs }}
            configurations
          </div>
          <div class="flex items-center space-x-2">
            <button @click="changePage(robotsTxtStore.pagination.currentPage - 1)"
              :disabled="robotsTxtStore.pagination.currentPage <= 1 || robotsTxtStore.loading"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
              Précédent
            </button>
            <span class="px-3 py-2 text-sm text-gray-700">
              Page {{ robotsTxtStore.pagination.currentPage }} sur {{ robotsTxtStore.pagination.totalPages }}
            </span>
            <button @click="changePage(robotsTxtStore.pagination.currentPage + 1)"
              :disabled="robotsTxtStore.pagination.currentPage >= robotsTxtStore.pagination.totalPages || robotsTxtStore.loading"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>

    <GenerateRobotsTxtModal :visible="showGenerateModal" :loading="robotsTxtStore.loading" :error="robotsTxtStore.error"
      @submit="handleGenerateRobotsTxt" @cancel="closeGenerateModal" />

    <DeleteRobotsTxtModal :visible="showDeleteModal" :config="configToDelete" :loading="robotsTxtStore.loading"
      @confirm="deleteRobotsTxt" @cancel="closeDeleteModal" />

    <AppNotification :isVisible="showNotification" :message="notificationMessage" :type="notificationType"
      @close="closeNotification" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRobotsTxtStore } from '~/stores/robotstxt';
import { RobotsTxtItemCard, GenerateRobotsTxtModal, DeleteRobotsTxtModal } from '@/components/robotstxt';
import { IconRefresh, IconPlus, IconSearch, IconLoader, IconAlertTriangle, IconFileText } from '@tabler/icons-vue';
import type { GenerateRobotsTxtPayload, GenerateRobotsTxtResponse, RobotsTxtConfig } from '@/types';

definePageMeta({
  layout: 'dashboard'
});

const robotsTxtStore = useRobotsTxtStore();

const searchQuery = ref('');
const showGenerateModal = ref(false);
const showDeleteModal = ref(false);
// Typez configToDelete comme Readonly<RobotsTxtConfig> | null
const configToDelete = ref<Readonly<RobotsTxtConfig> | null>(null);

// Notification
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

// Watch for store errors
watch(() => robotsTxtStore.error, (newError) => {
  if (newError) {
    showFloatingNotification(newError, 'error');
  }
});

onMounted(() => {
  robotsTxtStore.fetchRobotsTxtConfigs();
});

// Typage explicite de filteredConfigs
const filteredConfigs = computed<ReadonlyArray<Readonly<RobotsTxtConfig>>>(() => {
  // robotsTxtStore.robotsTxtConfigs est déjà de type Readonly<RobotsTxtConfig[]>
  // donc aucune conversion explicite n'est nécessaire ici.
  if (!searchQuery.value) {
    return robotsTxtStore.robotsTxtConfigs;
  }
  const query = searchQuery.value.toLowerCase();
  return robotsTxtStore.robotsTxtConfigs.filter(config =>
    config.title.toLowerCase().includes(query) ||
    (config.sitemapUrl && config.sitemapUrl.toLowerCase().includes(query)) ||
    Object.keys(config.userAgents).some(ua => ua.toLowerCase().includes(query))
  );
});

const refreshRobotsTxtConfigs = async () => {
  await robotsTxtStore.fetchRobotsTxtConfigs(robotsTxtStore.pagination.currentPage, robotsTxtStore.pagination.configsOnPage);
  if (!robotsTxtStore.error) {
    showFloatingNotification('Liste des configurations robots.txt actualisée !', 'success');
  }
};

const changePage = async (page: number) => {
  await robotsTxtStore.fetchRobotsTxtConfigs(page, robotsTxtStore.pagination.configsOnPage);
};

const openGenerateModal = () => {
  showGenerateModal.value = true;
  robotsTxtStore.clearError();
};

const closeGenerateModal = () => {
  showGenerateModal.value = false;
  robotsTxtStore.clearError();
};

const handleGenerateRobotsTxt = async (payload: GenerateRobotsTxtPayload) => {
  const result: GenerateRobotsTxtResponse | null = await robotsTxtStore.generateRobotsTxt(payload);
  if (result) {
    showFloatingNotification(`Configuration robots.txt "${result.data.title}" générée avec succès !`, 'success');
    closeGenerateModal();
  } else {
  }
};

const confirmDelete = (id: string) => {
  // Trouvez la configuration dans le tableau readonly du store
  const config = robotsTxtStore.robotsTxtConfigs.find(c => c.id === id);
  if (config) {
    configToDelete.value = config; // Assigner l'objet readonly
    showDeleteModal.value = true;
    robotsTxtStore.clearError();
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  configToDelete.value = null;
  robotsTxtStore.clearError();
};

const deleteRobotsTxt = async () => {
  if (!configToDelete.value) return;
  const success = await robotsTxtStore.deleteRobotsTxt(configToDelete.value.id);
  if (success) {
    showFloatingNotification('Configuration robots.txt supprimée avec succès !', 'success');
    closeDeleteModal();
  } else {
  }
};

useSeoMeta({
  title: 'Gestion des robots.txt',
  description: 'Générez et gérez les fichiers robots.txt pour vos sites web.',
  robots: 'noindex, nofollow'
});
</script>
