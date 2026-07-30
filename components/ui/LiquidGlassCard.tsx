"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  glassSize?: "sm" | "default" | "lg";
}

const sizePadding = {
  sm: "p-4",
  default: "p-6",
  lg: "p-8",
};

export function LiquidGlassCard({ children, className, glassSize = "default" }: LiquidGlassCardProps) {
  const filterId = useId();
  const uid = `liquid-glass-${filterId.replace(/[:.]/g, "-")}`;

  return (
    <div className={cn("relative", className)}>
      <svg className="pointer-events-none absolute inset-0 size-full" style={{ position: "absolute", width: "100%", height: "100%" }}>
        <defs>
          <filter id={uid} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={6}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="0.5" result="blurred" />
            <feComposite in="SourceGraphic" in2="blurred" operator="over" />
          </filter>
        </defs>
      </svg>

      <div
        className={cn(
          "relative rounded-xl border border-border/80 backdrop-blur-xl",
          "bg-gradient-to-br from-card/90 via-card/50 to-secondary/30",
          sizePadding[glassSize]
        )}
        style={{ filter: `url(#${uid})` }}
      >
        {children}
      </div>
    </div>
  );
}
