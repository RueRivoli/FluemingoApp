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
    {
        name: 'Dean Manams',
        date: '2026-03-17',
        device: 'Apple iOS',
        mark: 5,
        review: 'I am happy about my progress with Fluemingo, I recommend it!',
    },
    {
        name: 'Nik Lallam',
        date: '2026-03-19',
        device: 'Apple iOS',
        mark: 5,
        review: 'I very enjoy the flashcards to repeat the vocabulary',
    },
]


const getDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
</script>

<template>
  <div id="testimonials" class="testimonials">

    <h2 class="section-title">
      <i class="fa-solid fa-comment-quote"></i> Testimonials</h2>
    <div class="testimonials-scroll-wrapper">
      <div class="testimonials-track">
        <article v-for="(feature, i) in [...testimonials, ...testimonials]" :key="`${i}-${feature.name}`" class="feature-card">
        <div class="feature-card-header">
          <img :src="avatarUrl(feature.name)" :alt="feature.name" class="feature-avatar" width="80" height="80" loading="lazy" />
          <div class="feature-card-meta">
            <h3 class="feature-title">{{ feature.name }}</h3>
            <span class="feature-date">{{ getDate(feature.date) }}</span>
          </div>
        </div>
        <div class="feature-stars">
          <i v-for="n in feature.mark" :key="n" class="fa-solid fa-star feature-star"></i>
        </div>
        <div class="feature-device">Device: 
            <span class="feature-device-text">
                <i class="fa-light fa-mobile mr-1"></i>
                {{ feature.device }}
            </span>
        </div>
        <div class="feature-desc">
            <div></div>
            <div class="feature-review">
              "{{ feature.review }}"
            </div>
            <div class="feature-quote-right"></div>
        </div>
        <div class="feature-name">
            <h3 class="feature-title">{{ feature.name }}</h3>
            <span class="feature-date">{{ getDate(feature.date) }}</span>
        </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.testimonials {
  padding: var(--section-spacing) 0;
  background-color: var(--color-background);
  opacity: 0.8;
  color: var(--color-text);
}

.section-title {
  font-size: clamp(1.8rem, 1.5rem + 1vw, 2.4rem);
  font-weight: 600;
  text-align: center;
}

.testimonials-scroll-wrapper {
  overflow: hidden;
  padding: 2rem 0 0;
  mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
}

.testimonials-track {
  display: flex;
  gap: 2rem;
  padding: 0 2rem;
  animation: scroll-horizontal 40s linear infinite;
  width: max-content;
}

.testimonials-track:hover {
  animation-play-state: paused;
}

@keyframes scroll-horizontal {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
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
  flex-shrink: 0;
  width: min(380px, calc(100vw - 4rem));
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
.feature-stars {
  display: flex;
  gap: 0.25rem;
}

.feature-star {
  color: var(--color-secondary, #F6D75A);
  font-size: 1rem;
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

@media (max-width: 768px) {
  .testimonials-scroll-wrapper {
    padding-top: 1.5rem;
    mask-image: none;
    -webkit-mask-image: none;
  }

  .testimonials-track {
    gap: 1rem;
    padding: 0 1rem;
  }

  .feature-card {
    padding: 1.5rem;
    width: min(320px, calc(100vw - 2rem));
  }

  .feature-avatar {
    width: 64px;
    height: 64px;
  }
}
</style>
