/**
 * @file Unit tests for ChapterList.
 *
 * Covers:
 * - "Chapters" heading labelling the section
 * - One numbered row per chapter, in the given order
 * - Loading, error and empty messages (loading wins over error, error over empty)
 */
import { mount } from "@vue/test-utils";
import { audiobookChapter } from "../../../tests/fixtures/audiobook";
import ChapterList from "./ChapterList.vue";

/** Mounts a ChapterList; override props per test. */
function factory(props: Record<string, unknown> = {}) {
  return mount(ChapterList, { props });
}

const sel = (id: string) => `[data-testid="${id}"]`;

const CHAPTERS = [
  audiobookChapter({ id: 1, title: "Le narrateur et le dessin" }),
  audiobookChapter({ id: 2, title: "Le Petit Prince et sa planète" }),
];

describe("ChapterList", () => {
  it("is a section labelled by its Chapters heading", () => {
    const wrapper = factory();

    const section = wrapper.get(sel("chapter-list"));
    expect(wrapper.get(`#${section.attributes("aria-labelledby")}`).text()).toBe("Chapters");
  });

  it("shows one numbered row per chapter, in order", () => {
    const wrapper = factory({ chapters: CHAPTERS });

    const rows = wrapper.findAll(sel("chapter-row"));
    expect(rows.map((row) => row.get(sel("chapter-row-number")).text())).toEqual(["1", "2"]);
    expect(rows.map((row) => row.get(sel("chapter-row-title")).text())).toEqual([
      "Le narrateur et le dessin",
      "Le Petit Prince et sa planète",
    ]);
  });

  it("shows a loading message instead of the rows while loading", () => {
    const wrapper = factory({ chapters: CHAPTERS, isLoading: true, hasError: true });

    expect(wrapper.find(sel("chapter-list-loading")).exists()).toBe(true);
    expect(wrapper.find(sel("chapter-list-error")).exists()).toBe(false);
    expect(wrapper.findAll(sel("chapter-row"))).toHaveLength(0);
  });

  it("shows an alert when the chapters could not be loaded", () => {
    const wrapper = factory({ hasError: true });

    expect(wrapper.get(sel("chapter-list-error")).attributes("role")).toBe("alert");
    expect(wrapper.find(sel("chapter-list-empty")).exists()).toBe(false);
  });

  it("shows an empty message when there are no chapters", () => {
    const wrapper = factory();

    expect(wrapper.get(sel("chapter-list-empty")).text()).toBe("No chapters yet.");
  });
});
