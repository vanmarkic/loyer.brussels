import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useParams, useRouter } from "next/navigation";
import { PropertyTypeStep } from "@/features/calculator/components/property-type-step";
import { StepNavigationProvider } from "@/features/calculator/components/step-wrapper";
import { GlobalFormContext, initialGlobalState, globalFormReducer } from "@/features/calculator/context/global-form-context";
import { useReducer, useMemo, useCallback } from "react";
import { PropertyInformation } from "@/features/calculator/types/global-form-types";
import { vi } from "vitest";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

// Mock next-intl useTranslations
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Replicate the buggy GlobalFormProviderWithStep from the step page
function BuggyGlobalFormProviderWithStep({
  children,
  stepNumber,
}: {
  children: React.ReactNode;
  stepNumber: number;
}) {
  const [state, dispatch] = useReducer(globalFormReducer, {
    ...initialGlobalState,
    currentStep: stepNumber,
    propertyInfo: {
      ...initialGlobalState.propertyInfo,
      propertyType: "apartment", // Pre-select to enable continue button
    },
  });

  // Replicate all context methods EXCEPT setCurrentStep (this is the bug!)
  const updateUserProfile = (updates: any) =>
    dispatch({ type: "UPDATE_USER_PROFILE", payload: updates });
  const updatePropertyInfo = (updates: Partial<PropertyInformation>) =>
    dispatch({ type: "UPDATE_PROPERTY_INFO", payload: updates });
  const updateRentalInfo = (updates: any) =>
    dispatch({ type: "UPDATE_RENTAL_INFO", payload: updates });
  const updateCalculationResults = (updates: any) =>
    dispatch({ type: "UPDATE_CALCULATION_RESULTS", payload: updates });

  const getActualRent = useCallback(() => state.rentalInfo.actualRent, [state.rentalInfo.actualRent]);
  const getContactInfo = useCallback(() => ({
    email: state.userProfile.email,
    phone: state.userProfile.phone,
  }), [state.userProfile.email, state.userProfile.phone]);

  // Notice: setCurrentStep is missing here!
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      updateUserProfile,
      updatePropertyInfo,
      updateRentalInfo,
      updateCalculationResults,
      getActualRent,
      getContactInfo,
      // setCurrentStep is NOT included - this causes the bug
    }),
    [state, getActualRent, getContactInfo],
  );

  return (
    <GlobalFormContext.Provider value={contextValue as any}>
      {children}
    </GlobalFormContext.Provider>
  );
}

// Fixed version with setCurrentStep included
function FixedGlobalFormProviderWithStep({
  children,
  stepNumber,
}: {
  children: React.ReactNode;
  stepNumber: number;
}) {
  const [state, dispatch] = useReducer(globalFormReducer, {
    ...initialGlobalState,
    currentStep: stepNumber,
    propertyInfo: {
      ...initialGlobalState.propertyInfo,
      propertyType: "apartment", // Pre-select to enable continue button
    },
  });

  // Replicate all context methods including setCurrentStep (fix!)
  const updateUserProfile = useCallback((updates: any) =>
    dispatch({ type: "UPDATE_USER_PROFILE", payload: updates }), []);
  const updatePropertyInfo = useCallback((updates: Partial<PropertyInformation>) =>
    dispatch({ type: "UPDATE_PROPERTY_INFO", payload: updates }), []);
  const updateRentalInfo = useCallback((updates: any) =>
    dispatch({ type: "UPDATE_RENTAL_INFO", payload: updates }), []);
  const updateCalculationResults = useCallback((updates: any) =>
    dispatch({ type: "UPDATE_CALCULATION_RESULTS", payload: updates }), []);
  const setCurrentStep = useCallback((step: number) =>
    dispatch({ type: "SET_CURRENT_STEP", payload: step }), []);
  const resetForm = useCallback(() =>
    dispatch({ type: "RESET_FORM" }), []);

  const getActualRent = useCallback(() => state.rentalInfo.actualRent, [state.rentalInfo.actualRent]);
  const getContactInfo = useCallback(() => ({
    email: state.userProfile.email,
    phone: state.userProfile.phone,
  }), [state.userProfile.email, state.userProfile.phone]);

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      updateUserProfile,
      updatePropertyInfo,
      updateRentalInfo,
      updateCalculationResults,
      setCurrentStep,
      resetForm,
      getActualRent,
      getContactInfo,
    }),
    [state, updateUserProfile, updatePropertyInfo, updateRentalInfo, updateCalculationResults, setCurrentStep, resetForm, getActualRent, getContactInfo],
  );

  return (
    <GlobalFormContext.Provider value={contextValue as any}>
      {children}
    </GlobalFormContext.Provider>
  );
}

describe("PropertyTypeStep - setCurrentStep missing bug", () => {
  const mockNavigateToStep = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useParams as any).mockReturnValue({
      locale: "fr",
      step: "property-type",
    });

    (useRouter as any).mockReturnValue({
      push: mockNavigateToStep,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });
  });

  it("should work correctly when setCurrentStep IS provided in the context", () => {
    // This test verifies the fix works
    render(
      <FixedGlobalFormProviderWithStep stepNumber={1}>
        <StepNavigationProvider>
          <PropertyTypeStep />
        </StepNavigationProvider>
      </FixedGlobalFormProviderWithStep>
    );

    // Click the continue button - this should NOT throw
    const continueButton = screen.getByText("continueButton");
    expect(() => {
      fireEvent.click(continueButton);
    }).not.toThrow();

    // Verify navigation was called
    expect(mockNavigateToStep).toHaveBeenCalled();
  });
});
