/**
 * @file Unit tests for FlashcardDeckCard.
 *
 * Covers:
 * - Rendering of title, subtitle, icon and illustration
 * - Status modifier class (drives the colors)
 * - Expression count: number + singular/plural label, dash while unknown
 */
import { mount } from "@vue/test-utils";
import FlashcardDeckCard from "./FlashcardDeckCard.vue";

/** Mounts the Oops deck; override props per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(FlashcardDeckCard, {
    props: {
      status: "difficult",
      title: "Oops",
      subtitle: "Difficult vocabulary",
      icon: "fa-regular fa-triangle-exclamation",
      imageUrl: "/img/flashcards/difficult.png",
      ...props,
    },
    global: {
      // NuxtImg is a Nuxt global, not registered in Jest: render a plain <img>.
      stubs: { NuxtImg: { props: ["src"], template: '<img :src="src" v-bind="$attrs" />' } },
    },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("FlashcardDeckCard", () => {
  describe("rendering", () => {
    it("shows the title and subtitle", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("flashcard-deck-card-title")).text()).toBe("Oops");
      expect(wrapper.get(sel("flashcard-deck-card-subtitle")).text()).toBe("Difficult vocabulary");
    });

    it("shows the icon, hidden from screen readers", () => {
      const wrapper = factory();

      const icon = wrapper.get(sel("flashcard-deck-card-icon"));
      expect(icon.classes()).toEqual(
        expect.arrayContaining(["fa-regular", "fa-triangle-exclamation"]),
      );
      expect(icon.attributes("aria-hidden")).toBe("true");
    });

    it("shows the illustration as decoration", () => {
      const wrapper = factory();

      const image = wrapper.get(sel("flashcard-deck-card-image"));
      expect(image.attributes("src")).toBe("/img/flashcards/difficult.png");
      expect(image.attributes("alt")).toBe("");
    });

    it("applies the class matching the status", () => {
      const wrapper = factory({ status: "mastered" });

      expect(wrapper.get(sel("flashcard-deck-card")).classes()).toContain(
        "flashcard-deck-card--mastered",
      );
    });
  });

  describe("count", () => {
    it.each([
      [0, "0 Expressions"],
      [1, "1 Expression"],
      [22, "22 Expressions"],
    ])("shows %p as %p", (count, expected) => {
      const wrapper = factory({ count });

      expect(wrapper.get(sel("flashcard-deck-card-count")).text()).toBe(expected);
    });

    it("shows a dash while the count is unknown", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("flashcard-deck-card-count")).text()).toBe("– Expressions");
    });
  });
});
