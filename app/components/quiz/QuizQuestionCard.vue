<script setup lang="ts">
/**
 * QuizQuestionCard — one quiz question (Figma "Page · Video ID · Quiz"):
 * progress, the question, a tip on demand, the answers in a 2-column grid and
 * the navigation. Presentational: the quiz state comes from useQuiz.
 *
 * @example
 * <QuizQuestionCard
 *   :question="quiz.currentQuestion.value" :number="1" :total="5"
 *   :selected-answer="null" :is-checked="false" :is-first="true" :is-last="false"
 *   @select="quiz.select" @check="quiz.check" @next="quiz.next" @previous="quiz.previous"
 * />
 */
import { computed, ref, watch } from "vue";
import QuizAnswer from "~/components/quiz/QuizAnswer.vue";
import QuizNavigation from "~/components/quiz/QuizNavigation.vue";
import QuizProgress from "~/components/quiz/QuizProgress.vue";
import type { QuizQuestion } from "~/types/quiz";
import { quizAnswerLetter, quizAnswerState } from "~/utils/quiz";

interface Props {
  question: QuizQuestion;
  /** Number of the question (1 = first) */
  number: number;
  /** Number of questions in the quiz */
  total: number;
  /** Number of the picked answer; null when none */
  selectedAnswer: number | null;
  /** The pick has been checked */
  isChecked: boolean;
  isFirst: boolean;
  isLast: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /** Fired when an answer is picked; carries its number */
  select: [answer: number];
  check: [];
  next: [];
  previous: [];
}>();

const isTipVisible = ref(false);

const answers = computed(() =>
  props.question.answers.map((answer, index) => ({
    ...answer,
    letter: quizAnswerLetter(index),
    state: quizAnswerState(
      answer.number,
      props.selectedAnswer,
      props.question.correctAnswer,
      props.isChecked,
    ),
  })),
);

// Each question starts with its tip hidden.
watch(
  () => props.question.id,
  () => (isTipVisible.value = false),
);
</script>

<template>
  <article class="quiz-question-card" data-testid="quiz-question-card">
    <div class="quiz-question-card__top">
      <QuizProgress class="quiz-question-card__progress" :current="number" :total="total" />
      <button
        v-if="question.tip"
        type="button"
        class="quiz-question-card__tip-button"
        :aria-expanded="isTipVisible"
        data-testid="quiz-question-tip-button"
        @click="isTipVisible = !isTipVisible"
      >
        <span class="fa-regular fa-lightbulb" aria-hidden="true" />
        {{ isTipVisible ? "Hide the tip" : "Show a tip" }}
      </button>
    </div>

    <h3 class="quiz-question-card__question" data-testid="quiz-question-text">
      {{ question.question }}
    </h3>
    <p v-if="isTipVisible" class="quiz-question-card__tip" data-testid="quiz-question-tip">
      {{ question.tip }}
    </p>

    <p class="quiz-question-card__hint">Choose an answer</p>
    <div class="quiz-question-card__answers">
      <QuizAnswer
        v-for="answer in answers"
        :key="answer.number"
        :letter="answer.letter"
        :text="answer.text"
        :state="answer.state"
        :disabled="isChecked"
        @select="emit('select', answer.number)"
      />
    </div>

    <QuizNavigation
      :is-first="isFirst"
      :is-last="isLast"
      :is-checked="isChecked"
      :can-check="selectedAnswer !== null"
      @previous="emit('previous')"
      @check="emit('check')"
      @next="emit('next')"
    />
  </article>
</template>

<style scoped>
.quiz-question-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px 32px;
  border: 1px solid var(--color-word-border);
  border-radius: 20px;
  background-color: var(--color-bg);
}

.quiz-question-card__top {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.quiz-question-card__progress {
  flex: 1;
}

.quiz-question-card__tip-button {
  display: flex;
  flex-shrink: 0;
  gap: 6px;
  align-items: center;
  padding: 6px 12px;
  border: none;
  border-radius: 999px;
  background-color: #fdf6d6;
  color: #6e5500;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.quiz-question-card__question {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 26px;
  font-weight: 600;
  line-height: 34px;
}

.quiz-question-card__tip {
  margin: -6px 0 0;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #fdf6d6;
  color: #6e5500;
  font-size: 15px;
  line-height: 21px;
}

.quiz-question-card__hint {
  margin: 0 0 -6px;
  color: #8a8a8a;
  font-size: 13px;
}

.quiz-question-card__answers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}
</style>
