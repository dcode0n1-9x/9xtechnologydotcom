"use client";

import { ArrowRight, Lock } from "lucide-react";
import { useClipboard } from "@/app/_hooks/useClipboard";
import { CredentialField } from "./CredentialField";
import { ExternalAction } from "./ExternalAction";
import { QrTile } from "./QrTile";
import { SurfaceCard } from "./SurfaceCard";

interface DemoCredential {
  label: string;
  value: string;
  copyLabel: string;
}

interface CrmEntry {
  title: string;
  copy: string;
  cta: string;
  url: string;
  qrLabel: string;
  badge?: string;
  demoCredentials?: {
    tag: string;
    email: DemoCredential;
    password: DemoCredential;
  };
}

interface CrmCardProps {
  id: string;
  entry: CrmEntry;
  /** Primary = orange conversion CTA; secondary = restricted/admin styling. */
  variant: "primary" | "secondary";
}

export function CrmCard({ id, entry, variant }: CrmCardProps) {
  const headingId = `${id}-heading`;
  const isPrimary = variant === "primary";
  const { copy, isCopied } = useClipboard();

  return (
    <SurfaceCard labelledBy={headingId} className={isPrimary ? "" : "bg-surface/60"}>
      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id={headingId} className={`font-semibold text-ink ${isPrimary ? "text-lg" : "text-base"}`}>
              {entry.title}
            </h2>
            {entry.badge && (
              <span className="inline-flex items-center gap-1 rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-ink-muted">
                <Lock className="size-3" aria-hidden="true" />
                {entry.badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-ink-muted">{entry.copy}</p>
        </div>
        <QrTile url={entry.url} label={entry.qrLabel} size={isPrimary ? 80 : 72} />
      </div>

      {entry.demoCredentials && (
        <div className="mt-3 flex flex-col gap-2 border-t border-line/60 pt-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-wider text-ink-muted uppercase">
              {entry.demoCredentials.tag}
            </span>
          </div>
          <CredentialField
            id={`${id}-email`}
            label={entry.demoCredentials.email.label}
            copyLabel={entry.demoCredentials.email.copyLabel}
            value={entry.demoCredentials.email.value}
            copied={isCopied(`${id}-email`)}
            onCopy={() =>
              copy(
                `${id}-email`,
                entry.demoCredentials!.email.value,
                `${entry.title} ${entry.demoCredentials!.email.label}`,
              )
            }
          />
          <CredentialField
            id={`${id}-password`}
            label={entry.demoCredentials.password.label}
            copyLabel={entry.demoCredentials.password.copyLabel}
            value={entry.demoCredentials.password.value}
            secret
            copied={isCopied(`${id}-password`)}
            onCopy={() =>
              copy(
                `${id}-password`,
                entry.demoCredentials!.password.value,
                `${entry.title} ${entry.demoCredentials!.password.label}`,
              )
            }
          />
        </div>
      )}

      <ExternalAction url={entry.url} className={`${isPrimary ? "btn-accent" : "btn-secondary"} mt-4 w-full`}>
        {entry.cta}
        <ArrowRight className="size-4" aria-hidden="true" />
      </ExternalAction>
    </SurfaceCard>
  );
}
