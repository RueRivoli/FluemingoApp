<script setup lang="ts">
/**
 * QuizProgress — "Question 2/5" and one segment per question, the ones
 * reached filled (Figma quiz progress, like the mobile quiz).
 *
 * @example
 * <QuizProgress :current="2" :total="5" />
 */
import { computed } from "vue";

interface Props {
  /** Number of the question shown (1 = first) */
  current: number;
  /** Number of questions */
  total: number;
}

const props = defineProps<Props>();

const label = computed(() => `Question ${props.current}/${props.total}`);
</script>

<template>
  <div class="quiz-progress">
    <span class="quiz-progress__label" data-testid="quiz-progress-label">{{ label }}</span>
    <div
      class="quiz-progress__track"
      role="progressbar"
      :aria-valuenow="current"
      aria-valuemin="1"
      :aria-valuemax="total"
      :aria-label="label"
      data-testid="quiz-progress-track"
    >
      <span
        v-for="step in total"
        :key="step"
        :class="['quiz-progress__step', { 'quiz-progress__step--done': step <= current }]"
        data-testid="quiz-progress-step"
      />
    </div>
  </div>
</template>

<style scoped>
.quiz-progress {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quiz-progress__label {
  color: var(--color-primary-dark);
  font-size: 15px;
  font-weight: 600;
}

.quiz-progress__track {
  display: flex;
  gap: 6px;
}

.quiz-progress__step {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background-color: #e4e4e8;
  transition: background-color 0.2s ease;
}

.quiz-progress__step--done {
  background-color: var(--color-primary-dark);
}
</style>
