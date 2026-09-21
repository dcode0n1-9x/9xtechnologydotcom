"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { card } from "@/app/_config/card";
import { usePwaInstall } from "@/app/_hooks/usePwaInstall";

/** Secondary, user-initiated install action. Renders nothing when install isn't possible. */
export function InstallPwaButton() {
  const { canInstall, showIosHint, promptInstall } = usePwaInstall();
  const [hintOpen, setHintOpen] = useState(false);

  if (!canInstall && !showIosHint) return null;

  return (
    <div>
      <button
        type="button"
        className="btn-secondary w-full"
        aria-expanded={canInstall ? undefined : hintOpen}
        aria-controls={canInstall ? undefined : "install-ios-hint"}
        onClick={() => (canInstall ? void promptInstall() : setHintOpen((open) => !open))}
      >
        <Download className="size-4" aria-hidden="true" />
        {card.install.cta}
      </button>
      {!canInstall && hintOpen && (
        <p id="install-ios-hint" className="mt-2 text-center text-sm text-ink-muted">
          {card.install.iosHint}
        </p>
      )}
    </div>
  );
}
