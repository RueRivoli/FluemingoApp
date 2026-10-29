import { ref, watch, type Ref } from "vue";

/** localStorage key remembering whether the app sidebar is collapsed. */
export const SIDEBAR_COLLAPSED_KEY = "fluemingo:sidebar-collapsed";

export interface UseSidebarCollapseReturn {
  isCollapsed: Ref<boolean>;
  toggle: () => void;
}

// Storage can be missing or throw (private mode, blocked site data): the
// sidebar then simply starts expanded and forgets the choice.
function readStoredCollapsed(): boolean {
  try {
    return globalThis.localStorage?.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}

function storeCollapsed(isCollapsed: boolean): void {
  try {
    globalThis.localStorage?.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed));
  } catch {
    // Not saved: the choice still applies until the page is reloaded.
  }
}

/**
 * Collapsed / expanded state of the app sidebar, remembered across visits.
 * @example
 * const { isCollapsed, toggle } = useSidebarCollapse()
 */
export function useSidebarCollapse(): UseSidebarCollapseReturn {
  const isCollapsed = ref(readStoredCollapsed());

  watch(isCollapsed, storeCollapsed);

  function toggle() {
    isCollapsed.value = !isCollapsed.value;
  }

  return { isCollapsed, toggle };
}
