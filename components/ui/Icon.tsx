import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { cn } from "@/lib/utils";

interface IconProps {
  icon: IconProp;
  className?: string;
  size?: "xs" | "sm" | "lg" | "xl" | "1x" | "2x" | "3x";
  spin?: boolean;
  pulse?: boolean;
  fixedWidth?: boolean;
  flip?: "horizontal" | "vertical" | "both";
  rotation?: 90 | 180 | 270;
  inverse?: boolean;
}

export function Icon({
  icon,
  className,
  size = "1x",
  spin,
  pulse,
  fixedWidth = true,
  flip,
  rotation,
  inverse,
}: IconProps) {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={cn("pointer-events-none", className)}
      size={size}
      spin={spin}
      pulse={pulse}
      fixedWidth={fixedWidth}
      flip={flip}
      rotation={rotation}
      inverse={inverse}
    />
  );
}
