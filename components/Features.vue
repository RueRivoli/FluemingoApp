<script setup lang="ts">
import BadgeLogo from "./BadgeLogo.vue";

const props = withDefaults(
  defineProps<{
    appStoreUrl?: string;
    googlePlayUrl?: string;
  }>(),
  {
    appStoreUrl: "https://apps.apple.com/app/id6757644637",
    googlePlayUrl:
      "https://play.google.com/store/apps/details?id=com.fluemingo.app",
  },
);

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth" });
}

// Images in public/screenshots/ are served at /screenshots/ (reliable in dev and build)
const features = [
  {
    icon: "book-open",
    img: "/screenshots/feature-articles.png",
    title: "Daily News Articles",
    descriptions: [
      "Read the news. Learn the language.",
      "A daily article at your level takes 5–10 minutes and fits into any routine.",
      "Build the vocabulary you'll actually use, across the topics that matter.",
    ],
  },
  {
    icon: "headphones",
    img: "/screenshots/feature-audiobooks.png",
    title: "Audiobooks for every taste",
    descriptions: [
      "Biographies, short stories, sci-fi, literary summaries, crime stories, thrillers, and more.",
      "Diverse topics: culture, history, science, politics, economics, food, technology, sports, and more.",
    ],
  },
  {
    icon: "cards-blank",
    img: "/screenshots/feature-flashcards.png",
    title: "Train your Memory with Flashcards",
    descriptions: [
      "Save any expression from a text to a flashcard, instantly.",
      "Test your comprehension with a quiz on any text.",
    ],
  },
];

const currentIndex = ref(0);
const currentFeature = computed(() => features[currentIndex.value]);

function goTo(index: number) {
  currentIndex.value = (index + features.length) % features.length;
}

function prev() {
  goTo(currentIndex.value - 1);
}

function next() {
  goTo(currentIndex.value + 1);
}
</script>

<template>
  <div id="features" class="functionnalities">
    <h2 class="section-title">
      Immersion at your own pace. With content you love.
    </h2>

    <div class="features-carousel">
      <button
        type="button"
        class="carousel-arrow carousel-arrow-prev"
        aria-label="Previous feature"
        @click="prev"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <div class="feature-card" :key="currentIndex">
        <div class="feature-img-container">
          <NuxtImg
            :src="currentFeature.img"
            :alt="currentFeature.title"
            class="feature-img"
            width="1000"
            height="1170"
            loading="lazy"
          />
        </div>

        <div class="feature-content">
          <div class="feature-card-header">
            <span class="feature-icon">
              <i :class="`fa-duotone fa-solid fa-${currentFeature.icon}`"></i>
            </span>
            <h3 class="feature-card-title">{{ currentFeature.title }}</h3>
          </div>

          <p
            class="feature-card-description"
            v-for="(description, i) in currentFeature.descriptions"
            :key="i"
          >
            <i class="fa-duotone fa-solid fa-arrow-right-long"></i>
            {{ description }}
          </p>
        </div>
      </div>

      <button
        type="button"
        class="carousel-arrow carousel-arrow-next"
        aria-label="Next feature"
        @click="next"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>

    <div class="carousel-dots">
      <button
        type="button"
        v-for="(feature, i) in features"
        :key="i"
        class="carousel-dot"
        :class="{ 'is-active': i === currentIndex }"
        :aria-label="`Show feature: ${feature.title}`"
        @click="goTo(i)"
      ></button>
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

.features-carousel {
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  padding: 1rem 0 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1.5rem);
}

.carousel-arrow {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: clamp(2rem, 1.4rem + 2vw, 3rem);
  line-height: 1;
  color: var(--color-primary);
  transition: transform 0.15s ease;
}

.carousel-arrow:hover {
  transform: scale(1.1);
}

.carousel-arrow:active {
  transform: scale(0.95);
}

.feature-card {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 3vw, 3rem);
  align-items: center;
  color: black;
}

.feature-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: white;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  border-radius: 1rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.feature-card-header {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
}

.feature-card-title {
  font-size: clamp(1.2rem, 1rem + 0.6vw, 1.6rem);
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
}

.feature-img {
  width: 100%;
  height: auto;
  display: block;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 1.5rem;
}

.carousel-dot {
  width: 0.7rem;
  height: 0.7rem;
  padding: 0;
  border-radius: 50%;
  border: 1px solid var(--color-primary);
  background-color: transparent;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;
}

.carousel-dot.is-active {
  background-color: var(--color-primary);
  transform: scale(1.2);
}

@media (max-width: 800px) {
  .feature-card {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.25rem;
  }

  .feature-card-header {
    align-items: flex-start;
  }

  .feature-img-container {
    max-width: 420px;
  }
}

@media (max-width: 600px) {
  .features-carousel {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
  }

  .feature-card {
    grid-row: 1;
    grid-column: 1;
    width: 100%;
  }

  .carousel-arrow-prev {
    grid-row: 2;
    grid-column: 1;
    justify-self: start;
  }

  .carousel-arrow-next {
    grid-row: 2;
    grid-column: 1;
    justify-self: end;
  }
}
</style>
