<script setup lang="ts">
/**
 * VideoMetaChip — small grey chip with an icon and a short fact about a video
 * (length, subtitles, speech rate). "md" is the size of the featured video,
 * "sm" the one of the video cards.
 *
 * @example
 * <VideoMetaChip icon="fa-regular fa-closed-captioning" label="FR subtitles" />
 */
interface Props {
  /** Font Awesome classes of the leading icon */
  icon: string;
  /** Text of the chip */
  label: string;
  /** Chip size */
  size?: "sm" | "md";
}

withDefaults(defineProps<Props>(), {
  size: "sm",
});
</script>

<template>
  <span
    :class="['video-meta-chip', `video-meta-chip--${size}`]"
    data-testid="video-meta-chip"
  >
    <span
      :class="['video-meta-chip__icon', icon]"
      aria-hidden="true"
      data-testid="video-meta-chip-icon"
    />
    <span data-testid="video-meta-chip-label">{{ label }}</span>
  </span>
</template>

<style scoped>
.video-meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 6px;
  background-color: var(--color-chip-theme);
  color: var(--color-chip-theme-text);
  font-weight: 500;
  white-space: nowrap;
}

.video-meta-chip__icon {
  color: var(--color-text-light);
}

.video-meta-chip--sm {
  padding: 3px 8px;
  font-size: 12px;
}

.video-meta-chip--sm .video-meta-chip__icon {
  font-size: 11px;
}

.video-meta-chip--md {
  padding: 4px 9px;
  font-size: 13px;
}

.video-meta-chip--md .video-meta-chip__icon {
  font-size: 12px;
}
</style>
