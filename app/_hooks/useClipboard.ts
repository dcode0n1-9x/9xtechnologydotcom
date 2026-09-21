"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/app/_components/Toast";
import { card } from "@/app/_config/card";
import { copyText } from "@/app/_lib/clipboard";

export const COPIED_FEEDBACK_MS = 1500;

/**
 * Shared copy-to-clipboard behavior: Clipboard API with textarea fallback,
 * a per-key "copied" flag for 1.5s (check icon) and a toast.
 */
export function useClipboard() {
  const showToast = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (key: string, text: string, label: string): Promise<boolean> => {
      const ok = await copyText(text);
      if (ok) {
        setCopiedKey(key);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopiedKey(null), COPIED_FEEDBACK_MS);
        showToast(`${label} ${card.ui.copied}`);
      } else {
        showToast(card.ui.copyFailed, "error");
      }
      return ok;
    },
    [showToast],
  );

  const isCopied = useCallback((key: string) => copiedKey === key, [copiedKey]);

  return { copy, isCopied };
}
