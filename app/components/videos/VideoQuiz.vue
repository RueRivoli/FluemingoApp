<script setup lang="ts">
/**
 * VideoQuiz — Quiz tab of the video page: the questions one at a time, then
 * the score. Shows a message when the video has no quiz yet.
 *
 * @example
 * <VideoQuiz :questions="quiz" />
 */
import { toRef } from "vue";
import QuizQuestionCard from "~/components/quiz/QuizQuestionCard.vue";
import QuizResult from "~/components/quiz/QuizResult.vue";
import { useQuiz } from "~/composables/useQuiz";
import type { QuizQuestion } from "~/types/quiz";

interface Props {
  /** Questions of the video's quiz, in order */
  questions: readonly QuizQuestion[];
}

const props = defineProps<Props>();

const {
  currentIndex,
  currentQuestion,
  selectedAnswer,
  isChecked,
  isFirst,
  isLast,
  isFinished,
  score,
  total,
  select,
  check,
  next,
  previous,
  restart,
} = useQuiz(toRef(props, "questions"));
</script>

<template>
  <section class="video-quiz" data-testid="video-quiz">
    <header class="video-quiz__header">
      <h3 class="video-quiz__title">Quiz</h3>
      <span v-if="total > 0" class="video-quiz__subtitle" data-testid="video-quiz-subtitle">
        {{ total }} comprehension {{ total === 1 ? "question" : "questions" }}
      </span>
    </header>

    <p v-if="!currentQuestion" class="video-quiz__empty" data-testid="video-quiz-empty">
      The quiz of this video is coming soon.
    </p>
    <QuizResult v-else-if="isFinished" :score="score" :total="total" @restart="restart" />
    <QuizQuestionCard
      v-else
      :question="currentQuestion"
      :number="currentIndex + 1"
      :total="total"
      :selected-answer="selectedAnswer"
      :is-checked="isChecked"
      :is-first="isFirst"
      :is-last="isLast"
      @select="select"
      @check="check"
      @next="next"
      @previous="previous"
    />
  </section>
</template>

<style scoped>
/* Capped like the Figma card: wider answers would be hard to scan. */
.video-quiz {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 820px;
}

.video-quiz__header {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: baseline;
}

.video-quiz__title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 600;
}

.video-quiz__subtitle {
  color: #8c8c92;
  font-size: 14px;
}

.video-quiz__empty {
  padding: 40px 0;
  color: var(--color-text-light);
  text-align: center;
}
</style>
