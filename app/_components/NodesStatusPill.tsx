import { card } from "@/app/_config/card";

/** Static brand status label (Phase 1 — not a live health check). */
export function NodesStatusPill() {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-telemetry/30 bg-telemetry/10 px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-telemetry">
      <span className="relative flex size-2" aria-hidden="true">
        <span className="status-pulse absolute inline-flex size-full rounded-full bg-telemetry" />
        <span className="relative inline-flex size-2 rounded-full bg-telemetry" />
      </span>
      {card.brand.statusLabel}
    </p>
  );
}
