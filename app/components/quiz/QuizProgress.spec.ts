/**
 * @file Unit tests for QuizProgress.
 *
 * Covers:
 * - "Question n/total" label
 * - One segment per question, the ones reached filled
 * - Progressbar values for assistive technologies
 */
import { mount } from "@vue/test-utils";
import QuizProgress from "./QuizProgress.vue";

function factory(current = 2, total = 5) {
  return mount(QuizProgress, { props: { current, total } });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("QuizProgress", () => {
  it("shows the question number out of the total", () => {
    expect(factory().get(sel("quiz-progress-label")).text()).toBe("Question 2/5");
  });

  it("fills the segments of the questions reached", () => {
    const steps = factory().findAll(sel("quiz-progress-step"));

    expect(steps).toHaveLength(5);
    expect(steps.map((step) => step.classes().includes("quiz-progress__step--done"))).toEqual([
      true,
      true,
      false,
      false,
      false,
    ]);
  });

  it("exposes the progress as a progressbar", () => {
    const track = factory().get(sel("quiz-progress-track"));

    expect(track.attributes("role")).toBe("progressbar");
    expect(track.attributes("aria-valuenow")).toBe("2");
    expect(track.attributes("aria-valuemax")).toBe("5");
  });
});
