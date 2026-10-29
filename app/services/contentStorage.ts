import { useSupabase } from "~/composables/useSupabase";

// Storage bucket holding the files img_url and audio_url point to
// (e.g. "articles/fr/rap/image.png", "videos/fr/<id>/vocabulary/word.mp3").
const CONTENT_BUCKET = "content";
const ABSOLUTE_URL = /^https?:\/\//;

/**
 * Turns a storage path of the content bucket into a public URL;
 * full URLs are kept as-is.
 * @returns The URL, or null when the path is empty
 */
export function toContentFileUrl(path: string | null): string | null {
  if (!path) return null;
  if (ABSOLUTE_URL.test(path)) return path;
  return useSupabase().storage.from(CONTENT_BUCKET).getPublicUrl(path).data
    .publicUrl;
}

/**
 * Turns an img_url storage path of the content bucket into a public URL;
 * full URLs are kept as-is.
 * @returns The URL, or null when the path is empty
 */
export function toContentImageUrl(path: string | null): string | null {
  return toContentFileUrl(path);
}
