/**
 * @file Unit tests for VideoFilterChip.
 *
 * Covers:
 * - Rendering of the label, with or without an icon
 * - Active state: class and aria-pressed
 * - "click" emission
 */
import { mount } from "@vue/test-utils";
import VideoFilterChip from "./VideoFilterChip.vue";

/** Mounts VideoFilterChip labelled "Vlogs"; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(VideoFilterChip, { props: { label: "Vlogs", ...props } });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("VideoFilterChip", () => {
  describe("rendering", () => {
    it("shows the label", () => {
      expect(factory().get(sel("video-filter-chip-label")).text()).toBe("Vlogs");
    });

    it("has no icon by default", () => {
      expect(factory().find(sel("video-filter-chip-icon")).exists()).toBe(false);
    });

    it("shows the icon, hidden from screen readers", () => {
      const icon = factory({ icon: "fa-solid fa-video" }).get(sel("video-filter-chip-icon"));

      expect(icon.classes()).toEqual(expect.arrayContaining(["fa-solid", "fa-video"]));
      expect(icon.attributes("aria-hidden")).toBe("true");
    });
  });

  describe("active state", () => {
    it("is not pressed by default", () => {
      const chip = factory().get(sel("video-filter-chip"));

      expect(chip.attributes("aria-pressed")).toBe("false");
      expect(chip.classes()).not.toContain("video-filter-chip--active");
    });

    it("is pressed and tinted when active", () => {
      const chip = factory({ active: true }).get(sel("video-filter-chip"));

      expect(chip.attributes("aria-pressed")).toBe("true");
      expect(chip.classes()).toContain("video-filter-chip--active");
    });
  });

  describe("events", () => {
    it('emits "click" when clicked', async () => {
      const wrapper = factory();

      await wrapper.get(sel("video-filter-chip")).trigger("click");

      expect(wrapper.emitted("click")).toHaveLength(1);
    });
  });
});
