// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      formspreeEndpoint: process.env.NUXT_PUBLIC_FORMSPREE_ENDPOINT || '',
    },
  },

  css: [
    '~/assets/css/variables.css',
    '@fortawesome/fontawesome-pro/css/fontawesome.min.css',
    '@fortawesome/fontawesome-pro/css/solid.min.css',
    '@fortawesome/fontawesome-pro/css/light.min.css',
    '@fortawesome/fontawesome-pro/css/duotone.min.css',
  ],

  app: {
    head: {
      title: 'Fluemingo App — Learn & Progress Faster',
      meta: [
        { name: 'description', content: 'Learn & Progress Faster with Fluemingo App' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&display=swap',
        },
      ],
    },
  },

  compatibilityDate: '2024-11-01',
  modules: ['@nuxt/image'],
})