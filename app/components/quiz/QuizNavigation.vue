<script setup lang="ts">
/**
 * QuizNavigation — buttons under a quiz question: "Previous", and one main
 * button that checks the pick, then goes to the next question (or the score
 * after the last one).
 *
 * @example
 * <QuizNavigation
 *   :is-first="false" :is-last="false" :is-checked="false" :can-check="true"
 *   @previous="quiz.previous()" @check="quiz.check()" @next="quiz.next()"
 * />
 */
import { computed } from "vue";

interface Props {
  /** First question: "Previous" is disabled */
  isFirst: boolean;
  /** Last question: the main button leads to the score */
  isLast: boolean;
  /** The pick has been checked: the main button moves on */
  isChecked: boolean;
  /** An answer is picked: it can be checked */
  canCheck: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /** Fired when "Previous" is clicked */
  previous: [];
  /** Fired when "Check answer" is clicked */
  check: [];
  /** Fired when "Next question" / "See my score" is clicked */
  next: [];
}>();

const mainLabel = computed(() => {
  if (!props.isChecked) return "Check answer";
  return props.isLast ? "See my score" : "Next question";
});
const isMainDisabled = computed(() => !props.isChecked && !props.canCheck);

function handleMain() {
  if (isMainDisabled.value) return;
  if (props.isChecked) emit("next");
  else emit("check");
}
</script>

<template>
  <div class="quiz-navigation">
    <button
      type="button"
      class="quiz-navigation__button quiz-navigation__button--secondary"
      :disabled="isFirst"
      data-testid="quiz-navigation-previous"
      @click="emit('previous')"
    >
      <span class="fa-solid fa-chevron-left" aria-hidden="true" />
      Previous
    </button>
    <button
      type="button"
      class="quiz-navigation__button quiz-navigation__button--primary"
      :disabled="isMainDisabled"
      data-testid="quiz-navigation-main"
      @click="handleMain"
    >
      {{ mainLabel }}
      <span class="fa-solid fa-chevron-right" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.quiz-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
}

.quiz-navigation__button {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 12px 22px;
  border-radius: 999px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.15s ease;
}

.quiz-navigation__button:disabled {
  cursor: default;
}

.quiz-navigation__button--secondary {
  border: 1.5px solid var(--color-text-primary);
  background-color: var(--color-bg);
  color: var(--color-text-primary);
}

.quiz-navigation__button--secondary:disabled {
  border-color: var(--color-word-border);
  color: #bebebe;
}

.quiz-navigation__button--primary {
  border: none;
  background-color: var(--color-primary-dark);
  color: var(--color-bg);
}

.quiz-navigation__button--primary:not(:disabled):hover {
  filter: brightness(1.08);
}

.quiz-navigation__button--primary:disabled {
  opacity: 0.45;
}

.quiz-navigation__button .fa-solid {
  font-size: 12px;
}
</style>
