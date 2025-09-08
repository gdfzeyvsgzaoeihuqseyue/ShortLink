// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    ['nuxt-gtag', {
      id: process.env.GTAG_ID || 'G-W3YE9JT2BX',
      enabled: process.env.NODE_ENV === 'production'
    }],
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      pgsBaseAPI: process.env.PGS_API_URL,
      pgsSharedFiles: process.env.PGS_SHARED_FILES,
      betaMode: process.env.NUXT_BETA_MODE === 'true',
      siteIdentifier: process.env.NUXT_PUBLIC_SITE_IDENTIFIER || 'eqt',
    }
  },

  googleFonts: {
    display: 'swap',
    families: {
      'Inter': [400, 500, 600, 700],
      'Poppins': [600, 700],
      'Genos': [100, 200, 300, 400, 500, 600, 700, 800, 900],
      'Space+Mono': [400, 700],
    }
  },

  app: {
    head: {
      title: 'EasyQuickTrack - Votre solution complète pour le web. Raccourcissez vos URLs, générez des QR codes, analysez les métadonnées de pages, sitemaps, robots.txt et plus encore pour booster votre SEO.',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'google-site-verification',
          content: 'OdKxHpVkBSxk0mj4vD4OTmZPdVi5pWzyCu4QPIMHy9A'
        },
        {
          key: 'description',
          name: 'description',
          content: 'Raccourcisseur de liens moderne.'
        },
        { name: 'author', content: 'Pro Gestion Soft' },
        { name: 'keywords', content: 'url, racourcie, diminuteur, Bénin, PGS, Pro Gestion Soft' },

        // Open Graph (Facebook, LinkedIn)
        { property: 'og:title', content: 'EasyQuickTrack - Raccourcisseur d\'URL intelligent' },
        { property: 'og:description', content: 'Votre solution complète pour le web. Raccourcissez vos URLs, générez des QR codes, analysez les métadonnées de pages, sitemaps, robots.txt et plus encore pour booster votre SEO.' },
        { property: 'og:image', content: 'https://raw.githubusercontent.com/ProGestionSoft/Files/main/SuitOps_Landing/Hero/index.png' },
        { property: 'og:url', content: 'https://stlk.netlify.app' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'EasyQuickTrack - Raccourcisseur d\'URL intelligent' },
        { name: 'twitter:description', content: 'RVotre solution complète pour le web. Raccourcissez vos URLs, générez des QR codes, analysez les métadonnées de pages, sitemaps, robots.txt et plus encore pour booster votre SEO.' },
        { name: 'twitter:image', content: 'https://raw.githubusercontent.com/ProGestionSoft/Files/main/SuitOps_Landing/Hero/index.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://stlk.netlify.app' }
      ]
    }
  },
})
