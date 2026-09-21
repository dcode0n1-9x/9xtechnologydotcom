import { describe, expect, it, vi } from "vitest";
import { INTRO_ACTIVE_CLASS, INTRO_SESSION_KEY, INTRO_SKIP_CLASS, introBootScript } from "@/app/_lib/intro";

function runBoot({ search = "", reduced = false } = {}) {
  window.history.replaceState(null, "", `/${search}`);
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) => ({ matches: reduced && query.includes("reduce"), media: query }) as MediaQueryList,
  );
  new Function(introBootScript)();
  return document.documentElement.classList;
}

describe("intro boot script", () => {
  it("plays on the first visit of a session and marks it seen", () => {
    expect(runBoot().contains(INTRO_ACTIVE_CLASS)).toBe(true);
    expect(sessionStorage.getItem(INTRO_SESSION_KEY)).toBe("1");
  });

  it("skips when already seen this session", () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    const classes = runBoot();
    expect(classes.contains(INTRO_SKIP_CLASS)).toBe(true);
    expect(classes.contains(INTRO_ACTIVE_CLASS)).toBe(false);
  });

  it.each(["?intro=1", "?preview=1"])("forces the intro with %s", (search) => {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    expect(runBoot({ search }).contains(INTRO_ACTIVE_CLASS)).toBe(true);
  });

  it("skips under prefers-reduced-motion, even when forced", () => {
    const classes = runBoot({ search: "?intro=1", reduced: true });
    expect(classes.contains(INTRO_SKIP_CLASS)).toBe(true);
  });

  it("survives blocked sessionStorage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => runBoot()).not.toThrow();
  });
});
