import { defineStore } from 'pinia';
import { useApiFetch } from '~/utils/api';

export interface ShortLink {
  id: string
  longUrl: string
  shortCode: string
  shortLink: string
  clicks: number
  createdAt: number
  updatedAt: number
}

export interface CreateLinkResponse {
  message: string
  link: ShortLink
}

export interface GetLinksResponse {
  success: boolean
  message: string
  nb: number
  nbOnPage: number
  currentPage: number
  totalPages: number
  data: ShortLink[]
}

export interface GetLinkResponse {
  success: boolean
  message: string
  data: ShortLink
}

export const useLinksStore = defineStore('links', () => {
  const config = useRuntimeConfig()

  // State
  const links = ref<ShortLink[]>([])
  const currentLink = ref<ShortLink | null>(null)
  const loading = ref(false)
  const error = ref<string>('')
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalLinks: 0,
    linksOnPage: 0
  })

  // Actions
  const createShortLink = async (longUrl: string): Promise<ShortLink | null> => {
    loading.value = true
    error.value = ''

    try {
      const response = await useApiFetch<CreateLinkResponse>('/shortlinks', {
        method: 'POST',
        body: { longUrl }
      });

      const newLink = response.link

      // Ajouter le nouveau lien au début de la liste s'il n'existe pas déjà
      const existingIndex = links.value.findIndex(link => link.id === newLink.id)
      if (existingIndex === -1) {
        links.value.unshift(newLink)
        pagination.value.totalLinks++
      }

      return newLink
    } catch (err: any) {
      console.error('Erreur lors de la création du lien:', err)
      error.value = err.data?.message || 'Une erreur est survenue lors de la création du lien'
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchLinks = async (page: number = 1, limit: number = 10): Promise<void> => {
    loading.value = true
    error.value = ''

    try {
      const response = await useApiFetch<GetLinksResponse>('/shortlinks', {
        params: { page, limit }
      })

      links.value = response.data
      pagination.value = {
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalLinks: response.nb,
        linksOnPage: response.nbOnPage
      }
    } catch (err: any) {
      console.error('Erreur lors de la récupération des liens:', err)
      error.value = err.data?.message || 'Une erreur est survenue lors de la récupération des liens'
    } finally {
      loading.value = false
    }
  }

  const fetchLinkById = async (identifier: string): Promise<ShortLink | null> => {
    loading.value = true
    error.value = ''

    try {
      const response = await useApiFetch<GetLinkResponse>(`/shortlinks/${identifier}`);

      currentLink.value = response.data
      return response.data
    } catch (err: any) {
      console.error('Erreur lors de la récupération du lien:', err)
      
      if (err.status === 404) {
        error.value = 'Lien non trouvé'
      } else {
        error.value = err.data?.message || 'Une erreur est survenue lors de la récupération du lien'
      }
      
      return null
    } finally {
      loading.value = false
    }
  }

  const refreshLinks = async (): Promise<void> => {
    await fetchLinks(pagination.value.currentPage)
  }

  const clearError = (): void => {
    error.value = ''
  }

  const clearCurrentLink = (): void => {
    currentLink.value = null
  }

  // Getters
  const totalClicks = computed(() => {
    return links.value.reduce((sum, link) => sum + (link.clicks || 0), 0)
  })

  const averageClicksPerLink = computed(() => {
    const total = links.value.length
    return total > 0 ? Math.round(totalClicks.value / total) : 0
  })

  const recentLinks = computed(() => {
    return links.value.slice(0, 5)
  })

  const topPerformingLinks = computed(() => {
    return [...links.value]
      .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
      .slice(0, 5)
  })

  const stats = computed(() => ({
    totalLinks: pagination.value.totalLinks,
    totalClicks: totalClicks.value,
    avgClicksPerLink: averageClicksPerLink.value,
    clicksToday: Math.floor(Math.random() * 100) // Mock data - à remplacer par de vraies données
  }))

  return {
    // State
    links: readonly(links),
    currentLink: readonly(currentLink),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),

    // Actions
    createShortLink,
    fetchLinks,
    fetchLinkById,
    refreshLinks,
    clearError,
    clearCurrentLink,

    // Getters
    totalClicks,
    averageClicksPerLink,
    recentLinks,
    topPerformingLinks,
    stats
  }
})