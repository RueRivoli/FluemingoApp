/**
 * @file Unit tests for ThemeChipRow.
 *
 * Covers:
 * - One chip per theme, in THEME_IDS order, labelled from THEMES
 * - Selected state driven by theme ids (not labels)
 * - "themeSelectionChange" emitted with the theme id
 */
import { mount } from "@vue/test-utils";
import { THEME_IDS, THEMES } from "~/utils/themes";
import ThemeChipRow from "./ThemeChipRow.vue";

/** Mounts ThemeChipRow with no theme selected; override per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(ThemeChipRow, { props });
}

const CHIP = '[data-testid="theme-chip"]';

/** Returns the chip whose label is the given theme's label. */
function chipOf(wrapper: ReturnType<typeof factory>, label: string) {
  const chip = wrapper.findAll(CHIP).find((candidate) => candidate.text() === label);
  if (!chip) throw new Error(`No chip labelled "${label}"`);
  return chip;
}

describe("ThemeChipRow", () => {
  describe("rendering", () => {
    it("shows one chip per theme, labelled from THEMES", () => {
      const wrapper = factory();

      expect(wrapper.findAll(CHIP).map((chip) => chip.text())).toEqual(
        THEME_IDS.map((id) => THEMES[id].label),
      );
    });

    it("selects nothing by default", () => {
      const wrapper = factory();

      expect(wrapper.findAll(`${CHIP}.selected`)).toHaveLength(0);
    });

    it("selects the chips of the selected theme ids", () => {
      const wrapper = factory({ selectedThemes: ["japaneseCulture", "sport"] });

      const selected = wrapper.findAll(`${CHIP}.selected`).map((chip) => chip.text());
      expect(selected).toEqual(["Japanese culture", "Sport"]);
    });
  });

  describe("events", () => {
    it('emits "themeSelectionChange" with the theme id, not the label', async () => {
      const wrapper = factory();

      await chipOf(wrapper, "Japanese culture").trigger("click");

      expect(wrapper.emitted("themeSelectionChange")).toEqual([["japaneseCulture"]]);
    });
  });
});
