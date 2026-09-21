"use client";

import { useSyncExternalStore } from "react";
import { getRevealed, subscribeRevealed } from "@/app/_lib/reveal";

interface HeroRevealProps {
  children: React.ReactNode;
  /** Stagger position. */
  index: number;
}

/** Wraps a card section; enters when the preloader reveals the card. */
export function HeroReveal({ children, index }: HeroRevealProps) {
  const revealed = useSyncExternalStore(subscribeRevealed, getRevealed, () => false);
  return (
    <div
      className={`lux-hero-target${revealed ? " revealed" : ""}`}
      style={{ "--lux-i": index } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
