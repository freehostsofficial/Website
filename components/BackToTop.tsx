"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // rAF-throttled: scroll fires at high frequency, state updates at most
    // once per frame.
    let ticking = false;
    const update = () => {
      ticking = false;
      setVisible(window.scrollY > 400);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    // Initial state: already past the threshold on mount (deep link/refresh).
    // Async (rAF) so the effect body stays sync-setState-free.
    const raf = requestAnimationFrame(() => setVisible(window.scrollY > 400));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}
