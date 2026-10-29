/**
 * @file Unit tests for QuizResult.
 *
 * Covers:
 * - Score out of the total
 * - Message for a perfect, a good and a low score
 * - "restart" emitted by "Try again"
 */
import { mount } from "@vue/test-utils";
import QuizResult from "./QuizResult.vue";

function factory(score: number, total = 5) {
  return mount(QuizResult, { props: { score, total } });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("QuizResult", () => {
  it("shows the score out of the total", () => {
    expect(factory(3).get(sel("quiz-result-score")).text()).toBe("3 / 5 correct");
  });

  it.each([
    [5, "Perfect!"],
    [3, "Well done!"],
    [2, "Watch the video again"],
  ])("with %i right answers, says \"%s\"", (score, message) => {
    expect(factory(score).get(sel("quiz-result-message")).text()).toContain(message);
  });

  it('emits "restart" when "Try again" is clicked', async () => {
    const wrapper = factory(2);

    await wrapper.get(sel("quiz-result-restart")).trigger("click");

    expect(wrapper.emitted("restart")).toHaveLength(1);
  });
});
