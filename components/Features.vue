<script setup lang="ts">
import BadgeLogo from './BadgeLogo.vue'

const props = withDefaults(
  defineProps<{
    appStoreUrl?: string
    googlePlayUrl?: string
  }>(),
  {
    appStoreUrl: 'https://apps.apple.com/app/ton-app-id',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=ton.app.id',
  }
)

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth' })
}

// Images in public/screenshots/ are served at /screenshots/ (reliable in dev and build)
const features = [
  {
    icon: 'book-open',
    img: '/screenshots/feature-article.png',
    title: 'Read News Articles every day',
    description: 'News articles are added every day. You\'ll find brand new content every day. Themes are diverse so everyone can find something interesting to read.',
    description2: 'Diverse themes: politics, economy, culture, science, gastronomy,technology, sports, etc.',
    description3: 'At the end of each article, a quiz is available to test your knowledge.',
  },
  {
    icon: 'headphones',
    img: '/screenshots/feature-audiobooks.png',
    title: 'Listen to Audiobooks you like',
    description: 'You\'ll find audiobooks of different kinds: biographies, stories, sci-fi, extracts from literature, thriller, etc.',
    description2: 'Diverse themes: culture, history, science, politics, economy, gastronomy, technology, sports, etc.',
    description3: 'Audiobooks are divided into chapters so you can easily find the part you want to listen to.',
    description4: 'A quiz is available at the end of each audiobook to test your knowledge.',
  },
  {
    icon: 'cards-blank',
    img: '/screenshots/feature-flashcards.png',
    title: 'Train with Flashcards',
    description: 'You can save from articles and audiobooks any word or expression you like',
    description2: 'These expressions are available in the flashcards section to train',
    description3: 'You can store them in different categories: difficult, training, achieved.',
  },
]
</script>

<template>
  <div id="features" class="functionnalities">
    <h2 class="section-title">Features</h2>
    <div class="features-list">
      <article class="feature-item" v-for="(feature, i) in features" :key="i">
        <div class="feature-card">
          <div class="feature-img-container">
            <img :src="feature.img" :alt="feature.title" class="feature-img" width="400" height="300" loading="lazy" />
          </div>
          <div class="feature-card-header">
            <span class="feature-icon">
              <i :class="`fa-duotone fa-solid fa-${feature.icon}`"></i>
            </span>
            <h3 class="feature-card-title">{{ feature.title }}</h3>
          </div>
          <p class="feature-card-description">
            <i class="fa-duotone fa-solid fa-arrow-right-long"></i> {{ feature.description }}</p>
          <p class="feature-card-description"> <i class="fa-duotone fa-solid fa-arrow-right-long"></i> {{ feature.description2 }}</p>
          <p class="feature-card-description"> <i class="fa-duotone fa-solid fa-arrow-right-long"></i> {{ feature.description3 }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.functionnalities {
  padding: 4rem 0;
  background-color: var(--color-background);
  opacity: 0.8;
  color: var(--color-text);
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 1rem;
}

.feature-item {
  padding: 2rem;
}

.feature-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: white;
  border: 1px solid black;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  color: black;
}

.feature-card-header{
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
}

.feature-icon {
  font-size: 2rem;
  /* Duotone: primary = full color, secondary = lighter (default 40% opacity) */
  --fa-primary-color: var(--color-primary);
  --fa-secondary-color: var(--color-neutral);
  --fa-secondary-opacity: 0.4;
  color: var(--color-primary);
}

.feature-img-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 0.5rem;
}

.feature-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}
</style>
