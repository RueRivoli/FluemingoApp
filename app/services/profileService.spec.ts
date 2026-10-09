/**
 * @file Unit tests for profileService.
 *
 * Covers:
 * - getProfile: returns the row, null when missing, throws on error
 * - updateProfile: sends only editable fields plus updated_at, returns the
 *   updated row, throws on error
 */
import { useSupabase } from "~/composables/useSupabase";
import type { Profile } from "~~/shared/types/profile";

import { getProfile, updateProfile } from "./profileService";

jest.mock("~/composables/useSupabase");

const USER_ID = "user-1";
const PROFILE = { id: USER_ID, full_name: "Ada" } as Profile;
const DB_ERROR = new Error("permission denied for table profiles");

interface FakeQueryBuilder {
  select: jest.Mock<FakeQueryBuilder>;
  update: jest.Mock<FakeQueryBuilder>;
  eq: jest.Mock<FakeQueryBuilder>;
  maybeSingle: jest.Mock<Promise<QueryResult>>;
  single: jest.Mock<Promise<QueryResult>>;
}

interface QueryResult {
  data: unknown;
  error: unknown;
}

/**
 * Fakes the chained PostgREST builder: every step returns the builder, and the
 * terminal call (maybeSingle / single) resolves to `result`.
 */
function mockQuery(result: QueryResult) {
  const builder: FakeQueryBuilder = {
    select: jest.fn(() => builder),
    update: jest.fn(() => builder),
    eq: jest.fn(() => builder),
    maybeSingle: jest.fn(() => Promise.resolve(result)),
    single: jest.fn(() => Promise.resolve(result)),
  };
  const from = jest.fn(() => builder);
  jest.mocked(useSupabase).mockReturnValue({ from } as unknown as ReturnType<
    typeof useSupabase
  >);
  return { from, builder };
}

describe("profileService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("queries the profiles row of the given user", async () => {
      const { from, builder } = mockQuery({ data: PROFILE, error: null });

      await getProfile(USER_ID);

      expect(from).toHaveBeenCalledWith("profiles");
      expect(builder.eq).toHaveBeenCalledWith("id", USER_ID);
    });

    it("returns the profile", async () => {
      mockQuery({ data: PROFILE, error: null });

      await expect(getProfile(USER_ID)).resolves.toEqual(PROFILE);
    });

    it("returns null when the user has no profile row", async () => {
      mockQuery({ data: null, error: null });

      await expect(getProfile(USER_ID)).resolves.toBeNull();
    });

    it("throws the Supabase error when the query fails", async () => {
      mockQuery({ data: null, error: DB_ERROR });

      await expect(getProfile(USER_ID)).rejects.toBe(DB_ERROR);
    });
  });

  describe("updateProfile", () => {
    it("sends only the editable fields, plus updated_at", async () => {
      const { builder } = mockQuery({ data: PROFILE, error: null });
      // role and is_premium are not granted to the client: they must be dropped.
      const patch = { full_name: "Ada", role: "admin", is_premium: true };

      await updateProfile(USER_ID, patch);

      expect(builder.update).toHaveBeenCalledWith({
        full_name: "Ada",
        updated_at: expect.any(String),
      });
      expect(builder.eq).toHaveBeenCalledWith("id", USER_ID);
    });

    it("returns the updated profile", async () => {
      mockQuery({ data: PROFILE, error: null });

      await expect(
        updateProfile(USER_ID, { full_name: "Ada" }),
      ).resolves.toEqual(PROFILE);
    });

    it("throws the Supabase error when the update fails", async () => {
      mockQuery({ data: null, error: DB_ERROR });

      await expect(updateProfile(USER_ID, { full_name: "Ada" })).rejects.toBe(
        DB_ERROR,
      );
    });
  });
});
