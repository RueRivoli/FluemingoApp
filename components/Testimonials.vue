<script setup lang="ts">
const DICEBEAR_API = 'https://api.dicebear.com/9.x/open-peeps/svg'

function avatarUrl(seed: string) {
  const params = new URLSearchParams({
    seed,
    radius: '50',           // full circle shape
    size: '80',             // match display size for sharp rendering
    backgroundColor: 'e8e1e1', // soft neutral background
  })
  return `${DICEBEAR_API}?${params.toString()}`
}

const testimonials = [
    {
        date: '2026-03-01',
        name: 'Jamie Cambray',
        device: 'Apple iOS',
        mark: 5,
        review: 'This App really helps me to practise French everyday. I was able to save vocabulary into the Flashcards, they are a great way to learn new words and phrases.',
    },
    {
        name: 'Roberto Murcia',
        date: '2026-03-04',
        device: 'Apple iOS',
        mark: 5,
        review: 'Fluemingo has been a game-changer for my language learning journey. The audiobooks are great for listening practice, and the flashcards help me memorize new words efficiently.',
    },
    {
        name: 'Sebastian Moreno',
        date: '2026-03-07',
        device: 'Apple iOS',
        mark: 5,
        review: 'I love the variety of topics and the fact that new articles are added regularly. It keeps me motivated to learn new things every day.',
    },
]


const getDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
</script>

<template>
  <div id="testimonials" class="testimonials">
    <h2 class="section-title">Testimonials</h2>
    <div class="features-grid">
      <article v-for="(feature, i) in testimonials" :key="i" class="feature-card">
        <div class="feature-card-header">
          <img :src="avatarUrl(feature.name)" :alt="feature.name" class="feature-avatar" width="80" height="80" loading="lazy" />
          <div class="feature-card-meta">
            <h3 class="feature-title">{{ feature.name }}</h3>
            <span class="feature-date">{{ getDate(feature.date) }}</span>
          </div>
        </div>
        <div class="feature-device">Device: 
            <span class="feature-device-text">
                <i class="fa-light fa-mobile mr-1"></i>
                {{ feature.device }}
            </span>
        </div>
        <div class="feature-desc">
            <div><i class="fa-light fa-quote-left mr-2"></i></div>
            <div class="feature-review">{{ feature.review }}</div>
            <div class="feature-quote-right"><i class="fa-light fa-quote-right ml-2"></i></div>
        </div>
        <div class="feature-name">
            <h3 class="feature-title">{{ feature.name }}</h3>
            <span class="feature-date">{{ getDate(feature.date) }}</span>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.testimonials {
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
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

.feature-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.feature-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid var(--color-border, #eee);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.feature-review {
  font-size: 1rem;
  color: white;
  background-color: var(--color-primary);
  border: 1px solid var(--color-border);
  padding: 0.5rem;
  border-radius: 0.5rem;
}
.feature-device-text {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  padding: 0.5rem;
  border-radius: 0.5rem;
}
.feature-icon {
  font-size: 2rem;
  /* Duotone: primary = full color, secondary = lighter (default 40% opacity) */
  --fa-primary-color: var(--color-primary);
  --fa-secondary-color: var(--color-neutral);
  --fa-secondary-opacity: 0.4;
  color: var(--color-primary);
}
.feature-quote-right {
  text-align: right;
}
.mr-2 {
  margin-right: 0.5rem;
}
.mr-1 {
  margin-right: 0.25rem;
}
.ml-2 {
  margin-left: 0.5rem;
}
</style>
