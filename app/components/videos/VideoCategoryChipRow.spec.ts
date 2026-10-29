/**
 * @file Unit tests for VideoCategoryChipRow.
 *
 * Covers:
 * - "All" chip followed by one chip per category, with label and icon
 * - Active chip: "All" by default, the selected category otherwise
 * - "categoryChange" emission with the category id, null for "All"
 */
import { mount } from "@vue/test-utils";
import VideoCategoryChipRow from "./VideoCategoryChipRow.vue";
import { VIDEO_CATEGORIES, VIDEO_CATEGORY_IDS } from "~/utils/videos";

/** Mounts VideoCategoryChipRow with no selection; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(VideoCategoryChipRow, { props });
}

const chips = (wrapper: ReturnType<typeof factory>) =>
  wrapper.findAll('[data-testid="video-filter-chip"]');

describe("VideoCategoryChipRow", () => {
  describe("rendering", () => {
    it('shows "All" then every category label in order', () => {
      const labels = chips(factory()).map((chip) => chip.text());

      expect(labels).toEqual([
        "All",
        ...VIDEO_CATEGORY_IDS.map((id) => VIDEO_CATEGORIES[id].label),
      ]);
    });

    it("gives each category chip its icon", () => {
      const icon = factory().findAll('[data-testid="video-filter-chip-icon"]')[0];

      expect(icon?.classes()).toEqual(
        expect.arrayContaining(VIDEO_CATEGORIES.SlowFrench.icon.split(" ")),
      );
    });
  });

  describe("selection", () => {
    it('marks "All" as active when no category is selected', () => {
      expect(chips(factory())[0]?.attributes("aria-pressed")).toBe("true");
    });

    it("marks the selected category as active", () => {
      const wrapper = factory({ selectedCategory: "Vlogs" });
      const active = chips(wrapper).filter((chip) => chip.attributes("aria-pressed") === "true");

      expect(active.map((chip) => chip.text())).toEqual(["Vlogs"]);
    });
  });

  describe("events", () => {
    it('emits the category id when a category chip is clicked', async () => {
      const wrapper = factory();

      await chips(wrapper)[2]?.trigger("click");

      expect(wrapper.emitted("categoryChange")).toEqual([[VIDEO_CATEGORY_IDS[1]]]);
    });

    it('emits null when "All" is clicked', async () => {
      const wrapper = factory({ selectedCategory: "Music" });

      await chips(wrapper)[0]?.trigger("click");

      expect(wrapper.emitted("categoryChange")).toEqual([[null]]);
    });
  });
});
