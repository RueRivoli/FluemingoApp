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

  // Used by @nuxtjs/sitemap, @nuxtjs/robots and the canonical / og:url tags (app/app.vue).
  // Netlify redirects /page to /page/, so every public URL ends with a slash.
  site: {
    url: "https://fluemingo-app.com",
    name: "Fluemingo",
    trailingSlash: true,
  },

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      title: "Fluemingo App — Learn & Progress Faster",
      meta: [
        {
          name: "description",
          content: "Learn & Progress Faster with Fluemingo App",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        // Defaults for link previews; pages override title/description via useSeoMeta.
        { property: "og:site_name", content: "Fluemingo" },
        { property: "og:type", content: "website" },
        { property: "og:image", content: "https://fluemingo-app.com/og-image.png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: "https://fluemingo-app.com/og-image.png" },
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
  modules: [
    "@nuxt/image",
    "@nuxt/content",
    "@primevue/nuxt-module",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
  ],

  // Links point straight at /page/ instead of bouncing through Netlify's 301.
  experimental: {
    defaults: { nuxtLink: { trailingSlash: "append" } },
  },

  // Private pages: <meta name="robots" content="noindex"> and left out of the sitemap.
  // (Not Disallowed in robots.txt on purpose: crawlers must fetch the page to see noindex.)
  routeRules: {
    "/auth": { robots: false },
    "/app/**": { robots: false },
  },

  sitemap: {
    exclude: ["/auth/**", "/app/**"],
  },

  primevue: {
    importTheme: { from: "@/theme/fluemingo.ts" },
  },

  // Pages only reached by redirect are not found by the crawler: list them explicitly.
  nitro: {
    prerender: {
      routes: ["/auth", "/app/home"],
    },
  },

  // Overridable at build time with NUXT_PUBLIC_SUPABASE_URL / NUXT_PUBLIC_SUPABASE_ANON_KEY.
  // Defaults to the testing project; switch to https://mpsvgcdpovjchxirsdee.supabase.co for production.
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
