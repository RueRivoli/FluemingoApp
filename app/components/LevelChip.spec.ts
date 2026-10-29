/**
 * @file Unit tests for LevelChip.
 *
 * Covers:
 * - Border in the level colour for every CEFR level, whatever the casing
 * - Neutral border for "All" and unknown levels
 * - Pastel fill when selected, white otherwise
 * - Light (compact) version: smaller padding and text only when set
 * - Label forwarded to the PrimeVue Chip
 */
import { mount } from "@vue/test-utils";
import LevelChip from "./LevelChip.vue";

interface FactoryProps {
  level?: string;
  selected?: boolean;
  label?: string;
  light?: boolean;
}

/** Mounts LevelChip for B1, unselected; override per test. */
function factory(props: FactoryProps = {}) {
  return mount(LevelChip, { props: { level: "B1", label: "B1", ...props } });
}

const CHIP = '[data-testid="level-chip"]';

describe("LevelChip", () => {
  describe("border", () => {
    it.each([
      ["A1", "border-cefr-a1/60"],
      ["A2", "border-cefr-a2/60"],
      ["B1", "border-cefr-b1/60"],
      ["B2", "border-cefr-b2/60"],
      ["C1", "border-cefr-c1/60"],
    ])("uses the %s colour for the border", (level, borderClass) => {
      const wrapper = factory({ level });

      expect(wrapper.get(CHIP).classes()).toContain(borderClass);
    });

    it("matches the level whatever its casing", () => {
      const wrapper = factory({ level: "b2" });

      expect(wrapper.get(CHIP).classes()).toContain("border-cefr-b2/60");
    });

    it("keeps the level border when selected", () => {
      const wrapper = factory({ level: "C1", selected: true });

      expect(wrapper.get(CHIP).classes()).toContain("border-cefr-c1/60");
    });

    it.each(["All", "D1"])('uses a neutral border for "%s"', (level) => {
      const wrapper = factory({ level });

      expect(wrapper.get(CHIP).classes()).toContain("border-outline/30");
    });
  });

  describe("fill", () => {
    it("is white when not selected", () => {
      const wrapper = factory({ selected: false });

      expect(wrapper.get(CHIP).classes()).toContain("bg-white");
    });

    it("uses the pastel level colour when selected", () => {
      const wrapper = factory({ level: "A2", selected: true });

      expect(wrapper.get(CHIP).classes()).toContain("bg-cefr-a2-pastel");
    });

    it('uses the primary pastel when "All" is selected', () => {
      const wrapper = factory({ level: "All", selected: true });

      expect(wrapper.get(CHIP).classes()).toContain("bg-primary-pastel");
    });
  });

  describe("light version", () => {
    it("keeps the default size when light is not set", () => {
      const wrapper = factory();

      expect(wrapper.get(CHIP).classes()).not.toContain("text-xs");
    });

    it("uses smaller padding and text when light is set", () => {
      const wrapper = factory({ light: true });

      expect(wrapper.get(CHIP).classes()).toEqual(
        expect.arrayContaining(["px-[7px]", "py-[3px]", "text-xs"]),
      );
    });
  });

  describe("label", () => {
    it("shows the label given to the chip", () => {
      const wrapper = factory({ label: "B1" });

      expect(wrapper.get(CHIP).text()).toBe("B1");
    });
  });
});
