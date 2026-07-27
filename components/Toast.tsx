"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

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

export default function ToastContainer() {
  const [items, setItems] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener: Listener = (t) => setItems([...t]);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {items.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.type === "success"
            ? <CheckCircle size={16} aria-hidden="true" />
            : <AlertCircle size={16} aria-hidden="true" />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
