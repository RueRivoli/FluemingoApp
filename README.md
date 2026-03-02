# Site de présentation — Mon App

Landing page Nuxt pour la présentation de l’application mobile (App Store).

## Démarrage

```bash
# Installer les dépendances
npm install

# Lancer le serveur de dev (http://localhost:3000)
npm run dev

# Build pour la production
npm run build

# Générer un site statique (déploiement Netlify, Vercel, etc.)
npm run generate
```

## Personnalisation

- **`pages/index.vue`** : modifie le nom de l’app, le slogan, l’URL App Store, les fonctionnalités et les liens footer (confidentialité, support).
- **`nuxt.config.ts`** : titre et meta de la page.
- **`public/`** : ajoute ton favicon (`favicon.ico`) et tes captures d’écran pour la section Aperçu.

## Structure

```
├── app.vue
├── nuxt.config.ts
├── pages/
│   └── index.vue    # Page d’accueil (landing)
├── layouts/
│   └── default.vue
└── public/          # Fichiers statiques (images, favicon)
```
