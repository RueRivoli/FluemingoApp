/**
 * @file Unit tests for AudiobookCard.
 *
 * Covers:
 * - Default render: title and favorite heart, no optional parts
 * - Optional parts shown only when given: author, cover image, level, NEW badge
 * - v-model:favorite forwarded from the FavoriteToggleButton
 * - Locked content: lock shown, "lockedClick" re-emitted
 */
import { mount } from "@vue/test-utils";
import AudiobookCard from "./AudiobookCard.vue";

/** Mounts AudiobookCard with only a title; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(AudiobookCard, {
    props: { title: "La Belle et la Bête", ...props },
    global: {
      // NuxtImg is a Nuxt global, not registered in Jest: render a plain <img>.
      stubs: { NuxtImg: { props: ["src"], template: '<img :src="src" v-bind="$attrs" />' } },
    },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("AudiobookCard", () => {
  describe("default render", () => {
    it("shows the title", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("audiobook-card-title")).text()).toBe("La Belle et la Bête");
    });

    it("always shows the favorite heart", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("favorite-toggle-button-icon")).classes()).toContain("fa-heart");
    });

    it.each(["audiobook-card-author", "audiobook-card-image", "level-chip", "new-chip"])(
      "does not render %s when its prop is missing",
      (testId) => {
        const wrapper = factory();

        expect(wrapper.find(sel(testId)).exists()).toBe(false);
      },
    );
  });

  describe("optional parts", () => {
    it("shows the author", () => {
      const wrapper = factory({ author: "Antoine de Saint-Exupéry" });

      expect(wrapper.get(sel("audiobook-card-author")).text()).toBe("Antoine de Saint-Exupéry");
    });

    it("shows the cover image", () => {
      const wrapper = factory({ imageUrl: "https://cdn.test/cover.jpg" });

      expect(wrapper.get(sel("audiobook-card-image")).attributes("src")).toBe(
        "https://cdn.test/cover.jpg",
      );
    });

    it("shows the level chip, filled with the pastel level colour", () => {
      const wrapper = factory({ level: "A2" });

      const chip = wrapper.get(sel("level-chip"));

      expect(chip.text()).toBe("A2");
      expect(chip.classes()).toContain("bg-cefr-a2-pastel");
    });

    it("sizes the level chip like the one in ArticleCard", () => {
      const wrapper = factory({ level: "A2" });

      expect(wrapper.get(sel("level-chip")).classes()).toEqual(
        expect.arrayContaining(["px-2", "py-1"]),
      );
    });

    it("shows the NEW badge when the audiobook is new", () => {
      const wrapper = factory({ isNew: true });

      expect(wrapper.get(sel("new-chip-label")).text()).toBe("NEW");
    });
  });

  describe("favorite", () => {
    it("emits update:favorite when the heart is clicked", async () => {
      const wrapper = factory({ favorite: false });

      await wrapper.get(sel("favorite-toggle-button")).trigger("click");

      expect(wrapper.emitted("update:favorite")).toEqual([[true]]);
    });
  });

  describe("locked content", () => {
    it("shows a lock instead of the heart", () => {
      const wrapper = factory({ locked: true });

      expect(wrapper.get(sel("favorite-toggle-button-icon")).classes()).toContain("fa-lock");
    });

    it('re-emits "lockedClick" when the lock is clicked', async () => {
      const wrapper = factory({ locked: true });

      await wrapper.get(sel("favorite-toggle-button")).trigger("click");

      expect(wrapper.emitted("lockedClick")).toHaveLength(1);
    });
  });
});
