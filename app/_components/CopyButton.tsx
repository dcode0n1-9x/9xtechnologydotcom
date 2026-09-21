"use client";

import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  label: string;
  copied: boolean;
  onCopy: () => void;
}

/** Icon-only copy action; swaps to a check icon while `copied` is true. */
export function CopyButton({ label, copied, onCopy }: CopyButtonProps) {
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={label}
      className="tap-target inline-flex shrink-0 items-center justify-center rounded-xl border border-line bg-canvas-2 text-ink-muted transition-colors hover:border-primary hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-telemetry"
    >
      {copied ? (
        <Check className="check-pop size-5 text-telemetry" aria-hidden="true" />
      ) : (
        <Copy className="size-5" aria-hidden="true" />
      )}
    </button>
  );
}
