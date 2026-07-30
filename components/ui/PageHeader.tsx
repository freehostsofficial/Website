"use client";

import { cn } from "@/lib/utils";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs = true,
  children,
  className,
}: PageHeaderProps) {
  return (
    <section className={cn("animate-fade-in", className)}>
      {breadcrumbs && (
        <div className="mb-4">
          <PageBreadcrumbs />
        </div>
      )}
      <h1>{title}</h1>
      {description && (
        <p className="mt-2 text-muted-foreground body-large">{description}</p>
      )}
      {children && <div className="mt-4 flex flex-wrap gap-3">{children}</div>}
    </section>
  );
}
