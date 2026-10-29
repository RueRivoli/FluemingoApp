/**
 * @file Unit tests for ChapterRow.
 *
 * Covers:
 * - Number and title rendering
 * - Optional translated title
 * - Duration pill formatted as mm:ss, hidden when the duration is unknown
 */
import { mount } from "@vue/test-utils";
import ChapterRow from "./ChapterRow.vue";

/** Mounts a ChapterRow with a number and a title; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(ChapterRow, {
    props: { number: 1, title: "Le narrateur et le dessin", ...props },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("ChapterRow", () => {
  describe("rendering", () => {
    it("shows the chapter number and title", () => {
      const wrapper = factory({ number: 3 });

      expect(wrapper.get(sel("chapter-row-number")).text()).toBe("3");
      expect(wrapper.get(sel("chapter-row-title")).text()).toBe("Le narrateur et le dessin");
    });

    it("shows the translated title when given", () => {
      const wrapper = factory({ translatedTitle: "The narrator and the drawing" });

      expect(wrapper.get(sel("chapter-row-translated-title")).text()).toBe(
        "The narrator and the drawing",
      );
    });

    it("does not render the translated title when missing", () => {
      const wrapper = factory();

      expect(wrapper.find(sel("chapter-row-translated-title")).exists()).toBe(false);
    });
  });

  describe("duration", () => {
    it("shows the duration as mm:ss", () => {
      const wrapper = factory({ duration: 510 });

      expect(wrapper.get(sel("chapter-row-duration")).text()).toBe("08:30");
    });

    it("hides the pill when the duration is unknown", () => {
      const wrapper = factory({ duration: null });

      expect(wrapper.find(sel("chapter-row-duration")).exists()).toBe(false);
    });
  });
});
