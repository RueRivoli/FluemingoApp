// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/variables.css', '@fortawesome/fontawesome-pro/css/all.min.css'],
  app: {
    head: {
      title: 'Fluemingo App — Learn & Progress Faster',
      meta: [
        { name: 'description', content: 'Learn & Progress Faster with Fluemingo App' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geom:ital,wght@0,300..900;1,300..900&family=M+PLUS+Rounded+1c&family=Playwrite+NZ+Basic+Guides&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap',
        },
      ],
    },
  },
  compatibilityDate: '2024-11-01',
})
