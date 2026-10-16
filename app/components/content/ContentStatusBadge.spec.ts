/**
 * @file Unit tests for ContentStatusBadge.
 *
 * Covers:
 * - Readable label for each status
 * - Icon per status: none for "not_started", dots for "in_progress", check for "finished"
 * - Status modifier class driving the icon colour
 * - Icon hidden from assistive technologies
 */
import { mount } from "@vue/test-utils";
import ContentStatusBadge from "./ContentStatusBadge.vue";
import type { ContentStatus } from "~/utils/contentStatus";

/** Mounts ContentStatusBadge with the given status. */
function factory(status: ContentStatus = "in_progress") {
  return mount(ContentStatusBadge, { props: { status } });
}

const LABEL = '[data-testid="content-status-badge-label"]';
const ICON = '[data-testid="content-status-badge-icon"]';

describe("ContentStatusBadge", () => {
  describe("label", () => {
    it.each([
      ["not_started", "Not started"],
      ["in_progress", "In progress"],
      ["finished", "Finished"],
    ] as const)('shows "%s" as "%s"', (status, expected) => {
      const wrapper = factory(status);

      expect(wrapper.get(LABEL).text()).toBe(expected);
    });
  });

  describe("icon", () => {
    it('shows no icon when the status is "not_started"', () => {
      const wrapper = factory("not_started");

      expect(wrapper.find(ICON).exists()).toBe(false);
    });

    it.each([
      ["in_progress", "fa-ellipsis"],
      ["finished", "fa-check"],
    ] as const)('shows the %s icon (%s)', (status, iconClass) => {
      const wrapper = factory(status);

      expect(wrapper.get(ICON).classes()).toContain(iconClass);
    });
  });

  describe("status modifier", () => {
    it("adds a class matching the status, used to colour the icon", () => {
      const wrapper = factory("finished");

      expect(wrapper.get('[data-testid="content-status-badge"]').classes()).toContain(
        "content-status-badge--finished",
      );
    });
  });

  describe("accessibility", () => {
    it("hides the decorative icon from screen readers", () => {
      const wrapper = factory("in_progress");

      expect(wrapper.get(ICON).attributes("aria-hidden")).toBe("true");
    });
  });
});
