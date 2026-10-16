/**
 * Content themes, mirrored from the mobile app's THEMES (Flutter).
 * Icons are Font Awesome Regular: in the mobile app's Pro build of
 * font_awesome_flutter, FontAwesomeIcons.<name> is the Regular style (Solid is
 * solid<Name>).
 */
import type { ArticleCardTheme } from "~/types/article";

interface ThemeDisplay {
  /** Display label */
  label: string;
  /** Font Awesome classes */
  icon: string;
}

// Single source of truth: ThemeId and THEME_IDS are derived from these keys,
// so adding a theme here is all it takes.
export const THEMES = {
  adventure: { label: "Adventure", icon: "fa-regular fa-backpack" },
  art: { label: "Art", icon: "fa-regular fa-palette" },
  cinema: { label: "Cinema", icon: "fa-regular fa-film" },
  culture: { label: "Culture", icon: "fa-regular fa-globe" },
  education: { label: "Education", icon: "fa-regular fa-graduation-cap" },
  fashion: { label: "Fashion", icon: "fa-regular fa-shirt" },
  food: { label: "Food", icon: "fa-regular fa-bowl-food" },
  gastronomy: { label: "Gastronomy", icon: "fa-regular fa-utensils" },
  health: { label: "Health", icon: "fa-regular fa-heart-pulse" },
  history: { label: "History", icon: "fa-regular fa-clock-rotate-left" },
  japaneseCulture: {
    label: "Japanese culture",
    icon: "fa-regular fa-torii-gate",
  },
  koreanCulture: { label: "Korean culture", icon: "fa-regular fa-yin-yang" },
  // Hidden for now: not offered as a theme filter yet.
  // languages: { label: "Languages", icon: "fa-regular fa-language" },
  literature: { label: "Literature", icon: "fa-regular fa-book" },
  music: { label: "Music", icon: "fa-regular fa-music" },
  nature: { label: "Nature", icon: "fa-regular fa-leaf" },
  news: { label: "News", icon: "fa-regular fa-newspaper" },
  people: { label: "People", icon: "fa-regular fa-users" },
  philosophy: { label: "Philosophy", icon: "fa-regular fa-book-open" },
  politics: { label: "Politics", icon: "fa-regular fa-landmark-dome" },
  psychology: { label: "Psychology", icon: "fa-regular fa-brain" },
  science: { label: "Science", icon: "fa-regular fa-flask" },
  society: { label: "Society", icon: "fa-regular fa-people-group" },
  space: { label: "Space", icon: "fa-regular fa-rocket" },
  sport: { label: "Sport", icon: "fa-regular fa-futbol" },
  technology: { label: "Technology", icon: "fa-regular fa-microchip" },
  travel: { label: "Travel", icon: "fa-regular fa-plane-departure" },
  watersports: { label: "Water sports", icon: "fa-regular fa-person-swimming" },
  yoga: { label: "Yoga", icon: "fa-regular fa-spa" },
} as const satisfies Record<string, ThemeDisplay>;

export type ThemeId = keyof typeof THEMES;

/** Theme ids in display order (the declaration order of THEMES). */
// Object.keys is typed string[]; the cast is safe as THEMES is a literal whose
// keys are exactly the ThemeIds.
export const THEME_IDS = Object.keys(THEMES) as readonly ThemeId[];

// Lowercased id → id, so database values match whatever their casing ("Politics", "politics").
const THEME_ID_BY_LOWERCASE = new Map<string, ThemeId>(
  THEME_IDS.map((id) => [id.toLowerCase(), id]),
);

/**
 * Resolves a theme id from the database, case-insensitively.
 * @returns The matching ThemeId, or null when the value is not a known theme
 */
export function toThemeId(value: string): ThemeId | null {
  return THEME_ID_BY_LOWERCASE.get(value.toLowerCase()) ?? null;
}

/**
 * Builds the chip for a theme value from the database.
 * Unknown values are kept as a plain label without icon, so no data is hidden.
 */
export function toThemeChip(value: string): ArticleCardTheme {
  const id = toThemeId(value);
  if (!id) return { id: value, label: value };
  return { id, ...THEMES[id] };
}
