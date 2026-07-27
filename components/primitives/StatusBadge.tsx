import { Circle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "online" | "offline" | "free" | "verified" | "neutral";

const STATUS_CONFIG: Record<Status, { label: string; className: string; dot: boolean }> = {
  online: { label: "Online", className: "bg-accent/15 text-accent border-transparent", dot: true },
  offline: { label: "Offline", className: "bg-destructive/15 text-destructive-text border-transparent", dot: true },
  free: { label: "Free", className: "bg-accent/15 text-accent border-transparent", dot: false },
  verified: { label: "Verified", className: "bg-secondary text-foreground border-transparent", dot: false },
  neutral: { label: "", className: "text-muted-foreground border-border", dot: false },
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: Status;
  label?: string;
  className?: string;
}) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge className={cn(config.className, className)}>
      {config.dot && <Circle className="size-2 fill-current" strokeWidth={0} />}
      {label ?? config.label}
    </Badge>
  );
}
