<script setup lang="ts">
import { ref, toValue, watch, onUnmounted, type Ref } from "vue";

type MaybeRefOrGetter<T> = T | Ref<T> | (() => T);

interface UseFetchOptions extends RequestInit {
  immediate?: boolean;
}

export function useFetch<T>(
  url: MaybeRefOrGetter<string>,
  options: UseFetchOptions = {},
) {
  const { immediate = true, ...fetchOptions } = options;

  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  let controller: AbortController | null = null;

  async function refetch() {
    controller?.abort(); // annule la requête précédente
    controller = new AbortController();

    loading.value = true;
    error.value = null; // on repart propre

    try {
      const res = await fetch(toValue(url), {
        ...fetchOptions,
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

      data.value = (await res.json()) as T;
    } catch (e) {
      if ((e as Error).name === "AbortError") return; // annulation volontaire
      error.value = e as Error;
      data.value = null;
    } finally {
      loading.value = false;
    }
  }

  watch(() => toValue(url), refetch, { immediate });

  onUnmounted(() => controller?.abort());

  return { data, error, loading, refetch };
}
</script>
