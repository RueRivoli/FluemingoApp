<script setup lang="ts">
import Hero from '../components/Hero.vue';
import Footer from '../components/Footer.vue';
import Banner from '../components/Banner.vue';
// À personnaliser selon ton app
const appName = 'Fluemingo'
const appTagline = 'Learn French with Fun'
const appStoreUrl = 'https://apps.apple.com/app/id6757644637'
const privacyUrl = '' // ex: '/privacy' ou URL externe
const supportUrl = '' // ex: 'mailto:support@example.com'

useSeoMeta({
  title: "Fluemingo — Learn languages with your favorite content",
  description:
    "Learn English or French with daily news articles, audiobooks and flashcards. Build a strong and lasting vocabulary with Fluemingo, on iOS and Android.",
  ogTitle: "Fluemingo — Learn languages with your favorite content",
  ogDescription:
    "Learn English or French with daily news articles, audiobooks and flashcards. Build a strong and lasting vocabulary with Fluemingo, on iOS and Android.",
});
</script>

<template>
  <div class="landing">
    <!-- Hero (navbar incluse) -->
    <Hero :app-store-url="appStoreUrl" />
    <Features />
    <VocabularyGrowth />
    <Faq />
    <Testimonials />
    <!-- <Updates /> -->
    <Banner />
    <Footer/>
  </div>
</template>



<style scoped>
.landing {
  font-family: var(--font-sans);
  color: white;
  line-height: 1.6;
}

</style>
