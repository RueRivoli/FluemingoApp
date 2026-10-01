<script setup lang="ts">

import { ref, computed, watchEffect, onUnmounted, type Ref } from 'vue'

type MaybeRefOrGetter<T> = T | Ref<T> | (() => T)

interface UseFetchOptions extends RequestInit {
  immediate?: boolean
}

export function useFetch<T>(
  url: MaybeRefOrGetter<string>,
  options: UseFetchOptions = {}
) {
    const data = ref<T | null>(null)
    const loading = ref<boolean>(false)
    const error = ref<any>(null)
    
     async function refetch () {
        try {
            loading.value = true
            const res = await fetch(url, options)
            if (res.ok) {
                data.value = res.data
            }
        }
        catch (error) {
            if (res.status === 404 || res.status === 500) error.value = "Error Reseau";
            else error.value = error
        } finally {
            loading.value = false
        }
     }

     return {
        data, loading, error, refetch: fetch
     }
}
</script>

