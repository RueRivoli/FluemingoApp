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
    description: 'News articles are published every day. Themes are very diverse, you\'ll for sure find something interesting to read !',
    description2: 'For example: politics, economy, culture, science, gastronomy,technology, sports, and so on.',
    description3: 'After finishing reading your article, a quiz is available to test your knowledge.',
  },
  {
    icon: 'headphones',
    img: '/screenshots/feature-audiobooks.png',
    title: 'Listen to Audiobooks you like',
    description: 'You\'ll find audiobooks of different kinds: biographies, stories, sci-fi, literature, thriller and so on.',
    description2: 'Diverse themes: culture, history, science, politics, economy, gastronomy, technology, sports, and so on.',
    description3: 'Audiobooks are divided into chapters so you can easily find the part you want to listen to.',
    description4: 'A quiz is available at the end of each audiobook to test your knowledge.',
  },
  {
    icon: 'cards-blank',
    img: '/screenshots/feature-flashcards.png',
    title: 'Train your Memory with Flashcards',
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
            <NuxtImg :src="feature.img" :alt="feature.title" class="feature-img" width="400" height="300" loading="lazy" />
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
  padding: var(--section-spacing) var(--page-gutter);
  background-color: var(--color-background);
  opacity: 0.8;
  color: var(--color-text);
}

.section-title {
  font-size: clamp(1.8rem, 1.5rem + 1vw, 2.4rem);
  font-weight: 600;
  text-align: center;
  margin-bottom: 1rem;
}

.features-list {
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  padding: 1rem 0 0;
}

.feature-item {
  padding: 0;
}

.feature-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
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
  margin: 0 auto;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: var(--color-background);
}

.feature-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

@media (max-width: 1024px) {
  .features-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .features-list {
    grid-template-columns: minmax(0, 1fr);
  }

  .feature-card {
    padding: 1.5rem;
  }

  .feature-card-header {
    align-items: flex-start;
  }
}
</style>
