import { act, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ToastProvider } from "@/app/_components/Toast";
import { card } from "@/app/_config/card";
import { COPIED_FEEDBACK_MS, useClipboard } from "@/app/_hooks/useClipboard";
import { usePwaInstall } from "@/app/_hooks/usePwaInstall";

const wrapper = ({ children }: { children: React.ReactNode }) => <ToastProvider>{children}</ToastProvider>;

describe("useClipboard", () => {
  it("marks the key copied for 1.5s and toasts on success", async () => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    const { result } = renderHook(() => useClipboard(), { wrapper });

    await act(() => result.current.copy("tg", "@ada2en0007", "Telegram handle"));
    expect(result.current.isCopied("tg")).toBe(true);
    expect(screen.getByRole("status")).toHaveTextContent(`Telegram handle ${card.ui.copied}`);

    act(() => vi.advanceTimersByTime(COPIED_FEEDBACK_MS));
    expect(result.current.isCopied("tg")).toBe(false);
  });

  it("shows the long-press hint on failure", async () => {
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    document.execCommand = vi.fn().mockReturnValue(false);
    const { result } = renderHook(() => useClipboard(), { wrapper });

    await act(() => result.current.copy("x", "x", "X"));
    expect(result.current.isCopied("x")).toBe(false);
    expect(screen.getByRole("status")).toHaveTextContent(card.ui.copyFailed);
  });
});

describe("usePwaInstall", () => {
  it("captures beforeinstallprompt and prompts on demand", async () => {
    const { result } = renderHook(() => usePwaInstall());
    expect(result.current.canInstall).toBe(false);

    const event = Object.assign(new Event("beforeinstallprompt", { cancelable: true }), {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: "accepted" as const }),
    });
    act(() => {
      window.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(result.current.canInstall).toBe(true);

    let accepted = false;
    await act(async () => {
      accepted = await result.current.promptInstall();
    });
    expect(event.prompt).toHaveBeenCalled();
    expect(accepted).toBe(true);
    expect(result.current.isInstalled).toBe(true);
    expect(result.current.canInstall).toBe(false);
  });

  it("hides install once appinstalled fires", () => {
    const { result } = renderHook(() => usePwaInstall());
    act(() => {
      window.dispatchEvent(new Event("appinstalled"));
    });
    expect(result.current.isInstalled).toBe(true);
  });
});
