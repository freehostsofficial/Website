"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Was SidebarController + RouteInitializer: two null-render usePathname()
// effects in two files. One module covers both: close sidebar on
// navigation + scroll-reveal for feature/staff cards.
export default function ClientChrome() {
  const pathname = usePathname();
  // Pending overlay-hide timer (cleared on open/unmount so a late
  // callback can't hide the overlay mid-interaction).
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Element that had focus before the sidebar opened — focus returns here.
  const lastFocused = useRef<Element | null>(null);

  function openSidebar() {
    if (hideTimer.current !== null) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    if (sidebar?.classList.contains("open")) return;
    lastFocused.current = document.activeElement;
    sidebar?.classList.add("open");
    overlay?.classList.add("active");
    if (overlay) {
      overlay.style.visibility = "visible";
      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "auto";
    }
    document.body.style.overflow = "hidden";
    sidebar?.removeAttribute("aria-hidden");
    document.getElementById("sidebarToggle")?.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    if (!sidebar?.classList.contains("open") && !overlay?.classList.contains("active")) return;
    sidebar?.classList.remove("open");
    overlay?.classList.remove("active");
    if (overlay) {
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
      if (hideTimer.current !== null) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        overlay.style.visibility = "hidden";
        hideTimer.current = null;
      }, 300);
    }
    document.body.style.overflow = "";
    sidebar?.removeAttribute("aria-hidden");
    document.getElementById("sidebarToggle")?.setAttribute("aria-expanded", "false");
    // Focus return: back to whatever opened the sidebar, if still mounted.
    const prev = lastFocused.current;
    if (prev instanceof HTMLElement && document.contains(prev)) prev.focus();
    lastFocused.current = null;
  }

  useEffect(() => {
    closeSidebar();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document
      .querySelectorAll<Element>(".feature-card, .staff-card")
      .forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      if (hideTimer.current !== null) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    };
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Element;

      if (target.closest("#sidebarToggle")) {
        openSidebar();
        return;
      }
      if (
        target.closest("#sidebarClose") ||
        target.closest("#overlay") ||
        target.closest(".sidebar-link") ||
        target.closest(".sidebar-dropdown-menu a")
      ) {
        closeSidebar();
        return;
      }

      const dropdownToggle = target.closest<HTMLElement>(".sidebar-dropdown-toggle");
      if (dropdownToggle) {
        e.preventDefault();
        const dropdown = dropdownToggle.closest(".sidebar-dropdown");
        if (!dropdown) return;
        const isOpen = dropdown.classList.contains("open");
        document.querySelectorAll(".sidebar-dropdown").forEach((d) => {
          if (d !== dropdown) {
            d.classList.remove("open");
            d.querySelector(".sidebar-dropdown-toggle")?.setAttribute("aria-expanded", "false");
          }
        });
        dropdown.classList.toggle("open", !isOpen);
        dropdownToggle.setAttribute("aria-expanded", String(!isOpen));
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeSidebar();
    }

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
