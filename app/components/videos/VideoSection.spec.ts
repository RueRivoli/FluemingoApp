/**
 * @file Unit tests for VideoSection.
 *
 * Covers:
 * - Title and icon of the category
 * - One VideoCard per video
 * - "See all" shown by default, hidden with showSeeAll false, emits "seeAll"
 * - "select" re-emitted with the activated video
 */
import { mount } from "@vue/test-utils";
import { videoInfo } from "~~/tests/fixtures/video";
import { VIDEO_CATEGORIES } from "~/utils/videos";
import VideoSection from "./VideoSection.vue";

const VIDEOS = [videoInfo({ id: 1, title: "Première" }), videoInfo({ id: 2, title: "Seconde" })];

/** Mounts a Vlogs VideoSection with two videos; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(VideoSection, {
    props: { category: "Vlogs", videos: VIDEOS, ...props },
    global: {
      // NuxtImg is a Nuxt global, not registered in Jest: render a plain <img>.
      stubs: { NuxtImg: { props: ["src"], template: '<img :src="src" v-bind="$attrs" />' } },
    },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("VideoSection", () => {
  describe("rendering", () => {
    it("titles the section with the category label and icon", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("video-section-title")).text()).toBe("Vlogs");
      expect(wrapper.get(sel("video-section-icon")).classes()).toEqual(
        expect.arrayContaining(VIDEO_CATEGORIES.Vlogs.icon.split(" ")),
      );
    });

    it("renders one card per video", () => {
      const titles = factory()
        .findAll(sel("video-card-title"))
        .map((title) => title.text());

      expect(titles).toEqual(["Première", "Seconde"]);
    });
  });

  describe("See all", () => {
    it('emits "seeAll" when clicked', async () => {
      const wrapper = factory();

      await wrapper.get(sel("video-section-see-all")).trigger("click");

      expect(wrapper.emitted("seeAll")).toHaveLength(1);
    });

    it("is hidden when showSeeAll is false", () => {
      expect(factory({ showSeeAll: false }).find(sel("video-section-see-all")).exists()).toBe(
        false,
      );
    });
  });

  describe("selection", () => {
    it('re-emits "select" with the activated video', async () => {
      const wrapper = factory();

      await wrapper.findAll(sel("video-card-cover"))[1]?.trigger("click");

      expect(wrapper.emitted("select")).toEqual([[VIDEOS[1]]]);
    });
  });
});
