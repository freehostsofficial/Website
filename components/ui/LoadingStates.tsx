import { cn } from "@/lib/utils";

export function LoadingSpinner({ size = "md", className }: { size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const sizeMap = { sm: "size-4", md: "size-6", lg: "size-8", xl: "size-10" };
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current/30 border-t-current",
        sizeMap[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)} aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

export function PageLoading({ className }: { className?: string }) {
  return (
    <main className={cn("mx-auto flex max-w-[1200px] flex-col items-center justify-center gap-4 px-4 py-24 sm:px-6", className)}>
      <LoadingSpinner size="lg" className="text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </main>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-6", className)}>
      <div className="flex items-center gap-3">
        <LoadingSkeleton className="skeleton-avatar" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton className="skeleton-heading w-2/3" />
          <LoadingSkeleton className="skeleton-text w-1/3" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <LoadingSkeleton className="skeleton-text w-full" />
        <LoadingSkeleton className="skeleton-text w-4/5" />
        <LoadingSkeleton className="skeleton-text w-3/5" />
      </div>
    </div>
  );
}
