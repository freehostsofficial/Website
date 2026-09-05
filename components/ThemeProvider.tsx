"use client";

import { useEffect } from "react";
import { isPreferenceAllowed, THEME_STORAGE_KEY } from "../lib/cookies";

function getTheme(): string {
  try {
    return (
      localStorage.getItem(THEME_STORAGE_KEY) ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
  } catch {
    return "light";
  }
}

// Pending transition-class timer: cleared on rapid toggles/unmount so a
// stale callback can't strip the class mid-transition.
let transitionTimer: ReturnType<typeof setTimeout> | null = null;

function setTheme(theme: string) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.classList.add("theme-transition");

  // Toggle affordances always reflect the active theme, even when the
  // choice itself isn't persisted (no consent).
  document.querySelectorAll<HTMLElement>("[data-theme-toggle]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(theme === "dark"));
    btn.setAttribute(
      "aria-label",
      theme === "light" ? "Switch to dark theme" : "Switch to light theme"
    );
  });

  if (transitionTimer !== null) clearTimeout(transitionTimer);
  transitionTimer = setTimeout(() => {
    document.documentElement.classList.remove("theme-transition");
    transitionTimer = null;
  }, 220);

  // Preferences category: without opt-in the choice applies to this page
  // load only and is never persisted.
  if (!isPreferenceAllowed("theme")) return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // storage unavailable
  }
}

export default function ThemeProvider() {
  // Apply theme immediately on mount (before first paint where possible)
  useEffect(() => {
    const theme = getTheme();
    setTheme(theme);

    function handleToggle(e: MouseEvent) {
      const target = (e.target as Element).closest("[data-theme-toggle]");
      if (!target) return;
      e.preventDefault();
      const current = document.documentElement.getAttribute("data-theme") || "light";
      setTheme(current === "light" ? "dark" : "light");
    }

    document.addEventListener("click", handleToggle);
    return () => {
      document.removeEventListener("click", handleToggle);
      if (transitionTimer !== null) {
        clearTimeout(transitionTimer);
        transitionTimer = null;
      }
    };
  }, []);

  return null;
}
