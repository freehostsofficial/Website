"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glare?: boolean;
  scale?: number;
  maxTilt?: number;
}

export function TiltCard({ children, className, glare = true, scale = 1.01, maxTilt = 10 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (-mouseY / (rect.height / 2)) * maxTilt;
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

    if (glowRef.current) {
      const pctX = ((e.clientX - rect.left) / rect.width) * 100;
      const pctY = ((e.clientY - rect.top) / rect.height) * 100;
      glowRef.current.style.setProperty("--mouse-x", `${pctX}%`);
      glowRef.current.style.setProperty("--mouse-y", `${pctY}%`);
    }
  }, [maxTilt, scale, isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }, [isMobile]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("tilt-3d", className)}
      style={{
        transition: isMobile ? "none" : undefined,
      }}
    >
      <div className="tilt-3d-inner relative" style={{ transformStyle: "preserve-3d" }}>
        {children}
        {glare && (
          <div
            ref={glowRef}
            className="tilt-3d-glow"
            style={{ borderRadius: "inherit" }}
          />
        )}
      </div>
    </div>
  );
}
