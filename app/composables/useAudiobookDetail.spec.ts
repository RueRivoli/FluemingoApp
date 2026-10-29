/**
 * @file Unit tests for useAudiobookDetail.
 *
 * Covers:
 * - Closed with no audiobook by default
 * - open(): selects the audiobook, opens the modal, loads its chapters
 * - Loading flag while fetching; error flag (and no chapters) when the fetch fails
 * - A slower answer for a previously opened audiobook does not overwrite the current one
 */
import { flushPromises } from "@vue/test-utils";
import * as audiobookService from "~/services/audiobookService";
import type { AudiobookChapter, AudiobookInfo } from "~/types/audiobook";
import { audiobookChapter } from "../../tests/fixtures/audiobook";
import { useAudiobookDetail } from "./useAudiobookDetail";

// The query itself is tested in audiobookService.spec.ts.
jest.mock("~/services/audiobookService");

/** Builds an AudiobookInfo with neutral defaults; override what the test needs. */
function audiobook(overrides: Partial<AudiobookInfo> = {}): AudiobookInfo {
  return {
    id: 12,
    title: "Le Petit Prince",
    imageUrl: null,
    publishedAt: null,
    level: "A2",
    themes: [],
    accent: null,
    author: "Antoine de Saint-Exupéry",
    isNew: false,
    category: "literature",
    ...overrides,
  };
}

/** A promise the test resolves or rejects by hand. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const CHAPTERS = [audiobookChapter({ id: 1 }), audiobookChapter({ id: 2 })];

beforeEach(() => {
  // The error path logs on purpose; keep the test output clean.
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("useAudiobookDetail", () => {
  it("starts closed with no audiobook", () => {
    const detail = useAudiobookDetail();

    expect(detail.isOpen.value).toBe(false);
    expect(detail.selectedAudiobook.value).toBeNull();
    expect(detail.chapters.value).toEqual([]);
  });

  it("opens the modal on the audiobook and loads its chapters", async () => {
    jest.mocked(audiobookService.getAudiobookChapters).mockResolvedValue(CHAPTERS);
    const detail = useAudiobookDetail();
    const book = audiobook();

    await detail.open(book);

    expect(detail.isOpen.value).toBe(true);
    expect(detail.selectedAudiobook.value).toEqual(book);
    expect(audiobookService.getAudiobookChapters).toHaveBeenCalledWith(12);
    expect(detail.chapters.value).toEqual(CHAPTERS);
    expect(detail.isLoadingChapters.value).toBe(false);
  });

  it("flags the chapters as loading until they arrive", async () => {
    const request = deferred<AudiobookChapter[]>();
    jest.mocked(audiobookService.getAudiobookChapters).mockReturnValue(request.promise);
    const detail = useAudiobookDetail();

    const opening = detail.open(audiobook());

    expect(detail.isLoadingChapters.value).toBe(true);
    request.resolve(CHAPTERS);
    await opening;
    expect(detail.isLoadingChapters.value).toBe(false);
  });

  it("flags an error and keeps no chapters when the fetch fails", async () => {
    jest.mocked(audiobookService.getAudiobookChapters).mockRejectedValue(new Error("offline"));
    const detail = useAudiobookDetail();

    await detail.open(audiobook());

    expect(detail.hasChaptersError.value).toBe(true);
    expect(detail.chapters.value).toEqual([]);
    expect(detail.isOpen.value).toBe(true);
  });

  it("clears a previous error when another audiobook is opened", async () => {
    jest
      .mocked(audiobookService.getAudiobookChapters)
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(CHAPTERS);
    const detail = useAudiobookDetail();

    await detail.open(audiobook({ id: 1 }));
    await detail.open(audiobook({ id: 2 }));

    expect(detail.hasChaptersError.value).toBe(false);
    expect(detail.chapters.value).toEqual(CHAPTERS);
  });

  it("ignores a late answer for an audiobook that is no longer selected", async () => {
    const first = deferred<AudiobookChapter[]>();
    const second = deferred<AudiobookChapter[]>();
    jest
      .mocked(audiobookService.getAudiobookChapters)
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    const detail = useAudiobookDetail();
    const secondChapters = [audiobookChapter({ id: 99 })];

    void detail.open(audiobook({ id: 1 }));
    void detail.open(audiobook({ id: 2 }));
    second.resolve(secondChapters);
    await flushPromises();
    first.resolve(CHAPTERS);
    await flushPromises();

    expect(detail.chapters.value).toEqual(secondChapters);
    expect(detail.isLoadingChapters.value).toBe(false);
  });

  it("ignores a late failure for an audiobook that is no longer selected", async () => {
    const first = deferred<AudiobookChapter[]>();
    jest
      .mocked(audiobookService.getAudiobookChapters)
      .mockReturnValueOnce(first.promise)
      .mockResolvedValueOnce(CHAPTERS);
    const detail = useAudiobookDetail();

    void detail.open(audiobook({ id: 1 }));
    await detail.open(audiobook({ id: 2 }));
    first.reject(new Error("offline"));
    await flushPromises();

    expect(detail.hasChaptersError.value).toBe(false);
    expect(detail.chapters.value).toEqual(CHAPTERS);
  });
});
