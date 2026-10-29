/**
 * @file Unit tests for quizService.
 *
 * Covers:
 * - getVideoQuiz: queries the user's language quiz_models table, filtered on
 *   the video (type 3, reference_id), in id order
 * - Row mapping: numbered answers, empty answers left out, trimmed tip / null
 * - Malformed rows (no question, right answer missing) are left out
 * - Throws the Supabase error
 */
import { useSupabase } from "~/composables/useSupabase";
import { languageTable } from "~/services/languageTables";
import type { QuizModel } from "~/types/quiz";
import type { LanguageTableKind } from "~/utils/languages";

import { getVideoQuiz } from "./quizService";

jest.mock("~/composables/useSupabase");
// The table choice is tested in languageTables.spec.ts; here it is a fixed answer.
jest.mock("~/services/languageTables");

const VIDEO_ID = 12;
const DB_ERROR = new Error("permission denied for table fr_quiz_models");

interface QueryResult {
  data: unknown;
  error: unknown;
}

/** Fakes the chained, thenable query `from().select().eq().eq().order()`. */
function mockQuery(result: QueryResult) {
  const builder = {
    select: jest.fn(() => builder),
    eq: jest.fn(() => builder),
    order: jest.fn(() => builder),
    then: (resolve: (value: QueryResult) => unknown) => Promise.resolve(result).then(resolve),
  };
  const from = jest.fn(() => builder);
  jest.mocked(useSupabase).mockReturnValue({ from } as unknown as ReturnType<typeof useSupabase>);
  return { from, builder };
}

/** Builds a fr_quiz_models row of the video; override what the test needs. */
function quizRow(overrides: Partial<QuizModel> = {}): QuizModel {
  return {
    id: 1036,
    quiz_id: 208,
    type: 3,
    reference_id: VIDEO_ID,
    chapter_id: null,
    created_at: "2026-10-28T09:00:00Z",
    question: "Pourquoi Judith a-t-elle mal aux pieds ?",
    answer_1: "Elle a couru",
    answer_2: "Elle a dansé",
    answer_3: "Elle a nagé",
    answer_4: "Elle a beaucoup marché",
    correct_answer: 4,
    tip: null,
    ...overrides,
  };
}

beforeEach(() => {
  jest.mocked(languageTable).mockImplementation(
    async (kind: LanguageTableKind) => `fr_${kind}` as never,
  );
});

describe("getVideoQuiz", () => {
  describe("query", () => {
    it("reads the quiz of the video (type 3) in the user's language, in id order", async () => {
      const { from, builder } = mockQuery({ data: [], error: null });

      await getVideoQuiz(VIDEO_ID);

      expect(from).toHaveBeenCalledWith("fr_quiz_models");
      expect(builder.eq).toHaveBeenCalledWith("type", 3);
      expect(builder.eq).toHaveBeenCalledWith("reference_id", VIDEO_ID);
      expect(builder.order).toHaveBeenCalledWith("id");
    });

    it("throws the Supabase error", async () => {
      mockQuery({ data: null, error: DB_ERROR });

      await expect(getVideoQuiz(VIDEO_ID)).rejects.toBe(DB_ERROR);
    });
  });

  describe("mapping", () => {
    it("maps a row to a question with numbered answers", async () => {
      mockQuery({ data: [quizRow()], error: null });

      expect(await getVideoQuiz(VIDEO_ID)).toEqual([
        {
          id: 1036,
          question: "Pourquoi Judith a-t-elle mal aux pieds ?",
          answers: [
            { number: 1, text: "Elle a couru" },
            { number: 2, text: "Elle a dansé" },
            { number: 3, text: "Elle a nagé" },
            { number: 4, text: "Elle a beaucoup marché" },
          ],
          correctAnswer: 4,
          tip: null,
        },
      ]);
    });

    it("leaves out empty answers but keeps the numbers of the others", async () => {
      mockQuery({ data: [quizRow({ answer_2: null, answer_3: "  " })], error: null });

      const [question] = await getVideoQuiz(VIDEO_ID);

      expect(question?.answers.map((answer) => answer.number)).toEqual([1, 4]);
    });

    it("trims the tip, and turns an empty one into null", async () => {
      mockQuery({
        data: [quizRow({ id: 1, tip: "  Regarde la fin.  " }), quizRow({ id: 2, tip: " " })],
        error: null,
      });

      const questions = await getVideoQuiz(VIDEO_ID);

      expect(questions.map((question) => question.tip)).toEqual(["Regarde la fin.", null]);
    });
  });

  describe("malformed rows", () => {
    it.each([
      ["has no question", { question: null }],
      ["has a blank question", { question: "  " }],
      ["has its right answer empty", { answer_4: null }],
      ["points to an answer that does not exist", { correct_answer: 5 }],
    ])("leaves out a row that %s", async (_label, overrides) => {
      mockQuery({ data: [quizRow({ id: 1 }), quizRow({ id: 2, ...overrides })], error: null });

      const questions = await getVideoQuiz(VIDEO_ID);

      expect(questions.map((question) => question.id)).toEqual([1]);
    });
  });
});
