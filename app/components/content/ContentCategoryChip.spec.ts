/**
 * @file Unit tests for ContentCategoryChip.
 *
 * Covers:
 * - Rendering of the readable label for a category id
 * - Every AUDIOBOOK_CATEGORY_IDS id has a non-empty label
 * - label prop: overrides the category label, works without a category
 * - Icon: the category's own icon by default, the icon prop when given
 * - Light (compact) version only when the light prop is set
 * - Icon hidden from assistive technologies
 */
import { mount } from "@vue/test-utils";
import ContentCategoryChip from "./ContentCategoryChip.vue";
import {
  AUDIOBOOK_CATEGORIES,
  AUDIOBOOK_CATEGORY_IDS,
  type AudiobookCategory,
} from "~/utils/audiobooks";

interface FactoryProps {
  category?: AudiobookCategory;
  label?: string;
  icon?: string;
  light?: boolean;
}

/** Mounts ContentCategoryChip with a default category and icon; override per test. */
function factory(props: FactoryProps = {}) {
  return mount(ContentCategoryChip, {
    props: { category: "Literature", icon: "fa-regular fa-book", ...props },
  });
}

describe("ContentCategoryChip", () => {
  describe("label", () => {
    it("shows the category name", () => {
      const wrapper = factory({ category: "Poetry" });

      expect(wrapper.get('[data-testid="content-category-chip-label"]').text()).toBe("Poetry");
    });

    it("shows a readable label for multi-word category ids", () => {
      const wrapper = factory({ category: "CareerBusiness" });

      expect(wrapper.get('[data-testid="content-category-chip-label"]').text()).toBe(
        "Career & Business",
      );
    });

    it.each(AUDIOBOOK_CATEGORY_IDS)("renders a non-empty label for %s", (category) => {
      const wrapper = factory({ category });

      expect(wrapper.get('[data-testid="content-category-chip-label"]').text()).not.toBe("");
    });
  });

  describe("label prop", () => {
    it("overrides the category's own label", () => {
      const wrapper = factory({ category: "Poetry", label: "Poems" });

      expect(wrapper.get('[data-testid="content-category-chip-label"]').text()).toBe("Poems");
    });

    it("works without a category, showing no icon when none is given", () => {
      const wrapper = mount(ContentCategoryChip, { props: { label: "Slow French" } });

      expect(wrapper.get('[data-testid="content-category-chip-label"]').text()).toBe(
        "Slow French",
      );
      expect(wrapper.find('[data-testid="content-category-chip-icon"]').exists()).toBe(false);
    });
  });

  describe("icon", () => {
    it("uses the category's own icon when no icon is given", () => {
      const wrapper = mount(ContentCategoryChip, { props: { category: "Poetry" } });

      const icon = wrapper.get('[data-testid="content-category-chip-icon"]');

      expect(icon.classes()).toEqual(
        expect.arrayContaining(AUDIOBOOK_CATEGORIES.Poetry.icon.split(" ")),
      );
    });

    it("applies the Font Awesome classes passed in the icon prop", () => {
      const wrapper = factory({ icon: "fa-solid fa-landmark" });

      const icon = wrapper.get('[data-testid="content-category-chip-icon"]');

      expect(icon.classes()).toEqual(expect.arrayContaining(["fa-solid", "fa-landmark"]));
    });
  });

  describe("light version", () => {
    it("is not light by default", () => {
      const wrapper = factory();

      expect(wrapper.get('[data-testid="content-category-chip"]').classes()).not.toContain(
        "content-category-chip--light",
      );
    });

    it("applies the light class when light is set", () => {
      const wrapper = factory({ light: true });

      expect(wrapper.get('[data-testid="content-category-chip"]').classes()).toContain(
        "content-category-chip--light",
      );
    });
  });

  describe("accessibility", () => {
    it("hides the decorative icon from screen readers", () => {
      const wrapper = factory();

      expect(
        wrapper.get('[data-testid="content-category-chip-icon"]').attributes("aria-hidden"),
      ).toBe("true");
    });
  });
});
