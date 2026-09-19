<script setup lang="ts">
import NavBar from "../../components/NavBar.vue";
import Footer from "../../components/Footer.vue";

const { data: posts } = await useAsyncData("blog-list", () =>
  queryCollection("blog").order("date", "DESC").all(),
);

const languages = [
  {
    code: "fr",
    label: "Français",
    flag: "/flags/french.svg",
    color: "var(--color-primary)",
  },
  {
    code: "en",
    label: "English",
    flag: "/flags/english.svg",
    color: "var(--color-lang-en)",
  },
] as const;

type LanguageCode = (typeof languages)[number]["code"];

const languageLabels = Object.fromEntries(
  languages.map((l) => [l.code, l.label]),
) as Record<string, string>;

const selectedLanguage = ref<LanguageCode | null>(null);

const filteredPosts = computed(() => {
  if (!selectedLanguage.value) return posts.value ?? [];
  return (posts.value ?? []).filter(
    (post) => post.language === selectedLanguage.value,
  );
});

function toggleLanguage(code: LanguageCode) {
  selectedLanguage.value = selectedLanguage.value === code ? null : code;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

useHead({
  title: "Blog — Fluemingo App",
  meta: [
    {
      name: "description",
      content:
        "Tips, methods and series recommendations to learn a language faster with Fluemingo.",
    },
  ],
});
</script>

<template>
  <div class="landing">
    <NavBar theme="light" />
    <div class="blog-content">
      <header class="blog-header">
        <h1>Blog</h1>
        <p>Methods, habits and series recommendations to learn faster.</p>
      </header>

      <div class="blog-filters" role="group" aria-label="Filter by language">
        <button
          v-for="lang in languages"
          :key="lang.code"
          type="button"
          class="blog-filter"
          :class="{ active: selectedLanguage === lang.code }"
          :aria-pressed="selectedLanguage === lang.code"
          :style="{ '--filter-color': lang.color }"
          @click="toggleLanguage(lang.code)"
        >
          <img class="blog-filter-flag" :src="lang.flag" alt="" aria-hidden="true" />
          {{ lang.label }}
        </button>
      </div>

      <div class="blog-list">
        <NuxtLink
          v-for="post in filteredPosts"
          :key="post.path"
          class="blog-post"
          :to="post.path"
        >
          <div class="blog-post-meta">
            <span
              class="blog-post-language"
              :class="`lang-${post.language}`"
              >{{
              languageLabels[post.language] ?? post.language
            }}</span>
            <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          </div>
          <h2>{{ post.title }}</h2>
          <p>{{ post.description }}</p>
          <span class="blog-post-more">Read more →</span>
        </NuxtLink>
      </div>

      <p v-if="!filteredPosts.length" class="blog-empty">No articles yet.</p>
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

.blog-header {
  margin-bottom: 2rem;
}

.blog-header p {
  color: var(--color-text-light);
}

.blog-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.blog-filter {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg);
  color: var(--color-text);
  border-radius: 999px;
  padding: 0.375rem 0.875rem;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.blog-filter:hover {
  border-color: var(--filter-color);
}

.blog-filter.active {
  background-color: var(--filter-color);
  border-color: var(--filter-color);
  color: white;
}

.blog-filter-flag {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  object-fit: cover;
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
  background-color: var(--color-bg);
  padding: 1.25rem;
  border-radius: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.blog-post:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.12);
}

.blog-post h2 {
  font-size: 1.25rem;
}

.blog-post p {
  color: var(--color-text-light);
}

.blog-post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-text-light);
}

.blog-post-language {
  background-color: var(--color-primary);
  color: white;
  border-radius: 999px;
  padding: 0.125rem 0.625rem;
  font-weight: 500;
}

.blog-post-language.lang-en {
  background-color: var(--color-lang-en);
}

.blog-post-more {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary-dark);
}

.blog-empty {
  color: var(--color-text-light);
}

@media (max-width: 640px) {
  .blog-content {
    padding-top: 1.5rem;
  }
}
</style>
