<script setup lang="ts">
import NavBar from '../components/NavBar.vue';
import { articleList } from '../articles/article-list';
</script>

<template>
  <div class="landing">
    <NavBar theme="light" />
    <div class="blog-content">
      <h1>Blog</h1>
      <div class="blog-list">
        <div class="blog-post" v-for="article in articleList" :key="article.title">
          <h2>{{ article.id }} - {{ article.title }}</h2>
          <p>{{ article.content }}</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>



<style scoped>
.landing {
  background-color: var(--color-background);
  line-height: 1.6;
  min-height: 100vh;
}

.blog-content {
  width: min(100%, var(--page-max-width-narrow));
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 3rem) var(--page-gutter);
}

.blog-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.blog-post {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid var(--color-border);
  padding: 1rem;
  border-radius: 0.5rem;
}

@media (max-width: 640px) {
  .blog-content {
    padding-top: 1.5rem;
  }
}
</style>
