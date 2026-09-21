import { card } from "@/app/_config/card";

export function LegalFooter() {
  return (
    <footer className="pt-2 pb-4 text-center text-xs leading-relaxed text-ink-muted">
      <p>{card.legal}</p>
    </footer>
  );
}
