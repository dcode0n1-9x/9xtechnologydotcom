import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FADE_UI_MS,
  LOGO_TARGET_ID,
  LuxuryPreloader,
  REVEAL_MS,
  SAFETY_MARGIN_MS,
} from "@/app/_components/LuxuryPreloader";
import { INTRO_ACTIVE_CLASS, INTRO_SKIP_CLASS } from "@/app/_lib/intro";
import { getRevealed, setRevealed } from "@/app/_lib/reveal";

const DURATION = 1600;
const root = () => document.documentElement;
const overlay = () => document.querySelector(".lux-preloader");

function rect(x: number, y: number, size: number): DOMRect {
  return {
    left: x,
    top: y,
    width: size,
    height: size,
    right: x + size,
    bottom: y + size,
    x,
    y,
    toJSON: () => ({}),
  };
}

function addTarget() {
  const target = document.createElement("span");
  target.id = LOGO_TARGET_ID;
  target.getBoundingClientRect = () => rect(16, 10, 36);
  document.body.appendChild(target);
  return target;
}

beforeEach(() => {
  vi.useFakeTimers();
  setRevealed(false);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect(151, 378, 88));
});

afterEach(() => {
  document.getElementById(LOGO_TARGET_ID)?.remove();
});

describe("LuxuryPreloader", () => {
  it("unmounts immediately when the boot script chose to skip", () => {
    root().classList.add(INTRO_SKIP_CLASS);
    render(<LuxuryPreloader />);
    expect(overlay()).toBeNull();
    expect(getRevealed()).toBe(true);
  });

  it("runs counting → fadeUi → revealed → done on a first session", () => {
    root().classList.add(INTRO_ACTIVE_CLASS);
    addTarget();
    render(<LuxuryPreloader duration={DURATION} />);
    expect(overlay()).toHaveAttribute("data-phase", "counting");

    act(() => vi.advanceTimersByTime(DURATION));
    expect(overlay()).toHaveAttribute("data-phase", "fadeUi");

    act(() => vi.advanceTimersByTime(FADE_UI_MS));
    expect(overlay()).toHaveClass("curtains-open");
    expect(getRevealed()).toBe(true);

    act(() => vi.advanceTimersByTime(REVEAL_MS));
    expect(overlay()).toBeNull();
    // Scroll unlocked + AppBar logo visible again.
    expect(root()).not.toHaveClass(INTRO_ACTIVE_CLASS);
  });

  it("flies the logo to the measured AppBar target", () => {
    root().classList.add(INTRO_ACTIVE_CLASS);
    addTarget();
    render(<LuxuryPreloader duration={DURATION} />);
    act(() => vi.advanceTimersByTime(DURATION));
    act(() => vi.advanceTimersByTime(FADE_UI_MS));

    const flyer = document.querySelector<HTMLElement>(".lux-flyer")!;
    // from centre (195, 422) → to centre (34, 28), scale 36/88
    expect(flyer.style.transform).toBe(`translate3d(-161px, -394px, 0) scale(${36 / 88})`);
  });

  it("fades the logo out when the target is missing", () => {
    root().classList.add(INTRO_ACTIVE_CLASS);
    render(<LuxuryPreloader duration={DURATION} />);
    act(() => vi.advanceTimersByTime(DURATION));
    act(() => vi.advanceTimersByTime(FADE_UI_MS));
    expect(document.querySelector(".lux-flyer")).toHaveClass("lux-flyer-fade");
  });

  it("forceShow plays even when skipped", () => {
    root().classList.add(INTRO_SKIP_CLASS);
    render(<LuxuryPreloader forceShow />);
    expect(overlay()).toHaveAttribute("data-phase", "counting");
    expect(root()).toHaveClass(INTRO_ACTIVE_CLASS);
  });

  it("can be skipped by the user", () => {
    root().classList.add(INTRO_ACTIVE_CLASS);
    render(<LuxuryPreloader />);
    act(() => screen.getByRole("button", { name: "Skip intro" }).click());
    expect(overlay()).toBeNull();
    expect(root()).not.toHaveClass(INTRO_ACTIVE_CLASS);
  });

  it("never traps the user: the safety timeout reveals the app", () => {
    root().classList.add(INTRO_ACTIVE_CLASS);
    // Simulate a stuck timeline: phase timers never fire past counting.
    render(<LuxuryPreloader duration={60_000} />);
    act(() => vi.advanceTimersByTime(60_000 + FADE_UI_MS + REVEAL_MS + SAFETY_MARGIN_MS));
    expect(overlay()).toBeNull();
  });

  it("cleans up timers on unmount", () => {
    root().classList.add(INTRO_ACTIVE_CLASS);
    const { unmount } = render(<LuxuryPreloader />);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
