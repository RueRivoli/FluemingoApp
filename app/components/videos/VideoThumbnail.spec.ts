/**
 * @file Unit tests for VideoThumbnail.
 *
 * Covers:
 * - Image shown only when a URL is given (gradient placeholder otherwise)
 * - Length badge formatted, hidden when unknown
 * - Size class
 * - Default slot for overlays
 */
import { mount } from "@vue/test-utils";
import VideoThumbnail from "./VideoThumbnail.vue";

/** Mounts VideoThumbnail with no props; override per test. */
function factory(props: Record<string, unknown> = {}, slot = "") {
  return mount(VideoThumbnail, {
    props,
    slots: { default: slot },
    global: {
      // NuxtImg is a Nuxt global, not registered in Jest: render a plain <img>.
      stubs: { NuxtImg: { props: ["src"], template: '<img :src="src" v-bind="$attrs" />' } },
    },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("VideoThumbnail", () => {
  describe("image", () => {
    it("shows no image when the URL is missing", () => {
      expect(factory().find(sel("video-thumbnail-image")).exists()).toBe(false);
    });

    it("shows the image", () => {
      const image = factory({ imageUrl: "https://cdn.test/thumb.jpg" }).get(
        sel("video-thumbnail-image"),
      );

      expect(image.attributes("src")).toBe("https://cdn.test/thumb.jpg");
    });
  });

  describe("length", () => {
    it("shows the formatted length", () => {
      expect(factory({ duration: 522 }).get(sel("video-thumbnail-duration")).text()).toBe(
        "8:42",
      );
    });

    it("hides the length when unknown", () => {
      expect(factory().find(sel("video-thumbnail-duration")).exists()).toBe(false);
    });
  });

  describe("size and slot", () => {
    it.each([
      [{}, "video-thumbnail--sm"],
      [{ size: "lg" }, "video-thumbnail--lg"],
    ])("applies the size class for %p", (props, expected) => {
      expect(factory(props).get(sel("video-thumbnail")).classes()).toContain(expected);
    });

    it("renders the overlays of the default slot", () => {
      const wrapper = factory({}, '<span data-testid="overlay">♥</span>');

      expect(wrapper.find(sel("overlay")).exists()).toBe(true);
    });
  });
});
