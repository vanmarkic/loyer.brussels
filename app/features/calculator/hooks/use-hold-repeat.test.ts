import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHoldRepeat } from "@/features/calculator/hooks/use-hold-repeat";

describe("useHoldRepeat", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should call onRepeat immediately when start is called with immediate=true", () => {
    const onRepeat = vi.fn();
    const { result } = renderHook(() =>
      useHoldRepeat({ onRepeat, immediate: true })
    );

    act(() => {
      result.current.start();
    });

    expect(onRepeat).toHaveBeenCalledTimes(1);
  });

  it("should not call onRepeat immediately when start is called with immediate=false", () => {
    const onRepeat = vi.fn();
    const { result } = renderHook(() =>
      useHoldRepeat({ onRepeat, immediate: false })
    );

    act(() => {
      result.current.start();
    });

    expect(onRepeat).toHaveBeenCalledTimes(0);
  });

  it("should repeat onRepeat at the default interval (150ms)", () => {
    const onRepeat = vi.fn();
    const { result } = renderHook(() =>
      useHoldRepeat({ onRepeat, immediate: true })
    );

    act(() => {
      result.current.start();
    });

    // Should be called immediately
    expect(onRepeat).toHaveBeenCalledTimes(1);

    // Advance timers and check repeats (default is 150ms)
    act(() => {
      vi.advanceTimersByTime(450); // 3 intervals at 150ms
    });

    expect(onRepeat).toHaveBeenCalledTimes(4); // 1 immediate + 3 repeats
  });

  it("should stop repeating when stop is called", () => {
    const onRepeat = vi.fn();
    const { result } = renderHook(() =>
      useHoldRepeat({ onRepeat, immediate: true })
    );

    act(() => {
      result.current.start();
    });

    expect(onRepeat).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(300); // 2 intervals at 150ms
    });

    expect(onRepeat).toHaveBeenCalledTimes(3); // 1 immediate + 2 repeats

    act(() => {
      result.current.stop();
      vi.advanceTimersByTime(300);
    });

    // Should not have been called again after stop
    expect(onRepeat).toHaveBeenCalledTimes(3);
  });

  it("should return correct isActive status", () => {
    const onRepeat = vi.fn();
    const { result} = renderHook(() => useHoldRepeat({ onRepeat }));

    expect(result.current.isActive()).toBe(false);

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive()).toBe(true);

    act(() => {
      result.current.stop();
    });

    expect(result.current.isActive()).toBe(false);
  });

  it("should handle multiple start/stop cycles", () => {
    const onRepeat = vi.fn();
    const { result } = renderHook(() =>
      useHoldRepeat({ onRepeat, immediate: true })
    );

    // First cycle
    act(() => {
      result.current.start();
      vi.advanceTimersByTime(150);
      result.current.stop();
    });

    const firstCallCount = onRepeat.mock.calls.length;

    // Second cycle
    act(() => {
      result.current.start();
      vi.advanceTimersByTime(150);
      result.current.stop();
    });

    const secondCallCount = onRepeat.mock.calls.length;

    expect(secondCallCount).toBeGreaterThan(firstCallCount);
    expect(result.current.isActive()).toBe(false);
  });

  it("should not start multiple times if already active", () => {
    const onRepeat = vi.fn();
    const { result } = renderHook(() =>
      useHoldRepeat({ onRepeat, immediate: true })
    );

    act(() => {
      result.current.start();
    });

    expect(onRepeat).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.start(); // Should not do anything if already active
    });

    // Should still be only 1 call (the initial start)
    expect(onRepeat).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Now we should have 2 calls (1 immediate + 1 interval)
    expect(onRepeat).toHaveBeenCalledTimes(2);
  });
});
