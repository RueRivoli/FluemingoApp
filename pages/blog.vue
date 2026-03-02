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
  padding: 2rem;
}

.blog-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 80%;
  margin: 0 auto;
}

.blog-post {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid var(--color-border);
  padding: 1rem;
  border-radius: 0.5rem;
}
</style>
