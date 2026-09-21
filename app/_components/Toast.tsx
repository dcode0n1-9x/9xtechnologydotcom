"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export const TOAST_DURATION_MS = 2000;

type ToastTone = "success" | "error";

interface ToastState {
  id: number;
  message: string;
  tone: ToastTone;
}

type ShowToast = (message: string, tone?: ToastTone) => void;

const ToastContext = createContext<ShowToast | null>(null);

export function useToast(): ShowToast {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast must be used inside <ToastProvider>");
  return show;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const counter = useRef(0);

  const show = useCallback<ShowToast>((message, tone = "success") => {
    counter.current += 1;
    setToast({ id: counter.current, message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="toast-region pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4"
      >
        {toast && (
          <div
            key={toast.id}
            className={`toast-in max-w-card rounded-full border px-4 py-2.5 text-sm font-medium shadow-lg ${
              toast.tone === "error"
                ? "border-accent/50 bg-surface text-ink"
                : "border-telemetry/40 bg-surface text-ink"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
