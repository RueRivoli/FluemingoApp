/**
 * @file Unit tests for VideoMetaChip.
 *
 * Covers:
 * - Rendering of the label and the decorative icon
 * - Size class: "sm" by default, "md" when asked
 */
import { mount } from "@vue/test-utils";
import VideoMetaChip from "./VideoMetaChip.vue";

/** Mounts a subtitles VideoMetaChip; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(VideoMetaChip, {
    props: { icon: "fa-regular fa-closed-captioning", label: "FR subtitles", ...props },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("VideoMetaChip", () => {
  describe("rendering", () => {
    it("shows the label", () => {
      expect(factory().get(sel("video-meta-chip-label")).text()).toBe("FR subtitles");
    });

    it("shows the icon, hidden from screen readers", () => {
      const icon = factory().get(sel("video-meta-chip-icon"));

      expect(icon.classes()).toEqual(
        expect.arrayContaining(["fa-regular", "fa-closed-captioning"]),
      );
      expect(icon.attributes("aria-hidden")).toBe("true");
    });
  });

  describe("size", () => {
    it("is small by default", () => {
      expect(factory().get(sel("video-meta-chip")).classes()).toContain("video-meta-chip--sm");
    });

    it("applies the md size", () => {
      expect(factory({ size: "md" }).get(sel("video-meta-chip")).classes()).toContain(
        "video-meta-chip--md",
      );
    });
  });
});
