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

</script>

<template>
  <div class="landing">
    <!-- Hero (navbar incluse) -->
    <Hero :app-store-url="appStoreUrl" />
    <Features />
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
