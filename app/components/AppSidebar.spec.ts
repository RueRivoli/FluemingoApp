/**
 * @file Unit tests for AppSidebar.
 *
 * Covers:
 * - Expanded by default: user badge, link labels, "Log out" label
 * - Toggle button: updates v-model:collapsed, label and aria-expanded follow the state
 * - Collapsed: avatar only, labels moved to aria-label/title, icon-only log out
 * - Active link marked from the current route
 * - Log out: signs out then goes to the auth page, even when sign-out fails
 */
import { defineComponent, h } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { navigateTo, useRoute } from "#imports";
import { AUTH_PATH } from "~/utils/constants";
import AppSidebar from "./AppSidebar.vue";

const store = {
  isProfileLoading: false,
  fullName: "Marie Curie",
  avatarUrl: "avatar.png",
  signOut: jest.fn(),
};
// The real store reaches Supabase: the sidebar only needs these fields.
jest.mock("~/stores/user", () => ({ useUserStore: () => store }));

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

// PrimeVue's Menu is registered globally by the Nuxt module: this stub renders
// the #item slot for each entry, like the real menu does.
const MenuStub = defineComponent({
  props: { model: { type: Array, required: true } },
  setup(props, { slots }) {
    return () =>
      h(
        "div",
        (props.model as { items: MenuItem[] }[])
          .flatMap((group) => group.items)
          .map((item) => slots.item?.({ item, props: { action: {} } })),
      );
  },
});

const ButtonStub = defineComponent({
  props: ["label", "icon", "loading"],
  emits: ["click"],
  template: '<button :data-icon="icon" @click="$emit(\'click\')">{{ label }}</button>',
});

/** Mounts AppSidebar expanded on the Videos page; override props per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(AppSidebar, {
    props,
    global: {
      stubs: {
        Menu: MenuStub,
        Button: ButtonStub,
        Skeleton: true,
        UserAvatar: true,
        UserBadge: true,
        NuxtLink: { props: ["to"], template: '<a :href="to"><slot /></a>' },
      },
    },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("AppSidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.isProfileLoading = false;
    jest.mocked(useRoute).mockReturnValue({ path: "/app/browse/videos/", params: {}, query: {} });
  });

  describe("expanded (default)", () => {
    it("shows the user badge, not the lone avatar", () => {
      const wrapper = factory();

      expect(wrapper.find(sel("app-sidebar-badge")).exists()).toBe(true);
      expect(wrapper.find(sel("app-sidebar-avatar")).exists()).toBe(false);
    });

    it("shows the label of every link", () => {
      const labels = factory()
        .findAll(sel("app-sidebar-link-label"))
        .map((label) => label.text());

      expect(labels).toEqual(["Videos", "Audiobooks", "Articles", "Flashcards"]);
    });

    it('shows the "Log out" label', () => {
      expect(factory().get(sel("app-sidebar-logout")).text()).toBe("Log out");
    });

    it("marks the link of the current page as active, ignoring a trailing slash", () => {
      const active = factory().findAll(sel("app-sidebar-link")).filter((link) =>
        link.classes().includes("active"),
      );

      expect(active.map((link) => link.attributes("href"))).toEqual(["/app/browse/videos"]);
    });
  });

  describe("toggle", () => {
    it("asks to collapse the sidebar", async () => {
      const wrapper = factory();

      await wrapper.get(sel("app-sidebar-toggle")).trigger("click");

      expect(wrapper.emitted("update:collapsed")).toEqual([[true]]);
    });

    it("asks to expand a collapsed sidebar", async () => {
      const wrapper = factory({ collapsed: true });

      await wrapper.get(sel("app-sidebar-toggle")).trigger("click");

      expect(wrapper.emitted("update:collapsed")).toEqual([[false]]);
    });

    it.each([
      [false, "Collapse sidebar", "true"],
      [true, "Expand sidebar", "false"],
    ])("when collapsed is %s, is labelled %s with aria-expanded %s", (collapsed, label, expanded) => {
      const toggle = factory({ collapsed }).get(sel("app-sidebar-toggle"));

      expect(toggle.attributes("aria-label")).toBe(label);
      expect(toggle.attributes("aria-expanded")).toBe(expanded);
    });
  });

  describe("collapsed", () => {
    it("shows only the avatar", () => {
      const wrapper = factory({ collapsed: true });

      expect(wrapper.find(sel("app-sidebar-avatar")).exists()).toBe(true);
      expect(wrapper.find(sel("app-sidebar-badge")).exists()).toBe(false);
    });

    it("moves the link labels to aria-label and title", () => {
      const wrapper = factory({ collapsed: true });
      const firstLink = wrapper.findAll(sel("app-sidebar-link"))[0];

      expect(wrapper.find(sel("app-sidebar-link-label")).exists()).toBe(false);
      expect(firstLink?.attributes("aria-label")).toBe("Videos");
      expect(firstLink?.attributes("title")).toBe("Videos");
    });

    it("turns log out into an icon button with an accessible name", () => {
      const logout = factory({ collapsed: true }).get(sel("app-sidebar-logout"));

      expect(logout.text()).toBe("");
      expect(logout.attributes("aria-label")).toBe("Log out");
      expect(logout.attributes("data-icon")).toContain("fa-arrow-right-from-bracket");
    });
  });

  describe("log out", () => {
    it("signs out then goes to the auth page", async () => {
      const wrapper = factory();

      await wrapper.get(sel("app-sidebar-logout")).trigger("click");
      await flushPromises();

      expect(store.signOut).toHaveBeenCalled();
      expect(navigateTo).toHaveBeenCalledWith(AUTH_PATH, { replace: true });
    });

    it("still leaves the app when signing out fails", async () => {
      store.signOut.mockRejectedValueOnce(new Error("offline"));
      // logOut rethrows after redirecting; catch it so the test only checks the redirect.
      const onError = jest.fn();
      const wrapper = mount(AppSidebar, {
        global: {
          config: { errorHandler: onError },
          stubs: {
            Menu: MenuStub,
            Button: ButtonStub,
            Skeleton: true,
            UserAvatar: true,
            UserBadge: true,
            NuxtLink: true,
          },
        },
      });

      await wrapper.get(sel("app-sidebar-logout")).trigger("click");
      await flushPromises();

      expect(navigateTo).toHaveBeenCalledWith(AUTH_PATH, { replace: true });
    });
  });
});
