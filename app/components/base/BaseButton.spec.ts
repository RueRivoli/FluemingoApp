/**
 * @file Unit tests for BaseButton.
 *
 * Covers:
 * - Rendering of the slot content and variant class (primary by default)
 * - Optional leading icon
 * - "click" emitted when enabled, not when disabled
 */
import { mount } from "@vue/test-utils";
import BaseButton from "./BaseButton.vue";

/** Mounts BaseButton with a default label; override per test. */
function factory(props: Record<string, unknown> = {}, slot = "Start Reading") {
  return mount(BaseButton, { props, slots: { default: slot } });
}

const BUTTON = '[data-testid="base-button"]';
const ICON = '[data-testid="base-button-icon"]';

describe("BaseButton", () => {
  describe("rendering", () => {
    it("renders the slot content", () => {
      const wrapper = factory({}, "Download");

      expect(wrapper.get(BUTTON).text()).toBe("Download");
    });

    it("is a primary button by default", () => {
      const wrapper = factory();

      expect(wrapper.get(BUTTON).classes()).toContain("base-button--primary");
    });

    it("applies the class matching the variant prop", () => {
      const wrapper = factory({ variant: "outline" });

      expect(wrapper.get(BUTTON).classes()).toContain("base-button--outline");
    });

    it("has no icon by default", () => {
      const wrapper = factory();

      expect(wrapper.find(ICON).exists()).toBe(false);
    });

    it("shows the icon, hidden from assistive technologies", () => {
      const wrapper = factory({ icon: "fa-solid fa-download" });

      const icon = wrapper.get(ICON);
      expect(icon.classes()).toEqual(expect.arrayContaining(["fa-solid", "fa-download"]));
      expect(icon.attributes("aria-hidden")).toBe("true");
    });
  });

  describe("click behaviour", () => {
    it('emits "click" when clicked', async () => {
      const wrapper = factory();

      await wrapper.get(BUTTON).trigger("click");

      expect(wrapper.emitted("click")).toHaveLength(1);
    });

    it('does not emit "click" when disabled', async () => {
      const wrapper = factory({ disabled: true });

      await wrapper.get(BUTTON).trigger("click");

      expect(wrapper.emitted("click")).toBeUndefined();
    });
  });
});
