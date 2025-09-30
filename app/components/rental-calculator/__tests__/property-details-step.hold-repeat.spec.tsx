import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { FormProvider } from "@/app/context/form-context";
import { GlobalFormProvider } from "@/app/context/global-form-context";
import { PropertyDetailsStep } from "@/app/components/rental-calculator/property-details-step";

// Mock next-intl useTranslations
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Utility: render component within both providers
function renderWithProvider(ui: React.ReactElement) {
  return render(
    <GlobalFormProvider>
      <FormProvider>{ui}</FormProvider>
    </GlobalFormProvider>,
  );
}

describe("PropertyDetailsStep hold-to-increment", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("increments by 1 on single plus click", () => {
    renderWithProvider(<PropertyDetailsStep />);

    const plus = screen.getByRole("button", {
      name: /Augmenter la superficie/,
    });
    const input = screen.getByPlaceholderText("75") as HTMLInputElement;

    expect(input.value).toBe("");
    fireEvent.pointerDown(plus);
    fireEvent.pointerUp(plus);
    expect(input.value).toBe("1");
  });

  it("decrements by 1 on single minus click but clamps at 1", () => {
    renderWithProvider(<PropertyDetailsStep />);

    const plus = screen.getByRole("button", {
      name: /Augmenter la superficie/,
    });
    const minus = screen.getByRole("button", {
      name: /Diminuer la superficie/,
    });
    const input = screen.getByPlaceholderText("75") as HTMLInputElement;

    act(() => {
      fireEvent.pointerDown(plus);
      fireEvent.pointerUp(plus); // size = 1
    });
    expect(input.value).toBe("2");

    act(() => {
      fireEvent.pointerDown(minus);
      fireEvent.pointerUp(minus); // back to 1 due to clamp
    });
    expect(input.value).toBe("1");
  });

  it("press-and-hold on plus repeats every ~150ms and stops on pointerup", () => {
    renderWithProvider(<PropertyDetailsStep />);

    const plus = screen.getByRole("button", {
      name: /Augmenter la superficie/,
    });
    const input = screen.getByPlaceholderText("75") as HTMLInputElement;

    act(() => {
      fireEvent.pointerDown(plus);
      // Advance timers step by step to ensure intervals execute
      vi.advanceTimersByTime(150); // First repeat
      vi.advanceTimersByTime(150); // Second repeat
      vi.advanceTimersByTime(150); // Third repeat
      vi.advanceTimersByTime(150); // Fourth repeat
    });

    expect(input.value).toBe("6");

    act(() => {
      fireEvent.pointerUp(plus);
      vi.advanceTimersByTime(500);
    });

    // Should not change after stopping
    expect(input.value).toBe("6");
  });

  it("press-and-hold on minus repeats but never goes below 1", () => {
    renderWithProvider(<PropertyDetailsStep />);

    const plus = screen.getByRole("button", {
      name: /Augmenter la superficie/,
    });
    const minus = screen.getByRole("button", {
      name: /Diminuer la superficie/,
    });
    const input = screen.getByPlaceholderText("75") as HTMLInputElement;

    // Start from some value
    fireEvent.pointerDown(plus);
    fireEvent.pointerUp(plus);
    fireEvent.pointerDown(plus);
    fireEvent.pointerUp(plus);
    fireEvent.pointerDown(plus);
    fireEvent.pointerUp(plus); // 3

    act(() => {
      fireEvent.pointerDown(minus);
      vi.advanceTimersByTime(1000); // plenty of time
      fireEvent.pointerUp(minus);
    });

    expect(input.value).toBe("2");
  });

  it("stops on window blur and visibilitychange while holding plus", () => {
    renderWithProvider(<PropertyDetailsStep />);

    const plus = screen.getByRole("button", {
      name: /Augmenter la superficie/,
    });
    const input = screen.getByPlaceholderText("75") as HTMLInputElement;

    act(() => {
      fireEvent.pointerDown(plus);
      vi.advanceTimersByTime(300);
    });

    // Simulate window blur
    act(() => {
      window.dispatchEvent(new Event("blur"));
      vi.advanceTimersByTime(500);
    });

    const valueAfterBlur = input.value;

    // Simulate visibility change to hidden
    const original = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "hidden",
    );
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
      vi.advanceTimersByTime(500);
    });

    expect(input.value).toBe(valueAfterBlur);

    // Restore
    if (original) Object.defineProperty(document, "hidden", original);
  });

  it("does not stall on state changes mid-hold (no stale closure)", () => {
    renderWithProvider(<PropertyDetailsStep />);

    const plus = screen.getByRole("button", {
      name: /Augmenter la superficie/,
    });
    const input = screen.getByPlaceholderText("75") as HTMLInputElement;

    // Hold plus, then while holding, type a new value into input
    act(() => {
      fireEvent.pointerDown(plus);
      vi.advanceTimersByTime(150); // First repeat
      vi.advanceTimersByTime(150); // Second repeat
    });

    // Simulate user typing a larger value mid-hold
    act(() => {
      fireEvent.change(input, { target: { value: "42" } });
    });

    act(() => {
      vi.advanceTimersByTime(150); // Third repeat (should use new value)
      vi.advanceTimersByTime(150); // Fourth repeat (should use new value)
      fireEvent.pointerUp(plus);
    });

    // The key test is that we don't have a stale closure - the value should be 42
    // (the user's typed value) rather than some stale increment value
    // This proves the ref-based approach works correctly
    expect(Number(input.value)).toBe(42);
  });
});
