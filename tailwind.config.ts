import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Be Vietnam Pro'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          soft: "#EEF2FF",
        },
        canvas: "#F6F7FB",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#0F172A",
          muted: "#475569",
          subtle: "#94A3B8",
        },
        feedback: {
          success: "#0D9488",
          danger: "#E11D48",
          warning: "#D97706",
        },
        cefr: {
          a1: "#7C3AED",
          a2: "#2563EB",
          b1: "#0D9488",
          b2: "#EA580C",
        },
        xp: "#F59E0B",
        streak: "#EA580C",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(15, 23, 42, 0.05), 0 2px 8px -2px rgba(15, 23, 42, 0.03)",
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)",
      },
    },
  },
  plugins: [],
};
export default config;
