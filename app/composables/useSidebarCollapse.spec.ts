/**
 * @file Unit tests for useSidebarCollapse.
 *
 * Covers:
 * - Starts expanded with nothing stored, collapsed when "true" is stored
 * - toggle flips the state
 * - Every change is saved to localStorage
 * - Storage errors fall back to expanded and never throw
 */
import { nextTick } from "vue";
import { SIDEBAR_COLLAPSED_KEY, useSidebarCollapse } from "./useSidebarCollapse";

describe("useSidebarCollapse", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  describe("initial state", () => {
    it("starts expanded when nothing is stored", () => {
      expect(useSidebarCollapse().isCollapsed.value).toBe(false);
    });

    it("starts collapsed when the stored value is true", () => {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, "true");

      expect(useSidebarCollapse().isCollapsed.value).toBe(true);
    });

    it("starts expanded when reading the storage throws", () => {
      jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("blocked");
      });

      expect(useSidebarCollapse().isCollapsed.value).toBe(false);
    });
  });

  describe("toggle", () => {
    it("collapses then expands the sidebar", () => {
      const { isCollapsed, toggle } = useSidebarCollapse();

      toggle();
      expect(isCollapsed.value).toBe(true);

      toggle();
      expect(isCollapsed.value).toBe(false);
    });

    it("saves the new state", async () => {
      const { toggle } = useSidebarCollapse();

      toggle();
      await nextTick();

      expect(localStorage.getItem(SIDEBAR_COLLAPSED_KEY)).toBe("true");
    });

    it("keeps working when saving throws", async () => {
      jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("quota");
      });
      const { isCollapsed, toggle } = useSidebarCollapse();

      toggle();
      await nextTick();

      expect(isCollapsed.value).toBe(true);
    });
  });
});
