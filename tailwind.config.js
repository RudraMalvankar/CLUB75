const primitives = require("./constants/theme/primitives.json");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
    "./store/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        card: "var(--color-card)",
        border: "var(--color-border)",
        divider: "var(--color-divider)",
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "primary-pressed": "var(--color-primary-pressed)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        foreground: "var(--color-text-primary)",
        "foreground-muted": "var(--color-text-secondary)",
        "foreground-disabled": "var(--color-text-disabled)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        info: "var(--color-info)",
      },
      fontFamily: {
        sans: [primitives.fallbackFontFamily],
      },
      fontSize: Object.fromEntries(
        Object.entries(primitives.fontScale).map(([key, value]) => [
          key.replace(/([A-Z])/g, "-$1").toLowerCase(),
          [`${value.fontSize}px`, { lineHeight: `${value.lineHeight}px` }],
        ]),
      ),
      fontWeight: {
        light: primitives.fontWeights.light,
        regular: primitives.fontWeights.regular,
        medium: primitives.fontWeights.medium,
        semibold: primitives.fontWeights.semiBold,
        bold: primitives.fontWeights.bold,
        extrabold: primitives.fontWeights.extraBold,
      },
      spacing: {
        ...primitives.spacing,
        "screen-padding": primitives.spacing.screenPadding,
        "card-padding": primitives.spacing.cardPadding,
        "card-gap": primitives.spacing.cardGap,
        "section-gap": primitives.spacing.sectionGap,
      },
      borderRadius: primitives.radius,
      maxWidth: {
        content: `${primitives.layout.contentMaxWidth.phone}px`,
        tablet: `${primitives.layout.contentMaxWidth.tablet}px`,
      },
      minHeight: {
        touch: `${primitives.layout.touchTargetMin}px`,
      },
      minWidth: {
        touch: `${primitives.layout.touchTargetMin}px`,
      },
      screens: {
        "phone-lg": `${primitives.layout.breakpoint.largePhone}px`,
        tablet: `${primitives.layout.breakpoint.tablet}px`,
      },
    },
  },
  plugins: [],
};
