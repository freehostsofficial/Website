"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    el.classList.remove("page-transition");
    void el.offsetWidth;
    el.classList.add("page-transition");
  }, [pathname]);

  return (
    <main ref={mainRef} key={pathname} className="page-transition">
      {children}
    </main>
  );
}
