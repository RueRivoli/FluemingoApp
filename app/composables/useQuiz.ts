import { computed, ref, watch, type ComputedRef, type Ref } from "vue";
import type { QuizQuestion } from "~/types/quiz";

/** What the learner did on one question. */
interface QuestionProgress {
  /** Number of the picked answer; null when none */
  selected: number | null;
  isChecked: boolean;
}

export interface UseQuizReturn {
  /** Index of the question shown (0 = first) */
  currentIndex: Ref<number>;
  /** Question shown; null when the quiz is empty */
  currentQuestion: ComputedRef<QuizQuestion | null>;
  /** Picked answer of the question shown; null when none */
  selectedAnswer: ComputedRef<number | null>;
  /** The pick of the question shown has been checked */
  isChecked: ComputedRef<boolean>;
  isFirst: ComputedRef<boolean>;
  isLast: ComputedRef<boolean>;
  /** The learner went past the last question: the score is shown */
  isFinished: Ref<boolean>;
  /** Number of questions answered right */
  score: ComputedRef<number>;
  total: ComputedRef<number>;
  /** Picks an answer of the question shown; ignored once checked */
  select: (answer: number) => void;
  /** Checks the pick of the question shown; ignored without a pick */
  check: () => void;
  /** Goes to the next question, or to the score after the last one */
  next: () => void;
  /** Goes back to the previous question */
  previous: () => void;
  /** Starts the quiz over, answers cleared */
  restart: () => void;
}

/**
 * Walks through a quiz one question at a time: pick an answer, check it, go
 * on; the score counts the checked answers that are right.
 * @param questions - Questions of the quiz; a new list starts the quiz over
 *
 * @example
 * const quiz = useQuiz(toRef(props, "questions"))
 * <QuizQuestionCard :question="quiz.currentQuestion.value" @select="quiz.select" />
 */
export function useQuiz(questions: Ref<readonly QuizQuestion[]>): UseQuizReturn {
  const currentIndex = ref(0);
  const isFinished = ref(false);
  const progress = ref<QuestionProgress[]>([]);

  const total = computed(() => questions.value.length);
  const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null);
  const currentProgress = computed(() => progress.value[currentIndex.value] ?? null);
  const selectedAnswer = computed(() => currentProgress.value?.selected ?? null);
  const isChecked = computed(() => currentProgress.value?.isChecked ?? false);
  const isFirst = computed(() => currentIndex.value === 0);
  const isLast = computed(() => currentIndex.value >= total.value - 1);
  const score = computed(
    () =>
      questions.value.filter((question, index) => {
        const answer = progress.value[index];
        return answer?.isChecked && answer.selected === question.correctAnswer;
      }).length,
  );

  function restart() {
    currentIndex.value = 0;
    isFinished.value = false;
    progress.value = questions.value.map(() => ({ selected: null, isChecked: false }));
  }

  watch(questions, restart, { immediate: true });

  function select(answer: number) {
    const current = currentProgress.value;
    if (!current || current.isChecked) return;
    current.selected = answer;
  }

  function check() {
    const current = currentProgress.value;
    if (!current || current.selected === null) return;
    current.isChecked = true;
  }

  function next() {
    if (isLast.value) {
      isFinished.value = true;
      return;
    }
    currentIndex.value++;
  }

  function previous() {
    if (!isFirst.value) currentIndex.value--;
  }

  return {
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
  };
}
