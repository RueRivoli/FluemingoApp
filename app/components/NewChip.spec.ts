/**
 * @file Unit tests for NewChip.
 *
 * Covers:
 * - Default "NEW" label and custom label
 * - Star icon, hidden from assistive technologies
 */
import { mount } from "@vue/test-utils";
import NewChip from "./NewChip.vue";

/** Mounts NewChip; override the props per test. */
function factory(props: { label?: string } = {}) {
  return mount(NewChip, { props });
}

const ICON = '[data-testid="new-chip-icon"]';

describe("NewChip", () => {
  describe("label", () => {
    it('shows "NEW" by default', () => {
      const wrapper = factory();

      expect(wrapper.get('[data-testid="new-chip-label"]').text()).toBe("NEW");
    });

    it("shows a custom label", () => {
      const wrapper = factory({ label: "NOUVEAU" });

      expect(wrapper.get('[data-testid="new-chip-label"]').text()).toBe("NOUVEAU");
    });
  });

  describe("icon", () => {
    it("shows a star", () => {
      const wrapper = factory();

      expect(wrapper.get(ICON).classes()).toEqual(expect.arrayContaining(["fa-solid", "fa-star"]));
    });

    it("hides the decorative star from screen readers", () => {
      const wrapper = factory();

      expect(wrapper.get(ICON).attributes("aria-hidden")).toBe("true");
    });
  });
});
