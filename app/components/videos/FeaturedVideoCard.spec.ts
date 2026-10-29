/**
 * @file Unit tests for FeaturedVideoCard.
 *
 * Covers:
 * - Title and "Watch now" always shown
 * - Optional parts shown only when known: NEW badge, category chip (label + icon),
 *   channel, description, level, meta chips (length, subtitles, speech rate)
 * - "select" from the thumbnail and from "Watch now", not from the heart
 * - Locked content: "lockedClick" re-emitted
 */
import { mount } from "@vue/test-utils";
import { videoInfo } from "~~/tests/fixtures/video";
import { VIDEO_CATEGORIES } from "~/utils/videos";
import FeaturedVideoCard from "./FeaturedVideoCard.vue";

/** Mounts FeaturedVideoCard with a bare video; override the video or the props per test. */
function factory(video: Parameters<typeof videoInfo>[0] = {}, props: Record<string, unknown> = {}) {
  return mount(FeaturedVideoCard, {
    props: { video: videoInfo(video), ...props },
    global: {
      // NuxtImg is a Nuxt global, not registered in Jest: render a plain <img>.
      stubs: { NuxtImg: { props: ["src"], template: '<img :src="src" v-bind="$attrs" />' } },
    },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("FeaturedVideoCard", () => {
  describe("default render", () => {
    it("shows the title and the Watch now button", () => {
      const wrapper = factory({ category: null });

      expect(wrapper.get(sel("featured-video-card-title")).text()).toBe(
        "Ma routine du matin, en français lent",
      );
      expect(wrapper.get(sel("base-button")).text()).toBe("Watch now");
    });

    it.each([
      "new-chip",
      "content-category-chip",
      "video-channel",
      "featured-video-card-description",
      "level-chip",
      "video-meta-chip",
    ])("does not render %s when its data is missing", (testId) => {
      expect(factory({ category: null }).find(sel(testId)).exists()).toBe(false);
    });
  });

  describe("optional parts", () => {
    it("shows the NEW badge", () => {
      expect(factory({ isNew: true }).find(sel("new-chip")).exists()).toBe(true);
    });

    it("shows the category with its label and icon", () => {
      const wrapper = factory({ category: "SlowFrench" });

      expect(wrapper.get(sel("content-category-chip-label")).text()).toBe("Slow French");
      expect(wrapper.get(sel("content-category-chip-icon")).classes()).toEqual(
        expect.arrayContaining(VIDEO_CATEGORIES.SlowFrench.icon.split(" ")),
      );
    });

    it("shows the channel, description and level", () => {
      const wrapper = factory({ channel: "Slow French Café", description: "Suivez Camille.", level: "B1" });

      expect(wrapper.get(sel("video-channel-name")).text()).toBe("Slow French Café");
      expect(wrapper.get(sel("featured-video-card-description")).text()).toBe("Suivez Camille.");
      expect(wrapper.get(sel("level-chip")).text()).toBe("B1");
    });

    it("shows the length, subtitles and speech rate chips", () => {
      const wrapper = factory({ duration: 860, subtitles: "native", speechRate: "slow" });

      const labels = wrapper.findAll(sel("video-meta-chip-label")).map((chip) => chip.text());

      expect(labels).toEqual(["14 min", "FR subtitles", "Slow"]);
    });
  });

  describe("events", () => {
    it('emits "select" when the thumbnail is clicked', async () => {
      const wrapper = factory();

      await wrapper.get(sel("featured-video-card-cover")).trigger("click");

      expect(wrapper.emitted("select")).toHaveLength(1);
    });

    it('emits "select" when Watch now is clicked', async () => {
      const wrapper = factory();

      await wrapper.get(sel("base-button")).trigger("click");

      expect(wrapper.emitted("select")).toHaveLength(1);
    });

    it('toggles the favorite without emitting "select"', async () => {
      const wrapper = factory();

      await wrapper.get(sel("favorite-toggle-button")).trigger("click");

      expect(wrapper.emitted("update:favorite")).toEqual([[true]]);
      expect(wrapper.emitted("select")).toBeUndefined();
    });

    it('re-emits "lockedClick" from a locked heart', async () => {
      const wrapper = factory({}, { locked: true });

      await wrapper.get(sel("favorite-toggle-button")).trigger("click");

      expect(wrapper.emitted("lockedClick")).toHaveLength(1);
    });
  });
});
