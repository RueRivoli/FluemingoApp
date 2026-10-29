<script setup lang="ts">
/**
 * QuizResult — end of a quiz: the score, a short message and a button to
 * try again.
 *
 * @example
 * <QuizResult :score="4" :total="5" @restart="quiz.restart()" />
 */
import { computed } from "vue";

interface Props {
  /** Number of right answers */
  score: number;
  /** Number of questions */
  total: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /** Fired when "Try again" is clicked */
  restart: [];
}>();

// Share of right answers from which the message turns from "keep going" to "well done".
const GOOD_SCORE_RATIO = 0.6;

const isPerfect = computed(() => props.total > 0 && props.score === props.total);
const message = computed(() => {
  if (isPerfect.value) return "Perfect! You understood everything.";
  if (props.score >= props.total * GOOD_SCORE_RATIO) return "Well done! You understood most of the video.";
  return "Watch the video again and give it another try.";
});
</script>

<template>
  <section class="quiz-result" aria-live="polite" data-testid="quiz-result">
    <span class="quiz-result__icon fa-solid fa-percent" aria-hidden="true" />
    <h3 class="quiz-result__title">Quiz complete</h3>
    <p class="quiz-result__score" data-testid="quiz-result-score">
      {{ score }} / {{ total }} correct
    </p>
    <p class="quiz-result__message" data-testid="quiz-result-message">{{ message }}</p>
    <button
      type="button"
      class="quiz-result__restart"
      data-testid="quiz-result-restart"
      @click="emit('restart')"
    >
      <span class="fa-solid fa-rotate-right" aria-hidden="true" />
      Try again
    </button>
  </section>
</template>

<style scoped>
.quiz-result {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  padding: 40px 32px;
  border: 1px solid var(--color-word-border);
  border-radius: 20px;
  background-color: var(--color-bg);
  text-align: center;
}

.quiz-result__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: 6px;
  border-radius: 50%;
  background-color: var(--color-primary-dark);
  color: var(--color-bg);
  font-size: 24px;
}

.quiz-result__title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 22px;
  font-weight: 600;
}

.quiz-result__score {
  margin: 0;
  color: var(--color-primary-dark);
  font-size: 28px;
  font-weight: 700;
}

.quiz-result__message {
  margin: 0 0 10px;
  color: var(--color-text-light);
  font-size: 15px;
}

.quiz-result__restart {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 12px 22px;
  border: 1.5px solid var(--color-text-primary);
  border-radius: 999px;
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
</style>
