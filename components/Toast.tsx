"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error";

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
type Listener = (toasts: ToastMessage[]) => void;
const listeners = new Set<Listener>();
let toasts: ToastMessage[] = [];

export function showToast(message: string, type: ToastType = "success") {
  const id = ++toastId;
  toasts = [...toasts, { id, message, type }];
  listeners.forEach((l) => l(toasts));
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((l) => l(toasts));
  }, 3000);
}

function removeToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  listeners.forEach((l) => l(toasts));
}

export default function ToastContainer() {
  const [items, setItems] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener: Listener = (t) => setItems([...t]);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite" aria-atomic="false">
      {items.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm animate-in slide-in-from-right",
            toast.type === "success"
              ? "border-accent/30 bg-card text-foreground"
              : "border-destructive/30 bg-card text-foreground"
          )}
        >
          {toast.type === "success"
            ? <CheckCircle className="mt-0.5 size-4 shrink-0 text-accent" />
            : <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />}
          <span className="text-sm">{toast.message}</span>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="ml-auto shrink-0 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
