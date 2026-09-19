<script setup lang="ts">
import NavBar from "../../components/NavBar.vue";
import Footer from "../../components/Footer.vue";

const route = useRoute();

const { data: post } = await useAsyncData(`blog-${route.path}`, () =>
  queryCollection("blog").path(route.path).first(),
);

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Article not found",
    fatal: true,
  });
}

const languageLabels: Record<string, string> = {
  fr: "Français",
  en: "English",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

useHead({
  title: `${post.value.title} — Fluemingo Blog`,
  meta: [{ name: "description", content: post.value.description }],
});
</script>

<template>
  <div class="landing">
    <NavBar theme="light" />
    <article v-if="post" class="article">
      <NuxtLink to="/blog" class="back-link">← Back to the blog</NuxtLink>
      <header class="article-header">
        <div class="article-meta">
          <span class="article-language" :class="`lang-${post.language}`">{{
            languageLabels[post.language] ?? post.language
          }}</span>
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        </div>
        <h1>{{ post.title }}</h1>
        <p class="article-description">{{ post.description }}</p>
      </header>
      <div class="article-body">
        <ContentRenderer :value="post" />
      </div>
    </article>
    <Footer />
  </div>
</template>

<style scoped>
.landing {
  background-color: var(--color-background);
  line-height: 1.6;
  min-height: 100vh;
}

.article {
  width: min(100%, 720px);
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 3rem) var(--page-gutter);
}

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-primary-dark);
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.article-header {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-text-light);
  margin-bottom: 0.75rem;
}

.article-language {
  background-color: var(--color-primary);
  color: white;
  border-radius: 999px;
  padding: 0.125rem 0.625rem;
  font-weight: 500;
}

.article-language.lang-en {
  background-color: var(--color-lang-en);
}

.article-header h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  line-height: 1.2;
}

.article-description {
  margin-top: 0.75rem;
  color: var(--color-text-light);
  font-size: 1.0625rem;
}

.article-body {
  color: var(--color-text-muted);
}

.article-body :deep(h2) {
  margin: 2.5rem 0 0.75rem;
  font-size: 1.5rem;
  color: var(--color-text);
}

.article-body :deep(h3) {
  margin: 1.75rem 0 0.5rem;
  font-size: 1.1875rem;
  color: var(--color-text);
}

.article-body :deep(p) {
  margin-bottom: 1rem;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin: 0 0 1rem 1.25rem;
}

.article-body :deep(li) {
  margin-bottom: 0.375rem;
}

.article-body :deep(a) {
  color: var(--color-primary-dark);
}

.article-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
}

.article-body :deep(th),
.article-body :deep(td) {
  border: 1px solid var(--color-border-muted);
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.article-body :deep(th) {
  background-color: var(--color-bg-muted);
}

.article-body :deep(blockquote) {
  border-left: 3px solid var(--color-primary);
  padding-left: 1rem;
  margin: 0 0 1rem;
  color: var(--color-text-light);
}

.article-body :deep(code) {
  background-color: var(--color-bg-muted);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.9em;
}

@media (max-width: 640px) {
  .article {
    padding-top: 1.5rem;
  }
}
</style>
