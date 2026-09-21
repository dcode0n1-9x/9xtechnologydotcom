import { Play, Smartphone } from "lucide-react";
import { card } from "@/app/_config/card";
import { ExternalAction } from "./ExternalAction";
import { QrTile } from "./QrTile";
import { SurfaceCard } from "./SurfaceCard";

const stores = [
  { key: "ios", Icon: Smartphone, ...card.apps.ios },
  { key: "android", Icon: Play, ...card.apps.android },
] as const;

export function AppStoreHub() {
  const { apps } = card;
  return (
    <SurfaceCard labelledBy="apps-heading">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="apps-heading" className="text-lg font-semibold text-ink">
          {apps.heading}
        </h2>
        <span className="rounded-md border border-primary/40 bg-primary/15 px-2 py-0.5 font-mono text-xs text-telemetry-blue">
          {apps.version}
        </span>
      </div>
      <p className="mt-0.5 text-sm text-ink-muted">{apps.subtitle}</p>

      <ul className="mt-4 grid grid-cols-2 gap-3">
        {stores.map(({ key, Icon, store, badgeTop, url, qrLabel }) => (
          <li
            key={key}
            className="flex flex-col items-center gap-3 rounded-xl border border-line bg-canvas-2 p-3"
          >
            <QrTile url={url} label={qrLabel} size={104} />
            <ExternalAction
              url={url}
              ariaLabel={`${badgeTop} ${store}`}
              className="store-badge w-full"
              disabledClassName="store-badge w-full flex-wrap justify-center py-2 text-center"
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="flex flex-col text-left leading-none">
                <span className="text-[10px] text-ink-muted">{badgeTop}</span>
                <span className="text-sm font-semibold">{store}</span>
              </span>
            </ExternalAction>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}
