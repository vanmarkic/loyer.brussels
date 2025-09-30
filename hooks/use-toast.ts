"use client";

import * as React from "react";

// Simple toast implementation to avoid complex state management issues
interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastState {
  toasts: Toast[];
}

const toastState: ToastState = { toasts: [] };
const listeners: Array<(state: ToastState) => void> = [];

function dispatch(state: ToastState) {
  Object.assign(toastState, state);
  listeners.forEach((listener) => {
    listener(toastState);
  });
}

function toast({ title, description, variant = "default" }: Omit<Toast, "id">) {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast: Toast = { id, title, description, variant };

  dispatch({ toasts: [...toastState.toasts, newToast] });

  // Auto remove after 5 seconds
  setTimeout(() => {
    dispatch({ toasts: toastState.toasts.filter((t) => t.id !== id) });
  }, 5000);

  return {
    id,
    dismiss: () =>
      dispatch({ toasts: toastState.toasts.filter((t) => t.id !== id) }),
    update: (updates: Partial<Toast>) => {
      const updatedToasts = toastState.toasts.map((t) =>
        t.id === id ? { ...t, ...updates } : t,
      );
      dispatch({ toasts: updatedToasts });
    },
  };
}

function useToast() {
  const [state, setState] = React.useState<ToastState>(toastState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        dispatch({ toasts: toastState.toasts.filter((t) => t.id !== toastId) });
      } else {
        dispatch({ toasts: [] });
      }
    },
  };
}

export { useToast, toast };
