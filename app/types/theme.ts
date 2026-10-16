/** Theme chip shown after the level in an ArticleCard. */
export interface ArticleCardTheme {
  /** Stable id, used as the v-for key */
  id: string;
  /** Text of the chip */
  label: string;
  /** Font Awesome classes of its icon */
  icon?: string;
}
