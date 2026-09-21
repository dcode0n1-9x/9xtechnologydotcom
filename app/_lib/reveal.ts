/**
 * Tiny external store: has the Digital Card been revealed?
 * The preloader flips it; `HeroReveal` subscribes via useSyncExternalStore.
 */
type Listener = () => void;

let revealed = false;
const listeners = new Set<Listener>();

export function setRevealed(value: boolean): void {
  if (revealed === value) return;
  revealed = value;
  listeners.forEach((listener) => listener());
}

export function getRevealed(): boolean {
  return revealed;
}

export function subscribeRevealed(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
