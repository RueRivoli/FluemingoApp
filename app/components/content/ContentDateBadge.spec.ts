/**
 * @file Unit tests for ContentDateBadge.
 *
 * Covers:
 * - Formatted date from an ISO string and from a Date
 * - Machine-readable datetime attribute on <time>
 * - Calendar icon, hidden from assistive technologies
 * - Nothing rendered for an invalid date
 */
import { mount } from "@vue/test-utils";
import ContentDateBadge from "./ContentDateBadge.vue";

// Jest runs in UTC (tests/globalSetup.ts), so this is Oct 7 whatever the machine.
const ISO_DATE = "2026-10-07T12:00:00.000Z";

/** Mounts ContentDateBadge with the given date. */
function factory(date: string | Date = ISO_DATE) {
  return mount(ContentDateBadge, { props: { date } });
}

const BADGE = '[data-testid="content-date-badge"]';
const LABEL = '[data-testid="content-date-badge-label"]';
const ICON = '[data-testid="content-date-badge-icon"]';

describe("ContentDateBadge", () => {
  describe("date", () => {
    it("shows an ISO date as a short date", () => {
      const wrapper = factory();

      expect(wrapper.get(LABEL).text()).toBe("Oct 7, 2026");
    });

    it("accepts a Date object", () => {
      const wrapper = factory(new Date(ISO_DATE));

      expect(wrapper.get(LABEL).text()).toBe("Oct 7, 2026");
    });

    it("exposes the full ISO date in the datetime attribute", () => {
      const wrapper = factory();

      expect(wrapper.get(LABEL).attributes("datetime")).toBe(ISO_DATE);
    });
  });

  describe("icon", () => {
    it("shows a calendar icon", () => {
      const wrapper = factory();

      expect(wrapper.get(ICON).classes()).toContain("fa-calendar");
    });

    it("hides the decorative icon from screen readers", () => {
      const wrapper = factory();

      expect(wrapper.get(ICON).attributes("aria-hidden")).toBe("true");
    });
  });

  describe("edge cases", () => {
    it("renders nothing when the date is invalid", () => {
      const wrapper = factory("not a date");

      expect(wrapper.find(BADGE).exists()).toBe(false);
    });
  });
});
