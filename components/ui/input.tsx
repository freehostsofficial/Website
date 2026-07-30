import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "filled";
  inputSize?: "sm" | "md" | "lg";
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", inputSize = "md", label, error, hint, icon, iconPosition = "left", ...props }, ref) => {
    const sizeStyles = {
      sm: "h-8 text-xs px-2.5",
      md: "h-9 text-sm px-3",
      lg: "h-10 text-base px-4",
    };

    const variantStyles = {
      default: "border border-input bg-transparent",
      filled: "border-0 bg-secondary",
    };

    const iconPadding = icon ? (iconPosition === "left" ? "pl-9" : "pr-9") : "";

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground">{label}</label>
        )}
        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            type={type}
            data-slot="input"
            ref={ref}
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-accent selection:text-accent-foreground flex w-full min-w-0 rounded-md shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
              sizeStyles[inputSize],
              variantStyles[variant],
              iconPadding,
              className
            )}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

function Textarea({
  className,
  variant = "default",
  label,
  error,
  hint,
  ...props
}: React.ComponentProps<"textarea"> & {
  variant?: "default" | "filled";
  label?: string;
  error?: string;
  hint?: string;
}) {
  const variantStyles = {
    default: "border border-input bg-transparent",
    filled: "border-0 bg-secondary",
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <textarea
        data-slot="textarea"
        className={cn(
          "placeholder:text-muted-foreground selection:bg-accent selection:text-accent-foreground flex w-full min-w-0 rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
          variantStyles[variant],
          className
        )}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

interface SearchInputProps extends Omit<InputProps, "icon" | "iconPosition"> {
  onClear?: () => void;
}

function SearchInput({ className, onClear, value, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Input
        type="search"
        variant="filled"
        icon={
          <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        }
        value={value}
        className={cn(className, onClear && value ? "pr-9" : "")}
        {...props}
      />
      {onClear && value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export { Input, Textarea, SearchInput };
