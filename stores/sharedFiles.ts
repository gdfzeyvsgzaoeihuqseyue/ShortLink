import { defineStore } from 'pinia';

type FooterData = { 
  brand: string; 
  brandUrl: string 
}

export const useSharedFiles = defineStore('sharedFiles', () => {
  const runtimeConfig = useRuntimeConfig();
  const SHARED_URL = runtimeConfig.public.pgsSharedFiles;

  // Chemins des fichiers
  const paths = {
    // IMAGES
    logo: {
      dc: `${SHARED_URL}/Logos/EQT-DC.png`,
      dw: `${SHARED_URL}/Logos/EQT-DW.png`,
      mc: `${SHARED_URL}/Logos/EQT-MC.png`,
      mw: `${SHARED_URL}/Logos/EQT-MW.png`,
    },
    general: {
      error404: `${SHARED_URL}/General/404Error.png`,
    },

    //JSON
    data: {
      footer: `${SHARED_URL}/JSON/pgs.json`
    }
  };

  // Getter pour les données JSON
  async function getFooterData() {
    try {
      return await $fetch<{ brand: string; brandUrl: string }>(paths.data.footer);
    } catch (err) {
      return {
        brand: 'PGS SARL',
        brandUrl: '#'
      };
    }
  }

  return {
    paths,
    getFooterData
  };
});