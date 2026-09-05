// Toast store (was inside components/Toast.tsx, imported by contexts —
// a context importing a component just for a function. UI stays in Toast.tsx).

export type ToastType = "success" | "error";

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

const MAX_TOASTS = 5;
const TOAST_TTL_MS = 3000;

let toastId = 0;
type Listener = (toasts: ToastMessage[]) => void;
const listeners = new Set<Listener>();
let toasts: ToastMessage[] = [];
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function emit() {
  listeners.forEach((l) => l(toasts));
}

function clearTimer(id: number) {
  const t = timers.get(id);
  if (t !== undefined) {
    clearTimeout(t);
    timers.delete(id);
  }
}

export function showToast(message: string, type: ToastType = "success") {
  const id = ++toastId;
  toasts = [...toasts, { id, message, type }];
  // Cap: drop oldest first (and their timers) so a burst can't stack up.
  while (toasts.length > MAX_TOASTS) {
    const dropped = toasts[0];
    clearTimer(dropped.id);
    toasts = toasts.slice(1);
  }
  emit();
  timers.set(
    id,
    setTimeout(() => {
      timers.delete(id);
      toasts = toasts.filter((t) => t.id !== id);
      emit();
    }, TOAST_TTL_MS),
  );
}

export function dismissToast(id: number) {
  clearTimer(id);
  if (toasts.some((t) => t.id === id)) {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }
}

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener);
  // Sync current toasts immediately so late subscribers never miss the
  // toasts that were shown before they mounted.
  listener(toasts);
  return () => { listeners.delete(listener); };
}
