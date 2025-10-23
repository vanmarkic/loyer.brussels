import React from "react";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useReducer, useCallback, useMemo, useEffect } from "react";
import {
  GlobalFormContext,
  GlobalFormProvider,
  initialGlobalState,
  globalFormReducer,
} from "@/features/calculator/context/global-form-context";
import { PropertyInformation } from "@/features/calculator/types/global-form-types";

/**
 * UNIT TEST: GlobalFormProvider State Reset Bug
 *
 * This test verifies that creating a new GlobalFormProvider resets the state.
 * This is the root cause of the bug where propertyType is lost when navigating
 * between steps.
 *
 * BUG SCENARIO:
 * 1. Step 1 page creates a GlobalFormProviderWithStep
 * 2. User selects "apartment" - state.propertyInfo.propertyType = "apartment"
 * 3. User navigates to step 2
 * 4. Step 2 page creates a NEW GlobalFormProviderWithStep
 * 5. New provider initializes with initialGlobalState
 * 6. state.propertyInfo.propertyType is reset to ""
 *
 * THE FIX:
 * Move GlobalFormProvider to the layout level so it persists across navigation.
 */

// Simulate the buggy GlobalFormProviderWithStep from the step page
function BuggyGlobalFormProviderWithStep({
  children,
  stepNumber,
}: {
  children: React.ReactNode;
  stepNumber: number;
}) {
  // BUG: This always initializes with initialGlobalState
  const [state, dispatch] = useReducer(globalFormReducer, {
    ...initialGlobalState,
    currentStep: stepNumber,
  });

  const updatePropertyInfo = useCallback(
    (updates: Partial<PropertyInformation>) => {
      dispatch({ type: "UPDATE_PROPERTY_INFO", payload: updates });
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      updateUserProfile: vi.fn(),
      updatePropertyInfo,
      updateRentalInfo: vi.fn(),
      updateCalculationResults: vi.fn(),
      setCurrentStep: vi.fn(),
      resetForm: vi.fn(),
      getActualRent: () => "",
      getContactInfo: () => ({ email: "", phone: "" }),
    }),
    [state, updatePropertyInfo]
  );

  return (
    <GlobalFormContext.Provider value={contextValue as any}>
      {children}
    </GlobalFormContext.Provider>
  );
}

// Test component that displays and modifies the context
function TestComponent({ onStateChange }: { onStateChange: (state: any) => void }) {
  const { state, updatePropertyInfo } = React.useContext(GlobalFormContext)!;

  useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  return (
    <div>
      <div data-testid="property-type">{state.propertyInfo.propertyType}</div>
      <button
        onClick={() => updatePropertyInfo({ propertyType: "apartment" })}
        data-testid="set-apartment"
      >
        Set Apartment
      </button>
    </div>
  );
}

describe("GlobalFormProvider State Reset Bug", () => {
  afterEach(() => {
    cleanup();
  });

  it.fails("BUG REPRODUCTION: creating a new provider instance resets state to initialGlobalState", async () => {
    const states: any[] = [];
    const onStateChange = (state: any) => {
      states.push(state);
    };

    // STEP 1: Render with step 1 provider
    const { unmount, getByTestId } = render(
      <BuggyGlobalFormProviderWithStep stepNumber={1}>
        <TestComponent onStateChange={onStateChange} />
      </BuggyGlobalFormProviderWithStep>
    );

    // Verify initial state has empty propertyType
    expect(getByTestId("property-type").textContent).toBe("");

    // User selects "apartment"
    const setApartmentButton = getByTestId("set-apartment");
    fireEvent.click(setApartmentButton);

    // Wait for state update
    await waitFor(() => {
      expect(getByTestId("property-type").textContent).toBe("apartment");
    });

    // Simulate navigation: unmount the component (simulates page unload)
    unmount();

    // STEP 2: Render with step 2 provider (NEW PROVIDER INSTANCE)
    // This simulates what happens when user navigates to the next page
    const { getByTestId: getByTestId2 } = render(
      <BuggyGlobalFormProviderWithStep stepNumber={2}>
        <TestComponent onStateChange={onStateChange} />
      </BuggyGlobalFormProviderWithStep>
    );

    // BUG: The new provider resets state to initialGlobalState
    // THIS TEST WILL FAIL - proving the bug exists
    expect(getByTestId2("property-type").textContent).toBe("apartment");

    // In reality, it will be "" because the provider was recreated
    // When this test fails, it proves the bug exists
  });

  it("EXPECTED: propertyType should be empty when creating a new provider (no persistence)", async () => {
    // This test documents the ACTUAL behavior of the buggy code
    const { unmount, getByTestId } = render(
      <BuggyGlobalFormProviderWithStep stepNumber={1}>
        <TestComponent onStateChange={vi.fn()} />
      </BuggyGlobalFormProviderWithStep>
    );

    // Set apartment
    fireEvent.click(getByTestId("set-apartment"));
    await waitFor(() => {
      expect(getByTestId("property-type").textContent).toBe("apartment");
    });

    // Navigate away
    unmount();

    // Render new provider
    const { getByTestId: getByTestId2 } = render(
      <BuggyGlobalFormProviderWithStep stepNumber={2}>
        <TestComponent onStateChange={vi.fn()} />
      </BuggyGlobalFormProviderWithStep>
    );

    // propertyType is reset because it's a new provider
    expect(getByTestId2("property-type").textContent).toBe("");
  });

  it("FIXED: using a shared provider at layout level persists state", async () => {
    // THE FIX: Use a single GlobalFormProvider that persists across navigation
    // This simulates having the provider at the layout level

    const { getByTestId, rerender } = render(
      <GlobalFormProvider>
        <TestComponent onStateChange={vi.fn()} />
      </GlobalFormProvider>
    );

    // Verify initial state
    expect(getByTestId("property-type").textContent).toBe("");

    // User selects "apartment"
    fireEvent.click(getByTestId("set-apartment"));
    await waitFor(() => {
      expect(getByTestId("property-type").textContent).toBe("apartment");
    });

    // Simulate navigation by re-rendering the same provider
    // (in real app, only the children change, provider stays mounted)
    rerender(
      <GlobalFormProvider>
        <TestComponent onStateChange={vi.fn()} />
      </GlobalFormProvider>
    );

    // FIXED: propertyType is preserved because the provider didn't unmount
    expect(getByTestId("property-type").textContent).toBe("apartment");
  });
});
