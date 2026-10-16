/**
 * @file Unit tests for ArticleCard.
 *
 * Covers:
 * - Default render: title, favorite button, no optional parts
 * - Optional parts shown only when given: description, cover image, status,
 *   date, category, level and themes (one chip per theme)
 * - v-model:favorite forwarded from the FavoriteToggleButton
 * - Locked content: lock shown, "lockedClick" re-emitted
 */
import { mount } from "@vue/test-utils";
import ArticleCard from "./ArticleCard.vue";
import type { ArticleCardTheme } from "~/types/article";

const THEMES: ArticleCardTheme[] = [
  { id: "news", label: "News", icon: "fa-regular fa-newspaper" },
  { id: "education", label: "Education" },
];

const FULL_PROPS = {
  title: "Un lycéen blessé, la France suspend les grenades",
  description: "In Lens, a 15-year-old high school student lost a hand.",
  imageUrl: "https://cdn.test/cover.jpg",
  level: "B1",
  publishedAt: "2026-10-07T12:00:00Z",
  status: "in_progress",
  category: { id: "Literature", icon: "fa-regular fa-book" },
  themes: THEMES,
} as const;

/** Mounts ArticleCard with only a title; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(ArticleCard, {
    props: { title: "Title", ...props },
    global: {
      // NuxtImg is a Nuxt global, not registered in Jest: render a plain <img>.
      stubs: {
        NuxtImg: {
          props: ["src"],
          template: '<img :src="src" v-bind="$attrs" />',
        },
      },
    },
  });
}

const sel = (id: string) => `[data-testid="${id}"]`;

describe("ArticleCard", () => {
  describe("default render", () => {
    it("shows the title", () => {
      const wrapper = factory({ title: FULL_PROPS.title });

      expect(wrapper.get(sel("article-card-title")).text()).toBe(
        FULL_PROPS.title,
      );
    });

    it("always shows the favorite button", () => {
      const wrapper = factory();

      expect(wrapper.find(sel("favorite-toggle-button")).exists()).toBe(true);
    });

    it.each([
      "article-card-description",
      "article-card-image",
      "content-status-badge",
      "content-date-badge",
      "content-category-chip",
      "article-card-chips",
    ])("does not render %s when its prop is missing", (testId) => {
      const wrapper = factory();

      expect(wrapper.find(sel(testId)).exists()).toBe(false);
    });
  });

  describe("optional parts", () => {
    it("shows the description", () => {
      const wrapper = factory({ description: FULL_PROPS.description });

      expect(wrapper.get(sel("article-card-description")).text()).toBe(
        FULL_PROPS.description,
      );
    });

    it("shows the cover image", () => {
      const wrapper = factory({ imageUrl: FULL_PROPS.imageUrl });

      expect(wrapper.get(sel("article-card-image")).attributes("src")).toBe(
        FULL_PROPS.imageUrl,
      );
    });

    it("shows the reading status", () => {
      const wrapper = factory({ status: "finished" });

      expect(wrapper.get(sel("content-status-badge-label")).text()).toBe(
        "Finished",
      );
    });

    it("shows the publication date", () => {
      const wrapper = factory({ publishedAt: FULL_PROPS.publishedAt });

      expect(wrapper.get(sel("content-date-badge-label")).text()).toBe(
        "Oct 7, 2026",
      );
    });

    it("shows the category chip", () => {
      const wrapper = factory({ category: FULL_PROPS.category });

      expect(wrapper.get(sel("content-category-chip-label")).text()).toBe(
        "Literature",
      );
    });

    it("shows the level chip", () => {
      const wrapper = factory({ level: "B1" });

      expect(wrapper.get(sel("level-chip")).text()).toBe("B1");
    });

    it("puts the level chip first in the chip row, before the themes", () => {
      const wrapper = factory({ level: "B1", themes: THEMES });

      const firstChip = wrapper.get(sel("article-card-chips")).element
        .firstElementChild;

      expect(firstChip?.getAttribute("data-testid")).toBe("level-chip");
    });

    it("shows one theme chip per theme, in order", () => {
      const wrapper = factory({ themes: THEMES });

      const labels = wrapper
        .findAll(sel("theme-chip-label"))
        .map((chip) => chip.text());

      expect(labels).toEqual(["News", "Education"]);
    });
  });

  describe("favorite", () => {
    it("emits update:favorite when the heart is clicked", async () => {
      const wrapper = factory({ favorite: false });

      await wrapper.get(sel("favorite-toggle-button")).trigger("click");

      expect(wrapper.emitted("update:favorite")).toEqual([[true]]);
    });
  });

  describe("locked content", () => {
    it("shows a lock instead of the heart", () => {
      const wrapper = factory({ locked: true });

      expect(
        wrapper.get(sel("favorite-toggle-button-icon")).classes(),
      ).toContain("fa-lock");
    });

    it('re-emits "lockedClick" when the lock is clicked', async () => {
      const wrapper = factory({ locked: true });

      await wrapper.get(sel("favorite-toggle-button")).trigger("click");

      expect(wrapper.emitted("lockedClick")).toHaveLength(1);
    });
  });
});
