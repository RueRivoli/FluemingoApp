// PrimeVue theme — Aura preset re-tinted with the Fluemingo brand colors
// (see app/assets/css/variables.css: --color-primary #849bff, --color-primary-dark #5a67d8).
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

const FluemingoPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#f3f5ff",
      100: "#e6eaff",
      200: "#ccd5ff",
      300: "#b0beff",
      400: "#9aacff",
      500: "#849bff",
      600: "#6f82ec",
      700: "#5a67d8",
      800: "#4a52b0",
      900: "#3c4389",
      950: "#262a57",
    },
    colorScheme: {
      light: {
        primary: {
          color: "{primary.500}",
          contrastColor: "#ffffff",
          hoverColor: "{primary.600}",
          activeColor: "{primary.700}",
        },
        highlight: {
          background: "{primary.50}",
          focusBackground: "{primary.100}",
          color: "{primary.700}",
          focusColor: "{primary.800}",
        },
      },
    },
  },
  components: {
    // `severity="secondary"` buttons use the brand yellow (--color-secondary)
    // instead of Aura's default gray.
    button: {
      colorScheme: {
        light: {
          root: {
            secondary: {
              background: "#F6D75A",
              hoverBackground: "#f2cc3a",
              activeBackground: "#e6bd25",
              borderColor: "#F6D75A",
              hoverBorderColor: "#f2cc3a",
              activeBorderColor: "#e6bd25",
              color: "#1A1A1A",
              hoverColor: "#1A1A1A",
              activeColor: "#1A1A1A",
              focusRing: { color: "#e6bd25", shadow: "none" },
            },
          },
        },
      },
    },
  },
});

export default {
  preset: FluemingoPreset,
  options: {
    // The marketing site is light-only: never switch to the dark palette.
    darkModeSelector: false,
    // PrimeVue styles go in a CSS layer placed before Tailwind's utilities
    // (see assets/css/tailwind.css), so classes like bg-secondary can override components.
    cssLayer: { name: "primevue", order: "theme, base, primevue, utilities" },
  },
};
