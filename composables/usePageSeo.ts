import { useSeo } from '~/utils/seo'
import { useSeoMeta } from '#app'

export function usePageSeo(page: keyof ReturnType<typeof useSeo>) {
  const allSeoData = useSeo();
  const meta = allSeoData[page];

  useSeoMeta({
    title: meta.title,
    description: meta.description,
    ogImage: meta.ogImage,
    keywords: meta.keywords,
    robots: meta.robots
  })
}