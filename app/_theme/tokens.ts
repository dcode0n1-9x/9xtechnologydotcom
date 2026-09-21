/**
 * Institutional FX Precision — design tokens.
 *
 * Mirrored as Tailwind v4 `@theme` variables in `app/globals.css`
 * (Tailwind v4 has no `tailwind.config.ts`; CSS is its config surface).
 * `tests/lib/tokens.test.ts` keeps the two in sync.
 */
export const colors = {
  canvas: "#060e20",
  "canvas-2": "#0b1326",
  surface: "#131b2e",
  line: "#1e293b",
  primary: "#2563eb",
  "primary-hover": "#1d4ed8",
  accent: "#f97316",
  "accent-deep": "#ea580c",
  telemetry: "#38bdf8",
  "telemetry-blue": "#60a5fa",
  ink: "#e2e8f0",
  "ink-muted": "#94a3b8",
  "ink-subtle": "#64748b",
  white: "#ffffff",
} as const;

export type ColorToken = keyof typeof colors;

export const layout = {
  maxWidth: 430,
} as const;
