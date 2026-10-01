// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  css: [
    "~/assets/css/variables.css",
    "@fortawesome/fontawesome-pro/css/fontawesome.min.css",
    "@fortawesome/fontawesome-pro/css/solid.min.css",
    "@fortawesome/fontawesome-pro/css/light.min.css",
    "@fortawesome/fontawesome-pro/css/duotone.min.css",
  ],

  app: {
    head: {
      title: "Fluemingo App — Learn & Progress Faster",
      meta: [
        {
          name: "description",
          content: "Learn & Progress Faster with Fluemingo App",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&display=swap",
        },
      ],
    },
  },

  compatibilityDate: "2025-07-15",
  modules: ["@nuxt/image", "@nuxt/content", "@primevue/nuxt-module"],

  primevue: {
    importTheme: { from: "@/theme/fluemingo.ts" },
  },

  // Overridable at build time with NUXT_PUBLIC_SUPABASE_URL / NUXT_PUBLIC_SUPABASE_ANON_KEY.
  // Defaults to the testing project; switch to https://mpsvgcdpovjchxirsdee.supabase.co for production.
  // Pages only reached by redirect are not found by the crawler: list them explicitly.
  nitro: {
    prerender: {
      routes: ["/auth", "/app/home"],
    },
  },

  runtimeConfig: {
    public: {
      supabaseUrl: "https://smkvrbluonhsbjjhrdch.supabase.co",
      supabaseAnonKey: "",
    },
  },

  image: {
    domains: ["api.dicebear.com"],
  },
});
