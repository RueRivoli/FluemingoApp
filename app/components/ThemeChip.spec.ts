/**
 * @file Unit tests for ThemeChip.
 *
 * Covers:
 * - Rendering of the label
 * - Optional icon: classes applied when given, absent otherwise
 * - Light (compact) version only when the light prop is set
 * - Icon hidden from assistive technologies
 */
import { mount } from "@vue/test-utils";
import ThemeChip from "./ThemeChip.vue";

interface FactoryProps {
  label?: string;
  icon?: string;
  light?: boolean;
}

/** Mounts ThemeChip with a default label and no icon; override per test. */
function factory(props: FactoryProps = {}) {
  return mount(ThemeChip, { props: { label: "News", ...props } });
}

const ICON = '[data-testid="theme-chip-icon"]';

describe("ThemeChip", () => {
  describe("rendering", () => {
    it("shows the label", () => {
      const wrapper = factory({ label: "Education" });

      expect(wrapper.get('[data-testid="theme-chip-label"]').text()).toBe("Education");
    });

    it("shows no icon when none is given", () => {
      const wrapper = factory();

      expect(wrapper.find(ICON).exists()).toBe(false);
    });

    it("applies the Font Awesome classes of the icon prop", () => {
      const wrapper = factory({ icon: "fa-regular fa-newspaper" });

      expect(wrapper.get(ICON).classes()).toEqual(
        expect.arrayContaining(["fa-regular", "fa-newspaper"]),
      );
    });
  });

  describe("light version", () => {
    it("is not light by default", () => {
      const wrapper = factory();

      expect(wrapper.get('[data-testid="theme-chip"]').classes()).not.toContain(
        "theme-chip--light",
      );
    });

    it("applies the light class when light is set", () => {
      const wrapper = factory({ light: true });

      expect(wrapper.get('[data-testid="theme-chip"]').classes()).toContain("theme-chip--light");
    });
  });

  describe("accessibility", () => {
    it("hides the decorative icon from screen readers", () => {
      const wrapper = factory({ icon: "fa-regular fa-newspaper" });

      expect(wrapper.get(ICON).attributes("aria-hidden")).toBe("true");
    });
  });
});
