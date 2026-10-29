<script setup lang="ts">
/**
 * VideoChannel — round channel avatar followed by the channel name, in grey.
 * A neutral circle stands in for a missing avatar.
 *
 * @example
 * <VideoChannel name="Slow French Café" avatar-url="https://…/avatar.jpg" size="md" />
 */
interface Props {
  /** Channel name */
  name: string;
  /** Avatar URL; a neutral circle shows when missing */
  avatarUrl?: string | null;
  /** "md" for the featured video, "sm" for the cards */
  size?: "sm" | "md";
}

withDefaults(defineProps<Props>(), {
  avatarUrl: null,
  size: "sm",
});
</script>

<template>
  <p :class="['video-channel', `video-channel--${size}`]" data-testid="video-channel">
    <NuxtImg
      v-if="avatarUrl"
      :src="avatarUrl"
      alt=""
      loading="lazy"
      class="video-channel__avatar"
      data-testid="video-channel-avatar"
    />
    <span
      v-else
      class="video-channel__avatar video-channel__avatar--placeholder"
      aria-hidden="true"
      data-testid="video-channel-avatar-placeholder"
    />
    <span class="video-channel__name" data-testid="video-channel-name">{{ name }}</span>
  </p>
</template>

<style scoped>
.video-channel {
  display: flex;
  align-items: center;
  min-width: 0;
  margin: 0;
  color: var(--color-text-light);
}

.video-channel--sm {
  gap: 6px;
  font-size: 13px;
}

.video-channel--md {
  gap: 8px;
  font-size: 14px;
}

.video-channel__avatar {
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
}

.video-channel--sm .video-channel__avatar {
  width: 18px;
  height: 18px;
}

.video-channel--md .video-channel__avatar {
  width: 24px;
  height: 24px;
}

.video-channel__avatar--placeholder {
  background-color: var(--color-primary-pastel);
}

.video-channel__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
