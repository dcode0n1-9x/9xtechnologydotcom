"use client";

import { ClipboardCopy, Check } from "lucide-react";
import { card } from "@/app/_config/card";
import { useClipboard } from "@/app/_hooks/useClipboard";
import { formatCredentials } from "@/app/_lib/credentials";
import { CredentialField } from "./CredentialField";
import { SurfaceCard } from "./SurfaceCard";

export function DemoSandbox() {
  const { demo } = card;
  const { copy, isCopied } = useClipboard();

  const fields = [
    { key: "accountId", label: demo.labels.accountId, value: demo.accountId },
    { key: "password", label: demo.labels.password, value: demo.password, secret: true },
    { key: "server", label: demo.labels.server, value: demo.server },
  ] as const;

  return (
    <SurfaceCard labelledBy="demo-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="demo-heading" className="text-lg font-semibold text-ink">
          {demo.heading}
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-telemetry/30 bg-telemetry/10 px-2.5 py-1 font-mono text-[10px] tracking-widest text-telemetry">
          <span className="size-1.5 rounded-full bg-telemetry" aria-hidden="true" />
          {demo.tag}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {fields.map((field) => (
          <CredentialField
            key={field.key}
            id={`demo-${field.key}`}
            label={field.label}
            copyLabel={demo.copyLabels[field.key]}
            value={field.value}
            secret={"secret" in field ? field.secret : undefined}
            fallback={demo.passwordUnavailable}
            copied={isCopied(field.key)}
            onCopy={() => copy(field.key, field.value, field.label)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => copy("all", formatCredentials(demo), demo.toastLabel)}
        className="btn-secondary mt-3 w-full"
      >
        {isCopied("all") ? (
          <Check className="check-pop size-4 text-telemetry" aria-hidden="true" />
        ) : (
          <ClipboardCopy className="size-4" aria-hidden="true" />
        )}
        {demo.copyAllCta}
      </button>
    </SurfaceCard>
  );
}
