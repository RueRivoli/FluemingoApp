/**
 * @file Unit tests for VideoChannelSection.
 *
 * Covers:
 * - Heading with the channel name, "Other channels" when unknown
 * - Video count, singular and plural
 * - One VideoCard per video, without repeating the channel on the cards
 * - "select" re-emitted with the activated video
 */
import { mount } from "@vue/test-utils";
import { videoInfo } from "~~/tests/fixtures/video";
import VideoChannelSection from "./VideoChannelSection.vue";

const VIDEOS = [
  videoInfo({ id: 1, title: "Première", channel: "Easy French" }),
  videoInfo({ id: 2, title: "Seconde", channel: "Easy French" }),
];

/** Mounts the Easy French section with two videos; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(VideoChannelSection, {
    props: { channel: "Easy French", videos: VIDEOS, ...props },
    global: {
      // NuxtImg is a Nuxt global, not registered in Jest: render a plain <img>.
      stubs: { NuxtImg: { props: ["src"], template: '<img :src="src" v-bind="$attrs" />' } },
    },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("VideoChannelSection", () => {
  describe("heading", () => {
    it("shows the channel name", () => {
      expect(factory().get(sel("video-channel-section-title")).text()).toBe("Easy French");
    });

    it('shows "Other channels" when the channel is unknown', () => {
      const wrapper = factory({ channel: null });

      expect(wrapper.get(sel("video-channel-section-title")).text()).toBe("Other channels");
    });

    it("labels the section with its heading", () => {
      const wrapper = factory();
      const headingId = wrapper.get(sel("video-channel-section-title")).attributes("id");

      expect(wrapper.get(sel("video-channel-section")).attributes("aria-labelledby")).toBe(
        headingId,
      );
    });
  });

  describe("count", () => {
    it("counts the videos", () => {
      expect(factory().get(sel("video-channel-section-count")).text()).toBe("2 videos");
    });

    it("uses the singular for one video", () => {
      const wrapper = factory({ videos: [VIDEOS[0]] });

      expect(wrapper.get(sel("video-channel-section-count")).text()).toBe("1 video");
    });
  });

  describe("videos", () => {
    it("renders one card per video", () => {
      expect(factory().findAll(sel("video-card"))).toHaveLength(2);
    });

    it("does not repeat the channel on the cards", () => {
      // The only channel shown is the one in the heading.
      expect(factory().findAll(sel("video-channel"))).toHaveLength(1);
    });

    it('re-emits "select" with the activated video', async () => {
      const wrapper = factory();

      await wrapper.findAll(sel("video-card-cover"))[1]?.trigger("click");

      expect(wrapper.emitted("select")).toEqual([[VIDEOS[1]]]);
    });
  });
});
