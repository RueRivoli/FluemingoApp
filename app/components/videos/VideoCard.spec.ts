/**
 * @file Unit tests for VideoCard.
 *
 * Covers:
 * - Default render: title and favorite heart, no optional parts
 * - No NEW badge (only the FeaturedVideoCard shows it)
 * - Optional parts shown only when known: channel, level, length,
 *   subtitles / speech-rate chips
 * - Level, category and theme chips in their light (compact) version
 * - showChannel false hides the channel
 * - Watch progress bar: width, clamped, hidden at 0 or null
 * - v-model:favorite and locked content
 * - Selection: "select" on thumbnail click / Enter / Space, not from the heart
 */
import { mount } from "@vue/test-utils";
import { videoInfo } from "~~/tests/fixtures/video";
import VideoCard from "./VideoCard.vue";

/** Mounts VideoCard with a bare video; override the video or the props per test. */
function factory(video: Parameters<typeof videoInfo>[0] = {}, props: Record<string, unknown> = {}) {
  return mount(VideoCard, {
    props: { video: videoInfo(video), ...props },
    global: {
      // NuxtImg is a Nuxt global, not registered in Jest: render a plain <img>.
      stubs: { NuxtImg: { props: ["src"], template: '<img :src="src" v-bind="$attrs" />' } },
    },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("VideoCard", () => {
  describe("default render", () => {
    it("shows the title", () => {
      expect(factory().get(sel("video-card-title")).text()).toBe(
        "Ma routine du matin, en français lent",
      );
    });

    it("always shows the favorite heart", () => {
      expect(factory().find(sel("favorite-toggle-button")).exists()).toBe(true);
    });

    it.each([
      "video-channel",
      "new-chip",
      "level-chip",
      "video-thumbnail-duration",
      "video-meta-chip",
      "video-card-progress",
    ])("does not render %s when its data is missing", (testId) => {
      expect(factory().find(sel(testId)).exists()).toBe(false);
    });
  });

  describe("optional parts", () => {
    it("shows the channel", () => {
      const wrapper = factory({ channel: "Slow French Café" });

      expect(wrapper.get(sel("video-channel-name")).text()).toBe("Slow French Café");
    });

    it("hides the channel when showChannel is false", () => {
      const wrapper = factory({ channel: "Slow French Café" }, { showChannel: false });

      expect(wrapper.find(sel("video-channel")).exists()).toBe(false);
    });

    it("never shows the NEW badge, even for a new video", () => {
      // NEW is only shown on the FeaturedVideoCard.
      expect(factory({ isNew: true }).find(sel("new-chip")).exists()).toBe(false);
    });

    it("shows the level", () => {
      expect(factory({ level: "B1" }).get(sel("level-chip")).text()).toBe("B1");
    });

    it("uses the light version of the level, category and theme chips", () => {
      const wrapper = factory({ level: "B1", category: "SlowFrench", theme1: "art" });

      expect(wrapper.get(sel("level-chip")).classes()).toContain("text-xs");
      expect(wrapper.get(sel("content-category-chip")).classes()).toContain(
        "content-category-chip--light",
      );
      expect(wrapper.get(sel("theme-chip")).classes()).toContain("theme-chip--light");
    });

    it("shows the length on the thumbnail", () => {
      expect(factory({ duration: 522 }).get(sel("video-thumbnail-duration")).text()).toBe(
        "8:42",
      );
    });

    it("shows the subtitles and speech-rate chips, without the length", () => {
      const wrapper = factory({ subtitles: "auto", speechRate: "fast", duration: 522 });

      const labels = wrapper.findAll(sel("video-meta-chip-label")).map((chip) => chip.text());

      expect(labels).toEqual(["Auto subtitles", "Fast"]);
    });
  });

  describe("progress", () => {
    it.each([
      [0.4, "40%"],
      [1.5, "100%"],
    ])("draws the bar for %p at %p", (progress, width) => {
      const bar = factory({}, { progress }).get(sel("video-card-progress"));

      expect(bar.attributes("style")).toContain(`width: ${width}`);
    });

    it("hides the bar at 0", () => {
      expect(factory({}, { progress: 0 }).find(sel("video-card-progress")).exists()).toBe(false);
    });
  });

  describe("favorite", () => {
    it("emits update:favorite when the heart is clicked", async () => {
      const wrapper = factory();

      await wrapper.get(sel("favorite-toggle-button")).trigger("click");

      expect(wrapper.emitted("update:favorite")).toEqual([[true]]);
    });

    it('re-emits "lockedClick" from a locked heart', async () => {
      const wrapper = factory({}, { locked: true });

      await wrapper.get(sel("favorite-toggle-button")).trigger("click");

      expect(wrapper.emitted("lockedClick")).toHaveLength(1);
    });
  });

  describe("selection", () => {
    it.each([
      ["click", {}],
      ["keydown", { key: "Enter" }],
      ["keydown", { key: " " }],
    ])('emits "select" on %s %p', async (event, options) => {
      const wrapper = factory();

      await wrapper.get(sel("video-card-cover")).trigger(event, options);

      expect(wrapper.emitted("select")).toHaveLength(1);
    });

    it('does not emit "select" when the heart is clicked', async () => {
      const wrapper = factory();

      await wrapper.get(sel("favorite-toggle-button")).trigger("click");

      expect(wrapper.emitted("select")).toBeUndefined();
    });
  });
});
