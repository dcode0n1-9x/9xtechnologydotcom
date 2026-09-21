import { Bell } from "lucide-react";
import { card } from "@/app/_config/card";
import { LogoMark } from "./LogoMark";

export function AppBar() {
  return (
    <header className="appbar sticky top-0 z-30 -mx-4 border-b border-line/70 bg-canvas/85 px-4 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3">
        <span id="header-brand-logo-mark" className="inline-flex size-9 shrink-0">
          <LogoMark className="size-9" title={card.brand.logoAlt} />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-semibold text-ink">{card.brand.appBarTitle}</p>
          <p className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-ink-muted uppercase">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {card.brand.name}
          </p>
        </div>
        {/* Phase 1: visual only — no notifications backend. */}
        <span
          role="img"
          aria-label={card.brand.notificationsLabel}
          className="relative inline-flex size-11 items-center justify-center rounded-xl text-ink-muted"
        >
          <Bell className="size-5" aria-hidden="true" />
          <span className="absolute top-2.5 right-3 size-2 rounded-full bg-telemetry" aria-hidden="true" />
        </span>
      </div>
    </header>
  );
}
