/**
 * @file Unit tests for ArticleDetailModal.
 *
 * Covers:
 * - Hidden when not visible; dialog semantics (role, aria-modal, labelled by the title)
 * - Content: title, optional translated title / description / image / badges / chips
 * - Closing: ✕ button, Escape, backdrop click (not a click inside the dialog)
 * - Focus moved to the close button on open
 * - Actions: "startReading", "download", v-model:favorite
 * - Vocabulary events re-emitted
 */
import { flushPromises, mount } from "@vue/test-utils";
import { vocabularyItem } from "../../tests/fixtures/vocabulary";
import ArticleDetailModal from "./ArticleDetailModal.vue";

const CRUE = vocabularyItem({ id: 1, text: "une crue", type: "nf", translation: "a flood", audioUrl: "https://cdn.test/crue.mp3" });


/** Mounts an open ArticleDetailModal with only a title; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(ArticleDetailModal, {
    props: { visible: true, title: "Nouvelle crue au Népal", ...props },
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

describe("ArticleDetailModal", () => {
  describe("visibility", () => {
    it("renders nothing when not visible", () => {
      const wrapper = factory({ visible: false });

      expect(wrapper.find(sel("article-detail-modal")).exists()).toBe(false);
    });

    it("is a modal dialog labelled by the article title", () => {
      const wrapper = factory();

      const dialog = wrapper.get(sel("article-detail-modal"));
      expect(dialog.attributes("role")).toBe("dialog");
      expect(dialog.attributes("aria-modal")).toBe("true");
      expect(wrapper.get(`#${dialog.attributes("aria-labelledby")}`).text()).toBe("Nouvelle crue au Népal");
    });

    it("moves focus to the close button when opened", async () => {
      const wrapper = factory();
      await flushPromises();

      expect(document.activeElement).toBe(wrapper.get(sel("article-detail-modal-close")).element);
    });
  });

  describe("content", () => {
    it("shows the title", () => {
      const wrapper = factory();

      expect(wrapper.get(sel("article-detail-modal-title")).text()).toBe("Nouvelle crue au Népal");
    });

    it.each([
      ["article-detail-modal-translated-title", { translatedTitle: "New Flooding in Nepal" }, "New Flooding in Nepal"],
      ["article-detail-modal-description", { description: "A new wave of mud…" }, "A new wave of mud…"],
      ["content-status-badge", { status: "in_progress" }, "In progress"],
      ["new-chip", { isNew: true }, "NEW"],
    ])("shows %s when its prop is given", (testId, props, expected) => {
      const wrapper = factory(props);

      expect(wrapper.get(sel(testId)).text()).toContain(expected);
    });

    it.each([
      "article-detail-modal-translated-title",
      "article-detail-modal-description",
      "article-detail-modal-image",
      "content-status-badge",
      "content-date-badge",
      "level-chip",
      "new-chip",
    ])("does not render %s when its prop is missing", (testId) => {
      const wrapper = factory();

      expect(wrapper.find(sel(testId)).exists()).toBe(false);
    });

    it("shows the cover image", () => {
      const wrapper = factory({ imageUrl: "https://cdn.test/cover.jpg" });

      expect(wrapper.get(sel("article-detail-modal-image")).attributes("src")).toBe("https://cdn.test/cover.jpg");
    });

    it("shows the level chip then one chip per theme", () => {
      const wrapper = factory({
        level: "B1",
        themes: [
          { id: "news", label: "News", icon: "fa-regular fa-newspaper" },
          { id: "nature", label: "Nature", icon: "fa-regular fa-leaf" },
        ],
      });

      const chips = wrapper.get(sel("article-detail-modal-chips"));
      expect(chips.get(sel("level-chip")).text()).toBe("B1");
      expect(chips.findAll(sel("theme-chip-label")).map((label) => label.text())).toEqual(["News", "Nature"]);
    });
  });

  describe("closing", () => {
    it("closes when the ✕ button is clicked", async () => {
      const wrapper = factory();

      await wrapper.get(sel("article-detail-modal-close")).trigger("click");

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

      await wrapper.get(sel("article-detail-modal-backdrop")).trigger("click");

      expect(wrapper.emitted("update:visible")).toEqual([[false]]);
    });

    it("stays open when the dialog itself is clicked", async () => {
      const wrapper = factory();

      await wrapper.get(sel("article-detail-modal")).trigger("click");

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
    it('emits "download" from the Download button', async () => {
      const wrapper = factory();

      await wrapper.get(sel("article-detail-modal-download")).trigger("click");

      expect(wrapper.emitted("download")).toHaveLength(1);
    });

    it('emits "startReading" from the Start Reading button', async () => {
      const wrapper = factory();

      await wrapper.get(sel("article-detail-modal-start-reading")).trigger("click");

      expect(wrapper.emitted("startReading")).toHaveLength(1);
    });

    it("shows the open-book icon on the Start Reading button", () => {
      const wrapper = factory();

      const icon = wrapper.get(`${sel("article-detail-modal-start-reading")} ${sel("base-button-icon")}`);
      expect(icon.classes()).toEqual(expect.arrayContaining(["fa-regular", "fa-book-open"]));
    });

    it("emits update:favorite when the heart is clicked", async () => {
      const wrapper = factory({ favorite: false });

      await wrapper.get(sel("favorite-toggle-button")).trigger("click");

      expect(wrapper.emitted("update:favorite")).toEqual([[true]]);
    });
  });

  describe("vocabulary", () => {
    it('re-emits "playAudio" with the word', async () => {
      const wrapper = factory({ mainWords: [CRUE] });

      await wrapper.get(sel("vocabulary-card-audio")).trigger("click");

      expect(wrapper.emitted("playAudio")).toEqual([[CRUE]]);
    });

    it('re-emits "toggleSaved" with the word and its new state', async () => {
      const wrapper = factory({ mainWords: [CRUE] });

      await wrapper.get(sel("vocabulary-card-save")).trigger("click");

      expect(wrapper.emitted("toggleSaved")).toEqual([[CRUE, true]]);
    });
  });
});
