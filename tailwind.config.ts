import daisyui from "daisyui";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        surface: {
          50:  "rgb(var(--surface-50) / <alpha-value>)",
          100: "rgb(var(--surface-100) / <alpha-value>)",
          200: "rgb(var(--surface-200) / <alpha-value>)",
          300: "rgb(var(--surface-300) / <alpha-value>)",
          400: "rgb(var(--surface-400) / <alpha-value>)",
          500: "rgb(var(--surface-500) / <alpha-value>)",
          600: "rgb(var(--surface-600) / <alpha-value>)",
          700: "rgb(var(--surface-700) / <alpha-value>)",
          800: "rgb(var(--surface-800) / <alpha-value>)",
          900: "rgb(var(--surface-900) / <alpha-value>)",
          950: "rgb(var(--surface-950) / <alpha-value>)",
        },
        accent: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        "dark-gradient": "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      },
      boxShadow: {
        "brand": "0 0 0 1px rgba(99,102,241,0.3), 0 4px 24px rgba(99,102,241,0.15)",
        "card": "0 1px 3px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2)",
        "glow": "0 0 20px rgba(99,102,241,0.4)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.25s ease-out",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: false,
  },
} satisfies Config;
