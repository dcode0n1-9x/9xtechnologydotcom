import { card } from "@/app/_config/card";
import { resolvePublicUrl } from "@/app/_lib/url";

interface ExternalActionProps {
  url: string;
  children: React.ReactNode;
  className: string;
  disabledClassName?: string;
  ariaLabel?: string;
}

/**
 * External link that never points at a fake destination:
 * a missing/unsafe URL renders a disabled "Coming soon" state instead.
 */
export function ExternalAction({
  url,
  children,
  className,
  disabledClassName,
  ariaLabel,
}: ExternalActionProps) {
  const href = resolvePublicUrl(url);
  if (!href) {
    return (
      <span
        aria-disabled="true"
        aria-label={ariaLabel ? `${ariaLabel} — ${card.ui.unavailable}` : undefined}
        className={`${disabledClassName ?? className} is-unavailable`}
      >
        {children}
        <span className="font-mono text-[10px] tracking-widest uppercase">{card.ui.unavailable}</span>
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className={className}>
      {children}
    </a>
  );
}
