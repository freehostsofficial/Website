"use client";

import { useScroll, useTransform, type MotionValue } from "framer-motion";

export function useScrollYProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
}

export function useParallaxOffset(ref: React.RefObject<HTMLElement | null>, range: [number, number] = [0, 50]) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return useTransform(scrollYProgress, [0, 1], range);
}
