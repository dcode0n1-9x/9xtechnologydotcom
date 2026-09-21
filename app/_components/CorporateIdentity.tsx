import { card } from "@/app/_config/card";

export function CorporateIdentity() {
  return (
    <div className="text-center">
      <p className="lux-mask font-mono text-xs tracking-[0.35em] text-ink-muted uppercase">
        <span>{card.brand.tagline}</span>
      </p>
      <h1 className="lux-mask mt-1 text-[28px] leading-tight font-bold tracking-tight text-ink">
        <span>{card.brand.name}</span>
      </h1>
    </div>
  );
}
