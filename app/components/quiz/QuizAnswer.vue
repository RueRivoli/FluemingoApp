<script setup lang="ts">
/**
 * QuizAnswer — one answer of a quiz question (Figma QuizAnswer): a letter
 * badge and the answer text, coloured by its state (picked, right, wrong).
 *
 * @example
 * <QuizAnswer letter="B" text="Un café crème" state="selected" @select="pick(2)" />
 */
import { computed } from "vue";
import type { QuizAnswerState } from "~/types/quiz";

interface Props {
  /** Letter of the badge, e.g. "A" */
  letter: string;
  /** Answer text */
  text: string;
  /** How the answer looks */
  state?: QuizAnswerState;
  /** The question is checked: answers can no longer be picked */
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  state: "default",
  disabled: false,
});

const emit = defineEmits<{
  /** Fired when the answer is clicked and can still be picked */
  select: [];
}>();

// Read out after the text once checked, since the colour alone says nothing to screen readers.
const STATE_LABELS: Partial<Record<QuizAnswerState, string>> = {
  correct: "right answer",
  wrong: "wrong answer",
};

const stateLabel = computed(() => STATE_LABELS[props.state] ?? null);

function handleClick() {
  if (!props.disabled) emit("select");
}
</script>

<template>
  <button
    type="button"
    :class="['quiz-answer', `quiz-answer--${state}`]"
    :aria-pressed="state === 'selected'"
    :aria-disabled="disabled"
    data-testid="quiz-answer"
    @click="handleClick"
  >
    <span class="quiz-answer__badge" aria-hidden="true" data-testid="quiz-answer-letter">
      {{ letter }}
    </span>
    <span class="quiz-answer__text" data-testid="quiz-answer-text">{{ text }}</span>
    <span v-if="stateLabel" class="sr-only" data-testid="quiz-answer-state">
      ({{ stateLabel }})
    </span>
  </button>
</template>

<style scoped>
.quiz-answer {
  --answer-bg: var(--color-bg);
  --answer-border: var(--color-word-border);
  --answer-accent: #f0f0f0;
  --answer-letter: var(--color-text-light);

  display: flex;
  gap: 14px;
  align-items: center;
  width: 100%;
  min-height: 72px;
  padding: 18px 20px 18px 18px;
  border: 1px solid var(--answer-border);
  border-radius: 16px;
  background-color: var(--answer-bg);
  color: var(--color-text-primary);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.quiz-answer:not([aria-disabled="true"]):hover {
  border-color: var(--color-primary);
}

.quiz-answer[aria-disabled="true"] {
  cursor: default;
}

.quiz-answer--selected,
.quiz-answer--correct,
.quiz-answer--wrong {
  /* 2px border without shifting the content: the missing pixel goes into the shadow. */
  box-shadow: 0 0 0 1px var(--answer-border);
  --answer-letter: var(--color-bg);
}

.quiz-answer--selected {
  --answer-bg: var(--color-word-accent);
  --answer-border: var(--color-primary-dark);
  --answer-accent: var(--color-primary-dark);
}

.quiz-answer--correct {
  --answer-bg: color-mix(in srgb, var(--color-success) 12%, var(--color-bg));
  --answer-border: var(--color-success);
  --answer-accent: var(--color-success);
}

.quiz-answer--wrong {
  --answer-bg: color-mix(in srgb, var(--color-error) 10%, var(--color-bg));
  --answer-border: var(--color-error);
  --answer-accent: var(--color-error);
}

.quiz-answer__badge {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--answer-accent);
  color: var(--answer-letter);
  font-size: 14px;
  font-weight: 600;
}

.quiz-answer__text {
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
}
</style>
