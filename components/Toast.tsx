"use client";

import { toast as sonnerToast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export type ToastType = "success" | "error";

export function showToast(message: string, type: ToastType = "success") {
  if (type === "error") {
    sonnerToast.error(message);
  } else {
    sonnerToast.success(message);
  }
}

export default function ToastContainer() {
  return <Toaster />;
}
