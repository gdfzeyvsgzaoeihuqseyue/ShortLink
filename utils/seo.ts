import { useRuntimeConfig } from '#app';

type SeoMeta = {
  title: string
  description?: string
  ogImage?: string
  url?: string
  keywords?: string
}


export const useSeo = (): Record<string, SeoMeta> => {
  const runtimeConfig = useRuntimeConfig();
  const SHARED_URL = runtimeConfig.public.pgsSharedFiles;
  const baseUrl = "https://stlk.netlify.app";

  return {
    index: {
      title: "EasyQuickTrack",
      description: "Transformez vos liens longs en URLs courtes avec des analyses détaillées. Service gratuit et sécurisé.",
      ogImage: `${SHARED_URL}/SuitOps_Landing/Hero/index.png`,
      url: baseUrl,
      keywords: "url, racourcie, diminuteur, Bénin, PGS, Pro Gestion Soft"
    },
  };
};