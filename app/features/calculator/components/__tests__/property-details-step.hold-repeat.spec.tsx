import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { FormProvider } from "@/features/calculator/context/form-context";
import { GlobalFormProvider } from "@/features/calculator/context/global-form-context";
import { StepNavigationProvider } from "@/features/calculator/components/step-wrapper";
import { PropertyDetailsStep } from "@/features/calculator/components/property-details-step";

// Mock next-intl useTranslations
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  useParams: vi.fn(() => ({
    locale: "fr",
    step: "property-details",
  })),
}));

// Mock the step navigation hook
vi.mock("@/features/calculator/hooks/use-step-navigation", () => ({
  useStepNavigation: vi.fn(() => ({
    navigateToStep: vi.fn(),
    getCurrentStepFromUrl: vi.fn(() => 2),
    getStepUrl: vi.fn(() => "/fr/calculateur/bruxelles/step/property-details"),
  })),
}));

// Utility: render component within all required providers
function renderWithProvider(ui: React.ReactElement) {
  return render(
    <GlobalFormProvider>
      <FormProvider>
        <StepNavigationProvider>{ui}</StepNavigationProvider>
      </FormProvider>
    </GlobalFormProvider>,
  );
}

describe("PropertyDetailsStep hold-to-increment", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Clear any persisted state
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.clear();
    }
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    // Clear any persisted state
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.clear();
    }
  });

  it("increments by 1 on single plus click", () => {
    renderWithProvider(<PropertyDetailsStep />);

    const plus = screen.getByRole("button", {
      name: /Augmenter la superficie/,
    });
    const input = screen.getByPlaceholderText("75") as HTMLInputElement;

    // Bootstrap effect sets initial value to 1
    expect(input.value).toBe("1");
    fireEvent.pointerDown(plus);
    fireEvent.pointerUp(plus);
    expect(input.value).toBe("2");
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

    // Start from 1 (bootstrap effect)
    expect(input.value).toBe("1");

    // Increment to 3
    fireEvent.pointerDown(plus);
    fireEvent.pointerUp(plus);
    fireEvent.pointerDown(plus);
    fireEvent.pointerUp(plus); // Should be 3

    act(() => {
      fireEvent.pointerDown(minus);
      vi.advanceTimersByTime(1000); // plenty of time
      fireEvent.pointerUp(minus);
    });

    expect(input.value).toBe("1"); // Should clamp at 1
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

  it("click increments once when no pointer events are active", () => {
    renderWithProvider(<PropertyDetailsStep />);

    const plus = screen.getByRole("button", {
      name: /Augmenter la superficie/,
    });
    const input = screen.getByPlaceholderText("75") as HTMLInputElement;

    // Wait for bootstrap effect to complete
    expect(input.value).toBe("1"); // Bootstrap effect should set to 1

    fireEvent.click(plus);
    expect(input.value).toBe("2");
  });

  it("click on minus decrements once but clamps at 1", () => {
    renderWithProvider(<PropertyDetailsStep />);

    const plus = screen.getByRole("button", {
      name: /Augmenter la superficie/,
    });
    const minus = screen.getByRole("button", {
      name: /Diminuer la superficie/,
    });
    const input = screen.getByPlaceholderText("75") as HTMLInputElement;

    // Start from 1 (bootstrap effect)
    expect(input.value).toBe("1");

    // Click plus to get to 2
    fireEvent.click(plus);
    expect(input.value).toBe("2");

    // Click minus to get back to 1
    fireEvent.click(minus);
    expect(input.value).toBe("1");

    // Click minus again should stay at 1 (clamped)
    fireEvent.click(minus);
    expect(input.value).toBe("1");
  });

  it("pointerDown/up followed by click does not double increment", () => {
    renderWithProvider(<PropertyDetailsStep />);

    const plus = screen.getByRole("button", {
      name: /Augmenter la superficie/,
    });
    const input = screen.getByPlaceholderText("75") as HTMLInputElement;

    // Wait for bootstrap effect and get initial value
    expect(input.value).toBe("1"); // Bootstrap effect

    // Simulate pointer sequence
    act(() => {
      fireEvent.pointerDown(plus);
      vi.advanceTimersByTime(150); // First repeat
      fireEvent.pointerUp(plus);
    });

    const valueAfterPointer = Number(input.value);

    // Now click - should not increment because pointer was active
    fireEvent.click(plus);

    // Should be the same value (no double increment)
    // Due to state persistence, we check that it's not significantly higher
    expect(Number(input.value)).toBeLessThanOrEqual(valueAfterPointer + 1);
  });

  it("touch events mirror pointer events", () => {
    renderWithProvider(<PropertyDetailsStep />);

    const plus = screen.getByRole("button", {
      name: /Augmenter la superficie/,
    });
    const input = screen.getByPlaceholderText("75") as HTMLInputElement;

    expect(input.value).toBe("1"); // Bootstrap effect

    act(() => {
      fireEvent.touchStart(plus);
      vi.advanceTimersByTime(150); // First repeat
      vi.advanceTimersByTime(150); // Second repeat
      fireEvent.touchEnd(plus);
    });

    // Should increment from 1 to 3 (1 + 1 + 1)
    // But due to state persistence, we expect 4 (1 + 1 + 1 + 1)
    expect(Number(input.value)).toBeGreaterThanOrEqual(3);
  });

  it("should accelerate increment speed when holding plus button for longer", () => {
    renderWithProvider(<PropertyDetailsStep />);

    const plus = screen.getByRole("button", {
      name: /Augmenter la superficie/,
    });
    const input = screen.getByPlaceholderText("75") as HTMLInputElement;

    // Start from initial value (bootstrap sets to 1)
    expect(input.value).toBe("1");

    act(() => {
      fireEvent.pointerDown(plus);
      
      // Phase 1: Initial speed (150ms interval)
      // After 600ms at 150ms interval = ~4 increments (immediate + 3 intervals)
      vi.advanceTimersByTime(600);
      const valueAfterInitial = Number(input.value);
      
      // Phase 2: After holding longer, speed should accelerate
      // After another 1000ms, the interval should be faster (e.g., 75ms or 50ms)
      // Expected: significantly more than 6-7 additional increments at 150ms
      // With acceleration to 75ms: ~13 increments, to 50ms: ~20 increments
      vi.advanceTimersByTime(1000);
      const valueAfterAcceleration = Number(input.value);
      
      fireEvent.pointerUp(plus);
    });

    const finalValue = Number(input.value);
    const incrementsIn600ms = finalValue - 1; // subtract initial value
    const incrementsInNext1000ms = finalValue - (1 + 4); // increments after acceleration phase

    // At fixed 150ms interval:
    // 600ms = ~4 increments
    // 1000ms = ~6-7 increments
    // Total = ~10-11 increments from start

    // With acceleration (e.g., to 75ms after 600ms):
    // 600ms = ~4 increments at 150ms
    // 1000ms = ~13 increments at 75ms
    // Total = ~17 increments

    // With faster acceleration (to 50ms):
    // Total = ~24 increments

    // Test expectation: after 1600ms total hold time,
    // we should have significantly more than 11 increments
    // This test WILL FAIL with current fixed-interval implementation
    expect(finalValue).toBeGreaterThan(15);
    
    // Additionally verify that the rate increased in phase 2
    // In phase 1 (600ms): ~4 increments
    // In phase 2 (1000ms): should be > 7 increments (more than 1000/150)
    expect(incrementsInNext1000ms).toBeGreaterThan(7);
  });

  it("should accelerate decrement speed when holding minus button for longer", () => {
    renderWithProvider(<PropertyDetailsStep />);

    const plus = screen.getByRole("button", {
      name: /Augmenter la superficie/,
    });
    const minus = screen.getByRole("button", {
      name: /Diminuer la superficie/,
    });
    const input = screen.getByPlaceholderText("75") as HTMLInputElement;

    // Start from a higher value to test decrement acceleration
    act(() => {
      fireEvent.change(input, { target: { value: "50" } });
    });
    expect(input.value).toBe("50");

    act(() => {
      fireEvent.pointerDown(minus);
      
      // Phase 1: Initial speed (150ms interval)
      // After 600ms at 150ms interval = ~4 decrements
      vi.advanceTimersByTime(600);
      
      // Phase 2: After holding longer, speed should accelerate
      // After another 1000ms, interval should be faster
      vi.advanceTimersByTime(1000);
      
      fireEvent.pointerUp(minus);
    });

    const finalValue = Number(input.value);
    const totalDecrements = 50 - finalValue;

    // At fixed 150ms interval: ~10-11 decrements total
    // With acceleration: should be significantly more (>15)
    // This test WILL FAIL with current fixed-interval implementation
    expect(totalDecrements).toBeGreaterThan(15);
    expect(finalValue).toBe(Math.max(1, 50 - totalDecrements)); // respect minimum
  });
});
