/**
 * @file Unit tests for FavoriteToggleButton.
 *
 * Covers:
 * - Icon per state: outline heart, solid heart (favorite), lock (locked)
 * - v-model: a click emits "update:modelValue" with the toggled value
 * - Locked state: emits "lockedClick" and never toggles
 * - Accessibility: label, aria-pressed, native button
 */
import { mount } from "@vue/test-utils";
import FavoriteToggleButton from "./FavoriteToggleButton.vue";

interface FactoryProps {
  modelValue?: boolean;
  locked?: boolean;
}

/** Mounts FavoriteToggleButton, not favorite and not locked by default. */
function factory(props: FactoryProps = {}) {
  return mount(FavoriteToggleButton, { props });
}

const BUTTON = '[data-testid="favorite-toggle-button"]';
const ICON = '[data-testid="favorite-toggle-button-icon"]';

describe("FavoriteToggleButton", () => {
  describe("rendering", () => {
    it.each([
      ["not favorite", {}, ["fa-regular", "fa-heart"]],
      ["favorite", { modelValue: true }, ["fa-solid", "fa-heart"]],
      ["locked", { locked: true }, ["fa-solid", "fa-lock"]],
    ] as const)("shows the right icon when %s", (_label, props, classes) => {
      const wrapper = factory(props);

      expect(wrapper.get(ICON).classes()).toEqual(expect.arrayContaining([...classes]));
    });

    it("shows the lock even when the content is a favorite", () => {
      const wrapper = factory({ modelValue: true, locked: true });

      expect(wrapper.get(ICON).classes()).toContain("fa-lock");
    });

    it("highlights the button when the content is a favorite", () => {
      const wrapper = factory({ modelValue: true });

      expect(wrapper.get(BUTTON).classes()).toContain("favorite-toggle-button--active");
    });
  });

  describe("toggling", () => {
    it.each([
      [false, true],
      [true, false],
    ])("emits update:modelValue with %s → %s when clicked", async (from, to) => {
      const wrapper = factory({ modelValue: from });

      await wrapper.get(BUTTON).trigger("click");

      expect(wrapper.emitted("update:modelValue")).toEqual([[to]]);
    });
  });

  describe("locked", () => {
    it('emits "lockedClick" when clicked', async () => {
      const wrapper = factory({ locked: true });

      await wrapper.get(BUTTON).trigger("click");

      expect(wrapper.emitted("lockedClick")).toHaveLength(1);
    });

    it("does not toggle the favorite state", async () => {
      const wrapper = factory({ locked: true, modelValue: false });

      await wrapper.get(BUTTON).trigger("click");

      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });
  });

  describe("accessibility", () => {
    it.each([
      ["not favorite", {}, "Add to favorites"],
      ["favorite", { modelValue: true }, "Remove from favorites"],
      ["locked", { locked: true }, "Locked content"],
    ] as const)('is labelled for screen readers when %s', (_label, props, expected) => {
      const wrapper = factory(props);

      expect(wrapper.get(BUTTON).attributes("aria-label")).toBe(expected);
    });

    it("reports the toggle state with aria-pressed", () => {
      const wrapper = factory({ modelValue: true });

      expect(wrapper.get(BUTTON).attributes("aria-pressed")).toBe("true");
    });

    it("omits aria-pressed when locked, since it is no longer a toggle", () => {
      const wrapper = factory({ locked: true });

      expect(wrapper.get(BUTTON).attributes("aria-pressed")).toBeUndefined();
    });

    it("is a native button, so it is reachable with the keyboard", () => {
      const wrapper = factory();

      expect(wrapper.get(BUTTON).element.tagName).toBe("BUTTON");
      expect(wrapper.get(BUTTON).attributes("type")).toBe("button");
    });

    it("hides the icon from screen readers", () => {
      const wrapper = factory();

      expect(wrapper.get(ICON).attributes("aria-hidden")).toBe("true");
    });
  });
});
