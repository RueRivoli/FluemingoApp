/**
 * @file Unit tests for VideoChannel.
 *
 * Covers:
 * - Rendering of the channel name
 * - Avatar image when given, neutral placeholder otherwise
 * - Size class
 */
import { mount } from "@vue/test-utils";
import VideoChannel from "./VideoChannel.vue";

/** Mounts VideoChannel with a name only; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(VideoChannel, {
    props: { name: "Slow French Café", ...props },
    global: {
      // NuxtImg is a Nuxt global, not registered in Jest: render a plain <img>.
      stubs: { NuxtImg: { props: ["src"], template: '<img :src="src" v-bind="$attrs" />' } },
    },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("VideoChannel", () => {
  it("shows the channel name", () => {
    expect(factory().get(sel("video-channel-name")).text()).toBe("Slow French Café");
  });

  it("shows a placeholder when there is no avatar", () => {
    const wrapper = factory();

    expect(wrapper.find(sel("video-channel-avatar")).exists()).toBe(false);
    expect(wrapper.find(sel("video-channel-avatar-placeholder")).exists()).toBe(true);
  });

  it("shows the avatar image", () => {
    const wrapper = factory({ avatarUrl: "https://cdn.test/avatar.jpg" });

    expect(wrapper.get(sel("video-channel-avatar")).attributes("src")).toBe(
      "https://cdn.test/avatar.jpg",
    );
    expect(wrapper.find(sel("video-channel-avatar-placeholder")).exists()).toBe(false);
  });

  it.each([
    [{}, "video-channel--sm"],
    [{ size: "md" }, "video-channel--md"],
  ])("applies the size class for %p", (props, expected) => {
    expect(factory(props).get(sel("video-channel")).classes()).toContain(expected);
  });
});
