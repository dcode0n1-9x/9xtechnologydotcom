"use client";

import { QRCodeSVG } from "qrcode.react";
import { QrCode } from "lucide-react";
import { card } from "@/app/_config/card";
import { colors } from "@/app/_theme/tokens";
import { resolvePublicUrl } from "@/app/_lib/url";

interface QrTileProps {
  url: string;
  label: string;
  size?: number;
}

/** SVG QR code for a configured destination, or an explicit unavailable tile. */
export function QrTile({ url, label, size = 96 }: QrTileProps) {
  const value = resolvePublicUrl(url);

  if (!value) {
    return (
      <div
        role="img"
        aria-label={`${label} — ${card.ui.unavailable}`}
        style={{ width: size + 16, height: size + 16 }}
        className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line bg-canvas-2 text-ink-muted"
      >
        <QrCode className="size-7" aria-hidden="true" />
        <span className="font-mono text-[10px] tracking-widest uppercase">{card.ui.unavailable}</span>
      </div>
    );
  }

  return (
    <div className="shrink-0 rounded-xl bg-white p-2">
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        bgColor={colors.white}
        fgColor={colors.canvas}
        role="img"
        aria-label={label}
        data-qr-value={value}
      />
    </div>
  );
}
