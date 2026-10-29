/**
 * Global Jest setup, run before every spec file.
 * Add shared matchers or global stubs here.
 */

// jsdom has no layout engine, hence no ResizeObserver; PrimeVue components
// (TabList…) create one on mount. A no-op stand-in is enough: tests do not
// depend on element sizes.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

export {};
