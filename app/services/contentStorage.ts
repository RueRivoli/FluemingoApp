import { useSupabase } from "~/composables/useSupabase";

// Storage bucket holding the files img_url and audio_url point to
// (e.g. "articles/fr/rap/image.png", "videos/fr/<id>/vocabulary/word.mp3").
const CONTENT_BUCKET = "content";
const ABSOLUTE_URL = /^https?:\/\//;
// Some rows (flashcards especially) store "/content/…" or "content/…": the
// bucket name is not part of the object path, as in the mobile app.
const BUCKET_PREFIX = new RegExp(`^/?(${CONTENT_BUCKET}/)?`);

/**
 * Turns a storage path of the content bucket into a public URL;
 * full URLs are kept as-is.
 * @returns The URL, or null when the path is empty
 */
export function toContentFileUrl(path: string | null): string | null {
  if (!path) return null;
  if (ABSOLUTE_URL.test(path)) return path;
  const objectPath = path.replace(BUCKET_PREFIX, "");
  return useSupabase().storage.from(CONTENT_BUCKET).getPublicUrl(objectPath)
    .data.publicUrl;
}

/**
 * Turns an img_url storage path of the content bucket into a public URL;
 * full URLs are kept as-is.
 * @returns The URL, or null when the path is empty
 */
export function toContentImageUrl(path: string | null): string | null {
  return toContentFileUrl(path);
}
