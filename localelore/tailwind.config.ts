import type { Config } from "tailwindcss";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: Config = {
  darkMode: "class",
  content: [
    path.join(__dirname, "./app/**/*.{ts,tsx}"),
    path.join(__dirname, "./components/**/*.{ts,tsx}"),
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens are driven by CSS variables so the same class names
        // work in both light and dark themes (see app/globals.css).
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        "surface-3": "rgb(var(--surface-3) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-2": "rgb(var(--accent-2) / <alpha-value>)",
        "accent-fg": "rgb(var(--accent-fg) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      // Material Design 3-inspired soft, layered elevation.
      boxShadow: {
        e1: "0 1px 2px rgb(0 0 0 / 0.04), 0 1px 3px rgb(0 0 0 / 0.06)",
        e2: "0 2px 4px rgb(0 0 0 / 0.05), 0 4px 12px rgb(0 0 0 / 0.08)",
        e3: "0 8px 16px rgb(0 0 0 / 0.08), 0 16px 32px rgb(0 0 0 / 0.10)",
        glow: "0 0 0 1px rgb(var(--accent) / 0.25), 0 8px 30px rgb(var(--accent) / 0.20)",
      },
      transitionTimingFunction: {
        // MD3 "emphasized" easing for expressive, springy motion.
        emphasized: "cubic-bezier(0.2, 0, 0, 1)",
        "emphasized-out": "cubic-bezier(0.05, 0.7, 0.1, 1)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        pop: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "60%": { transform: "scale(1.12)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "toast-in": {
          from: { opacity: "0", transform: "translateY(16px) scale(0.96)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        "sheen": {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        indeterminate: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(420%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        "fade-in": "fade-in 0.3s ease-out both",
        "slide-up": "slide-up 0.4s cubic-bezier(0.2, 0, 0, 1) both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.2, 0, 0, 1) both",
        pop: "pop 0.4s cubic-bezier(0.2, 0, 0, 1) both",
        "toast-in": "toast-in 0.35s cubic-bezier(0.2, 0, 0, 1) both",
        float: "float 4s ease-in-out infinite",
        "pulse-soft": "pulse-soft 1.6s ease-in-out infinite",
        sheen: "sheen 3s linear infinite",
        indeterminate: "indeterminate 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
