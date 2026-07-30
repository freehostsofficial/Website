import * as React from "react";

import { cn } from "@/lib/utils";

const cardVariants = {
  default: "bg-card text-card-foreground border border-border",
  elevated: "bg-card text-card-foreground border border-border shadow-medium",
  outlined: "bg-transparent text-card-foreground border-2 border-border",
  glass: "glass text-card-foreground",
  gradient: "gradient-bg-subtle text-card-foreground border border-border",
};

const cardPadding = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

function Card({
  className,
  variant = "default",
  padding = "md",
  hover = false,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: keyof typeof cardVariants;
  padding?: keyof typeof cardPadding;
  hover?: boolean;
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-xl shadow-sm",
        cardVariants[variant],
        cardPadding[padding],
        hover && "card-hover",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
