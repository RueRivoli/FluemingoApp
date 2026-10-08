<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    name?: string;
    logo: string;
    selected?: boolean;
  }>(),
  {
    category: "vlogs",
    logo: "",
    selected: false,
  },
);

</script>

<template>
<div class="border">

</div>
</template>
