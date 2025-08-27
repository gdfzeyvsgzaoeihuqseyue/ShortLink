import { defineStore } from 'pinia';
import { ref, readonly } from 'vue';
import { useApiFetch } from '~/utils/api';
import type { ShortLinkSitemap, SitemapGenerationOptions, GenerateSitemapResponse, GetSitemapsResponse, GetSitemapResponse, UpdateSitemapResponse, DeleteSitemapResponse } from '@/types';

export const useSitemapStore = defineStore('sitemap', () => {
  // State
  const sitemaps = ref<ShortLinkSitemap[]>([]);
  const currentSitemap = ref<ShortLinkSitemap | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalSitemaps: 0,
    sitemapsOnPage: 0,
  });

  // Actions
  const generateSitemap = async (options: SitemapGenerationOptions): Promise<GenerateSitemapResponse | null> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await useApiFetch<GenerateSitemapResponse>('/shortlinks/sitemap', {
        method: 'POST',
        body: options,
      });
      // Après génération, rafraîchir la liste des sitemaps
      await fetchSitemaps(pagination.value.currentPage, pagination.value.sitemapsOnPage);
      return response;
    } catch (err: any) {
      console.error('Erreur lors de la génération du sitemap:', err);
      error.value = err.data?.message || 'Une erreur est survenue lors de la génération du sitemap.';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const fetchSitemaps = async (page: number = 1, limit: number = 10): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await useApiFetch<GetSitemapsResponse>('/shortlinks/sitemap', {
        params: { page, limit },
      });
      sitemaps.value = response.data;
      pagination.value = {
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalSitemaps: response.nb,
        sitemapsOnPage: response.nbOnPage,
      };
    } catch (err: any) {
      console.error('Erreur lors de la récupération des sitemaps:', err);
      error.value = err.data?.message || 'Une erreur est survenue lors de la récupération des sitemaps.';
    } finally {
      loading.value = false;
    }
  };

  const fetchSitemapById = async (id: string): Promise<ShortLinkSitemap | null> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await useApiFetch<GetSitemapResponse>(`/shortlinks/sitemap/${id}`);
      currentSitemap.value = response.data;
      return response.data;
    } catch (err: any) {
      console.error('Erreur lors de la récupération du sitemap:', err);
      error.value = err.data?.message || 'Une erreur est survenue lors de la récupération du sitemap.';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateSitemap = async (id: string, title: string): Promise<ShortLinkSitemap | null> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await useApiFetch<UpdateSitemapResponse>(`/shortlinks/sitemap/${id}`, {
        method: 'PUT',
        body: { title },
      });
      // Mettre à jour le sitemap dans la liste et le sitemap courant
      const index = sitemaps.value.findIndex(s => s.id === id);
      if (index !== -1) {
        sitemaps.value[index] = response.data;
      }
      if (currentSitemap.value && currentSitemap.value.id === id) {
        currentSitemap.value = response.data;
      }
      return response.data;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du sitemap:', err);
      error.value = err.data?.message || 'Une erreur est survenue lors de la mise à jour du sitemap.';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteSitemap = async (id: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    try {
      await useApiFetch<DeleteSitemapResponse>(`/shortlinks/sitemap/${id}`, {
        method: 'DELETE',
      });
      // Supprimer le sitemap de la liste
      sitemaps.value = sitemaps.value.filter(s => s.id !== id);
      pagination.value.totalSitemaps--;
      if (currentSitemap.value && currentSitemap.value.id === id) {
        currentSitemap.value = null;
      }
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la suppression du sitemap:', err);
      error.value = err.data?.message || 'Une erreur est survenue lors de la suppression du sitemap.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const clearError = (): void => {
    error.value = null;
  };

  const clearCurrentSitemap = (): void => {
    currentSitemap.value = null;
  };

  return {
    sitemaps: readonly(sitemaps),
    currentSitemap: readonly(currentSitemap),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    generateSitemap,
    fetchSitemaps,
    fetchSitemapById,
    updateSitemap,
    deleteSitemap,
    clearError,
    clearCurrentSitemap,
  };
});
