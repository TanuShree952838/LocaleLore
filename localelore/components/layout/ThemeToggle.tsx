"use client";

import { useTheme } from "@/hooks/useTheme";
import { SunIcon, MoonIcon } from "@/components/ui/Icon";

/**
 * Light/dark toggle. Renders a stable placeholder until mounted to avoid a
 * hydration mismatch, and exposes an accessible label + pressed state.
 */
export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={mounted ? isDark : undefined}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      {mounted && isDark ? (
        <SunIcon aria-hidden="true" className="h-5 w-5" />
      ) : (
        <MoonIcon aria-hidden="true" className="h-5 w-5" />
      )}
    </button>
  );
}
