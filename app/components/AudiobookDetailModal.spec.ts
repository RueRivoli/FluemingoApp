/**
 * @file Unit tests for AudiobookDetailModal.
 *
 * Covers:
 * - Hidden when not visible; dialog semantics (role, aria-modal, labelled by the title)
 * - Content: title, optional author / description / image / status / NEW badge / chips
 * - Chapters: rows, loading and error states passed to the list
 * - Closing: ✕ button, Escape, backdrop click (not a click inside the dialog)
 * - Focus moved to the close button on open
 * - Actions: "startReading", v-model:favorite, "lockedClick"; no Download button
 */
import { flushPromises, mount } from "@vue/test-utils";
import { audiobookChapter } from "../../tests/fixtures/audiobook";
import AudiobookDetailModal from "./AudiobookDetailModal.vue";

/** Mounts an open AudiobookDetailModal with only a title; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(AudiobookDetailModal, {
    props: { visible: true, title: "Le Petit Prince", ...props },
    attachTo: document.body,
    global: {
      // Render in place so the wrapper can find the dialog's elements.
      stubs: {
        teleport: true,
        // NuxtImg is a Nuxt global, not registered in Jest: render a plain <img>.
        NuxtImg: { props: ["src"], template: '<img :src="src" v-bind="$attrs" />' },
      },
    },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

afterEach(() => {
  document.body.innerHTML = "";
});

describe("AudiobookDetailModal", () => {
  describe("visibility", () => {
    it("renders nothing when not visible", () => {
      const wrapper = factory({ visible: false });

      expect(wrapper.find(sel("audiobook-detail-modal")).exists()).toBe(false);
    });

    it("is a modal dialog labelled by the audiobook title", () => {
      const wrapper = factory();

      const dialog = wrapper.get(sel("audiobook-detail-modal"));
      expect(dialog.attributes("role")).toBe("dialog");
      expect(dialog.attributes("aria-modal")).toBe("true");
      expect(wrapper.get(`#${dialog.attributes("aria-labelledby")}`).text()).toBe(
        "Le Petit Prince",
      );
    });

    it("moves focus to the close button when opened", async () => {
      const wrapper = factory();
      await flushPromises();

      expect(document.activeElement).toBe(
        wrapper.get(sel("audiobook-detail-modal-close")).element,
      );
    });
  });

  describe("content", () => {
    it("shows the title", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("audiobook-detail-modal-title")).text()).toBe("Le Petit Prince");
    });

    it.each([
      ["audiobook-detail-modal-author", { author: "Antoine de Saint-Exupéry" }, "Antoine de Saint-Exupéry"],
      ["audiobook-detail-modal-description", { description: "A pilot stranded…" }, "A pilot stranded…"],
      ["content-status-badge", { status: "in_progress" }, "In progress"],
      ["new-chip", { isNew: true }, "NEW"],
    ])("shows %s when its prop is given", (testId, props, expected) => {
      const wrapper = factory(props);

      expect(wrapper.get(sel(testId)).text()).toContain(expected);
    });

    it.each([
      "audiobook-detail-modal-author",
      "audiobook-detail-modal-description",
      "audiobook-detail-modal-image",
      "content-status-badge",
      "level-chip",
      "new-chip",
    ])("does not render %s when its prop is missing", (testId) => {
      const wrapper = factory();

      expect(wrapper.find(sel(testId)).exists()).toBe(false);
    });

    it("shows the cover image", () => {
      const wrapper = factory({ imageUrl: "https://cdn.test/cover.jpg" });

      expect(wrapper.get(sel("audiobook-detail-modal-image")).attributes("src")).toBe(
        "https://cdn.test/cover.jpg",
      );
    });

    it("shows the level chip then one chip per theme", () => {
      const wrapper = factory({
        level: "A2",
        themes: [
          { id: "literature", label: "Literature", icon: "fa-regular fa-book" },
          { id: "philosophy", label: "Philosophy", icon: "fa-regular fa-book-open" },
        ],
      });

      const chips = wrapper.get(sel("audiobook-detail-modal-chips"));
      expect(chips.get(sel("level-chip")).text()).toBe("A2");
      expect(chips.findAll(sel("theme-chip-label")).map((label) => label.text())).toEqual([
        "Literature",
        "Philosophy",
      ]);
    });
  });

  describe("chapters", () => {
    it("shows one row per chapter", () => {
      const wrapper = factory({
        chapters: [audiobookChapter({ id: 1 }), audiobookChapter({ id: 2 })],
      });

      expect(wrapper.findAll(sel("chapter-row"))).toHaveLength(2);
    });

    it("shows the loading state while the chapters are fetched", () => {
      const wrapper = factory({ isLoadingChapters: true });

      expect(wrapper.find(sel("chapter-list-loading")).exists()).toBe(true);
    });

    it("shows the error state when the chapters could not be loaded", () => {
      const wrapper = factory({ hasChaptersError: true });

      expect(wrapper.find(sel("chapter-list-error")).exists()).toBe(true);
    });
  });

  describe("closing", () => {
    it("closes when the ✕ button is clicked", async () => {
      const wrapper = factory();

      await wrapper.get(sel("audiobook-detail-modal-close")).trigger("click");

      expect(wrapper.emitted("update:visible")).toEqual([[false]]);
    });

    it("closes on Escape", async () => {
      const wrapper = factory();
      await flushPromises();

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

      expect(wrapper.emitted("update:visible")).toEqual([[false]]);
    });

    it("ignores other keys", async () => {
      const wrapper = factory();
      await flushPromises();

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

      expect(wrapper.emitted("update:visible")).toBeUndefined();
    });

    it("closes when the backdrop is clicked", async () => {
      const wrapper = factory();

      await wrapper.get(sel("audiobook-detail-modal-backdrop")).trigger("click");

      expect(wrapper.emitted("update:visible")).toEqual([[false]]);
    });

    it("stays open when the dialog itself is clicked", async () => {
      const wrapper = factory();

      await wrapper.get(sel("audiobook-detail-modal")).trigger("click");

      expect(wrapper.emitted("update:visible")).toBeUndefined();
    });

    it("stops listening to Escape once unmounted", async () => {
      const wrapper = factory();
      await flushPromises();
      wrapper.unmount();

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

      expect(wrapper.emitted("update:visible")).toBeUndefined();
    });
  });

  describe("actions", () => {
    it('emits "startReading" from the Start Reading button', async () => {
      const wrapper = factory();

      await wrapper.get(sel("audiobook-detail-modal-start-reading")).trigger("click");

      expect(wrapper.emitted("startReading")).toHaveLength(1);
    });

    it("shows the open-book icon on the Start Reading button", () => {
      const wrapper = factory();

      const icon = wrapper.get(
        `${sel("audiobook-detail-modal-start-reading")} ${sel("base-button-icon")}`,
      );
      expect(icon.classes()).toEqual(expect.arrayContaining(["fa-regular", "fa-book-open"]));
    });

    it("has no Download button", () => {
      const wrapper = factory();

      expect(wrapper.find(sel("audiobook-detail-modal-download")).exists()).toBe(false);
      expect(wrapper.text()).not.toContain("Download");
    });

    it("emits update:favorite when the heart is clicked", async () => {
      const wrapper = factory({ favorite: false });

      await wrapper.get(sel("favorite-toggle-button")).trigger("click");

      expect(wrapper.emitted("update:favorite")).toEqual([[true]]);
    });

    it('re-emits "lockedClick" when the lock is clicked on gated content', async () => {
      const wrapper = factory({ locked: true });

      await wrapper.get(sel("favorite-toggle-button")).trigger("click");

      expect(wrapper.emitted("lockedClick")).toHaveLength(1);
      expect(wrapper.emitted("update:favorite")).toBeUndefined();
    });
  });
});
