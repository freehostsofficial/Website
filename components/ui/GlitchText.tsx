"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  variant?: "glitch" | "chromatic";
  className?: string;
  asChild?: boolean;
}

export function GlitchText({
  text,
  as: Tag = "span",
  variant = "glitch",
  className,
}: GlitchTextProps) {
  const [enable, setEnable] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnable(!mq.matches);
    const handler = (e: MediaQueryListEvent) => setEnable(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!enable) return <Tag className={className}>{text}</Tag>;

  if (variant === "chromatic") {
    return (
      <Tag className={cn("chromatic-text", className)} data-text={text}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag className={cn("glitch-text", className)} data-text={text}>
      {text}
    </Tag>
  );
}
