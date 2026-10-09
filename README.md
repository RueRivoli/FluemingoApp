# Market Site for Fluemingo Mobile App

The Fluemingo Web Application associated with its mobile application Fluemingo (developed with Flutter)

- **Marketing site** (landing, blog, legal pages): prerendered as static HTML (`nuxt generate`), indexed by search engines.
- **Web app** (`/auth` and `/app/**`): client-side rendered SPA (`ssr: false`), behind Supabase auth, not indexed.

## Start

```bash
# Install dependencies
npm install

# Run the dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Generate a static site (Netlify deployment, Vercel, etc.)
npm run generate
```

## Personnalisation

- **`pages/index.vue`** : modifie le nom de l’app, le slogan, l’URL App Store, les fonctionnalités et les liens footer (confidentialité, support).
- **`nuxt.config.ts`** : titre et meta de la page.
- **`public/`** : ajoute ton favicon (`favicon.ico`) et tes captures d’écran pour la section Aperçu.

## Structure

```
├── app/
│   ├── app.vue              # Root component (global SEO / canonical tags)
│   ├── assets/css/          # Tailwind entry + design tokens (variables.css)
│   ├── components/          # Auto-imported components (landing sections, NavBar, AppSidebar, User*…)
│   │   └── content/         # Components usable inside Markdown blog posts
│   ├── composables/         # useSupabase (browser-only Supabase client)
│   ├── layouts/
│   │   ├── default.vue      # Marketing site layout
│   │   └── app.vue          # Logged-in app layout (sidebar)
│   ├── middleware/
│   │   └── auth.ts          # Guards /app/*: redirects to /auth without a session
│   ├── pages/
│   │   ├── index.vue        # Landing page
│   │   ├── auth.vue         # Log in / sign up / password reset
│   │   ├── blog/            # Blog index + [slug] articles (Nuxt Content)
│   │   ├── app.vue          # Parent of /app/*: app layout + auth middleware
│   │   ├── app/             # Logged-in SPA (home, browse/…)
│   │   └── *.vue            # Legal & info pages (terms, privacy-policy, contact…)
│   ├── plugins/
│   ├── stores/              # Pinia stores (user.ts: logged-in user)
│   ├── theme/               # PrimeVue theme preset
│   └── utils/               # Auto-imported constants & data (constants.ts…)
├── content/blog/            # Markdown blog posts
├── content.config.ts        # Nuxt Content collections
├── public/                  # Static files (images, favicons, _redirects)
├── netlify.toml             # Netlify build & deploy config
└── nuxt.config.ts
```
