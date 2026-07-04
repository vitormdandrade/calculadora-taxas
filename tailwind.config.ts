import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paper: warm off-white tinted toward teal
        paper: "#f7faf8",
        ink: {
          DEFAULT: "#10312c",
          soft: "#3d5a54",
          faint: "#6b847e",
        },
        brand: {
          50: "#f0fdf9",
          100: "#ccf5eb",
          200: "#99ead9",
          300: "#5fd4c0",
          400: "#2eb8a5",
          500: "#14a08c",
          600: "#0d9488",
          700: "#0c7268",
          800: "#0d5b54",
          900: "#0f4b46",
          950: "#042f2c",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
