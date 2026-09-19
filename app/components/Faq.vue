<script setup lang="ts">
// Section FAQ : liste de questions/réponses en accordéon (un seul item ouvert à la fois).
// Modifier le tableau `faqs` pour changer le contenu.

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Which languages can I learn with Fluemingo?",
    answer:
      "Fluemingo currently helps you learn French and English. You choose the language you want to learn when you create your account, and you can switch at any time in the settings.",
  },
  {
    question: "Is Fluemingo suitable for beginners?",
    answer:
      "Yes. Every article and audiobook is written for a specific level, from A1 to C1. You pick your level, and the content adapts so you always understand most of what you read while still meeting new words.",
  },
  {
    question: "How much time do I need each day?",
    answer:
      "A daily article takes 5 to 10 minutes. Audiobooks are split into short chapters, so you can listen during a commute or a coffee break. Consistency matters more than session length.",
  },
  {
    question: "How do flashcards work?",
    answer:
      "Tap any word or expression in a text to save it as a flashcard, with its translation and the sentence it came from. Review your cards whenever you like and test yourself with a quiz on any article.",
  },
  {
    question: "Can I use Fluemingo offline?",
    answer:
      "Yes. Download an article or an audiobook to read or listen to it without a connection, for example on a plane or in the metro.",
  },
  {
    question: "Is Fluemingo free?",
    answer:
      "You can download the app and start for free. A subscription unlocks the full library of articles and audiobooks, managed through the App Store or Google Play and cancellable at any time.",
  },
  {
    question: "Which devices are supported?",
    answer:
      "Fluemingo is available on iPhone and iPad through the App Store, and on Android phones and tablets through Google Play. Your progress and flashcards sync across devices.",
  },
];

const openIndex = ref<number | null>(0);

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index;
}
</script>

<template>
  <section id="faq" class="faq">
    <div class="faq-inner">
      <h2 class="section-title">
        <i class="fa-solid fa-circle-question"></i> Frequently asked questions
      </h2>

      <div class="faq-list">
        <div
          v-for="(item, i) in faqs"
          :key="item.question"
          class="faq-item"
          :class="{ 'is-open': openIndex === i }"
        >
          <h3 class="faq-question">
            <button
              type="button"
              class="faq-trigger"
              :aria-expanded="openIndex === i"
              :aria-controls="`faq-panel-${i}`"
              :id="`faq-trigger-${i}`"
              @click="toggle(i)"
            >
              <span>{{ item.question }}</span>
              <i class="fa-solid fa-chevron-down faq-chevron" aria-hidden="true"></i>
            </button>
          </h3>
          <div
            :id="`faq-panel-${i}`"
            class="faq-panel"
            role="region"
            :aria-labelledby="`faq-trigger-${i}`"
          >
            <div class="faq-panel-inner">
              <p class="faq-answer">{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  padding: var(--section-spacing) var(--page-gutter);
  background-color: var(--color-background);
  color: var(--color-text);
}

.faq-inner {
  max-width: var(--page-max-width-narrow);
  margin: 0 auto;
}

.section-title {
  font-size: clamp(1.8rem, 1.5rem + 1vw, 2.4rem);
  font-weight: 600;
  text-align: center;
  margin-bottom: 2.5rem;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border-muted);
  border-radius: 1rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s ease;
}

.faq-item.is-open {
  border-color: var(--color-primary);
}

.faq-question {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
}

.faq-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
  border-radius: 1rem;
}

.faq-trigger:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.faq-chevron {
  flex-shrink: 0;
  color: var(--color-primary);
  transition: transform 0.25s ease;
}

.faq-item.is-open .faq-chevron {
  transform: rotate(180deg);
}

/* Animation d'ouverture via grid-template-rows (pas besoin de connaître la hauteur) */
.faq-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease;
}

.faq-item.is-open .faq-panel {
  grid-template-rows: 1fr;
}

.faq-panel-inner {
  overflow: hidden;
}

.faq-answer {
  padding: 0 1.5rem 1.25rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .faq-trigger {
    padding: 1rem 1.25rem;
  }

  .faq-answer {
    padding: 0 1.25rem 1rem;
  }
}
</style>
