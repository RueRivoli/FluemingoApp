// Same rules as resolveAvatarUrl in the Flutter app (lib/utils/avatar.dart), so
// a user gets the same avatar on web and mobile.
const OPEN_PEEPS_BASE_URL = "https://api.dicebear.com/9.x/open-peeps/svg";
// Shrinks and lifts the figure so it sits centered in a circular frame.
const OPEN_PEEPS_PARAMS = "scale=65&translateY=-12";

export function buildOpenPeepsAvatarUrl(seed: string): string {
  const normalized = seed.trim();
  if (!normalized) return `${OPEN_PEEPS_BASE_URL}?${OPEN_PEEPS_PARAMS}`;
  return `${OPEN_PEEPS_BASE_URL}?seed=${encodeURIComponent(normalized)}&${OPEN_PEEPS_PARAMS}`;
}

// `avatar` is either a built-in seed chosen at onboarding ("atlas", "nova"…) or
// a full URL; it wins over `avatar_url` (OAuth / custom picture).
export function resolveAvatarUrl(
  avatar?: string | null,
  avatarUrl?: string | null,
): string | undefined {
  const normalizedAvatar = avatar?.trim();
  if (normalizedAvatar) {
    return /^https?:\/\//.test(normalizedAvatar)
      ? normalizedAvatar
      : buildOpenPeepsAvatarUrl(normalizedAvatar);
  }
  return avatarUrl?.trim() || undefined;
}
