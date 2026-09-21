"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { card } from "@/app/_config/card";
import { CopyButton } from "./CopyButton";

const MASK = "•••••••••";

interface CredentialFieldProps {
  id: string;
  label: string;
  copyLabel: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
  /** Password mode: starts masked with a show/hide toggle. */
  secret?: boolean;
  /** Shown instead of the value when it is unavailable; hides copy/toggle. */
  fallback?: string;
}

export function CredentialField({
  id,
  label,
  copyLabel,
  value,
  copied,
  onCopy,
  secret,
  fallback,
}: CredentialFieldProps) {
  const [visible, setVisible] = useState(false);
  const available = value.length > 0;
  const display = !available ? fallback : secret && !visible ? MASK : value;

  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-canvas-2 py-1.5 pr-1.5 pl-3">
      <dl className="min-w-0 flex-1">
        <dt id={`${id}-label`} className="text-[11px] tracking-wider text-ink-muted uppercase">
          {label}
        </dt>
        <dd
          aria-labelledby={`${id}-label`}
          className={`truncate font-mono text-[15px] select-all ${available ? "text-ink" : "text-ink-muted italic"}`}
        >
          {display}
        </dd>
      </dl>
      {available && secret && (
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-label={visible ? card.ui.hidePassword : card.ui.showPassword}
          className="tap-target inline-flex shrink-0 items-center justify-center rounded-xl text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-telemetry"
        >
          {visible ? (
            <EyeOff className="size-5" aria-hidden="true" />
          ) : (
            <Eye className="size-5" aria-hidden="true" />
          )}
        </button>
      )}
      {available && <CopyButton label={copyLabel} copied={copied} onCopy={onCopy} />}
    </div>
  );
}
