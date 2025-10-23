import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * INTEGRATION TEST: State Persistence Across Step Navigation
 *
 * This test verifies that form state (particularly propertyType) persists
 * when navigating from step 1 (property-type) to step 2 (property-details).
 *
 * BUG SCENARIO:
 * 1. User selects "apartment" on step 1
 * 2. User clicks continue → navigates to step 2
 * 3. Step 2 page reloads and creates new GlobalFormProvider
 * 4. propertyType is reset to empty string
 * 5. Continue button stays disabled even though size is valid
 *
 * This test simulates the actual page navigation to catch this bug.
 */

// Mock Next.js navigation - use vi.hoisted for variables used in mocks
const { mockPush, mockReplace, mockBack, mockUseParams } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockReplace: vi.fn(),
  mockBack: vi.fn(),
  mockUseParams: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useParams: mockUseParams,
  usePathname: () => "/fr/calculateur/bruxelles/step/property-type",
}));

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "fr",
}));

// Mock the hold repeat hook
vi.mock("@/features/calculator/hooks/use-hold-repeat", () => ({
  useHoldRepeat: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    isActive: () => false,
  }),
}));

// We need to import the actual page component
// This simulates what happens in the real application
import CalculatorStepPage from "../page";

describe("State Persistence Across Steps - Integration Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("BUG: propertyType is lost when navigating from step 1 to step 2", async () => {
    // STEP 1: Render property-type page
    mockUseParams.mockReturnValue({
      locale: "fr",
      step: "property-type",
    });

    const { unmount } = render(<CalculatorStepPage />);

    // User selects "apartment"
    const apartmentOption = screen.getByText("types.apartment");
    fireEvent.click(apartmentOption);

    // Verify apartment is selected
    const apartmentRadio = screen.getByDisplayValue("apartment");
    expect(apartmentRadio).toBeChecked();

    // User clicks continue
    const continueButton = screen.getByText("continueButton");
    fireEvent.click(continueButton);

    // Verify navigation was triggered
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("/property-details")
    );

    // STEP 2: Simulate page navigation
    // In real app, this unmounts the component and remounts with new params
    unmount();

    // Now render step 2 (property-details)
    mockUseParams.mockReturnValue({
      locale: "fr",
      step: "property-details",
    });

    render(<CalculatorStepPage />);

    // At this point, in the buggy version:
    // - A new GlobalFormProvider is created in the page
    // - It initializes with initialGlobalState
    // - propertyType is reset to empty string
    // - Even though size is valid (bootstrapped to 1), button stays disabled

    // The continue button should be enabled if propertyType was preserved
    // But in the buggy version, it will be disabled
    const continueButtonStep2 = screen.getByText("continueButton");
    const button = continueButtonStep2.closest("button");

    // THIS TEST SHOULD FAIL in the buggy version
    // because propertyType was lost during navigation
    expect(button).not.toBeDisabled();
  });

  it("EDGE CASE: should handle direct navigation to step 2 (no prior state)", async () => {
    // User directly navigates to step 2 without going through step 1
    mockUseParams.mockReturnValue({
      locale: "fr",
      step: "property-details",
    });

    render(<CalculatorStepPage />);

    // Continue button should be disabled because propertyType is not set
    const continueButton = screen.getByText("continueButton");
    const button = continueButton.closest("button");

    expect(button).toBeDisabled();
  });
});
