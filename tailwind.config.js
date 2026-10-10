/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#232F3E",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F1F5F9",
          foreground: "#232F3E",
        },
        accent: {
          DEFAULT: "#16A34A",
          foreground: "#FFFFFF",
        },
        background: "#F8FAFC",
        foreground: "#0F172A",
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },
        border: "#E2E8F0",
        input: "#E2E8F0",
        ring: "#232F3E",
        navy: "#232F3E",
        warning: "#EA580C",
        danger: "#DC2626",
        success: "#16A34A",
        brand: {
          50: "#F1F5F9",
          500: "#232F3E",
          600: "#232F3E",
          700: "#232F3E",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};