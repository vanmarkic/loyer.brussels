import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, useParams } from "next/navigation";
import { useGlobalForm } from "@/features/calculator/context/global-form-context";
import { useStepNavigation } from "@/features/calculator/hooks/use-step-navigation";
import { StepNavigationProvider } from "@/features/calculator/components/step-wrapper";
import { GlobalFormProvider } from "@/features/calculator/context/global-form-context";
import { FormProvider } from "@/features/calculator/context/form-context";
import { PropertyDetailsStep } from "@/features/calculator/components/property-details-step";
import { vi } from "vitest";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useParams: vi.fn(),
}));

// Mock the step navigation hook
vi.mock("@/features/calculator/hooks/use-step-navigation", () => ({
  useStepNavigation: vi.fn(),
}));

// Mock the global form context
vi.mock("@/features/calculator/context/global-form-context", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/calculator/context/global-form-context")>();
  return {
    ...actual,
    useGlobalForm: vi.fn(),
    GlobalFormProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock the form context
vi.mock("@/features/calculator/context/form-context", () => ({
  FormProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next-intl useTranslations
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock the hold repeat hook
vi.mock("@/features/calculator/hooks/use-hold-repeat", () => ({
  useHoldRepeat: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    isActive: () => false,
  }),
}));

describe("PropertyDetailsStep - Disabled Button Bug Reproduction", () => {
  const mockPush = vi.fn();
  const mockNavigateToStep = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as any).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });

    (useParams as any).mockReturnValue({
      locale: "fr",
      step: "property-details",
    });

    (useStepNavigation as any).mockReturnValue({
      navigateToStep: mockNavigateToStep,
      getCurrentStepFromUrl: vi.fn(() => 2),
      getStepUrl: vi.fn((step: number) => {
        const stepMap: Record<number, string> = {
          1: "/fr/calculateur/bruxelles/step/property-type",
          2: "/fr/calculateur/bruxelles/step/property-details",
          3: "/fr/calculateur/bruxelles/step/features",
          4: "/fr/calculateur/bruxelles/step/energy",
          5: "/fr/calculateur/bruxelles/step/address",
          6: "/fr/calculateur/bruxelles/step/results",
        };
        return stepMap[step] || null;
      }),
    });
  });

  it("BUG: button stays disabled even when propertyType is set and size is valid but was previously 0", async () => {
    // SCENARIO: User lands on page with propertyType set, but size = 0
    // The useEffect bootstraps size from 0 to 1
    // But during the brief moment between renders, the button check uses <= 0 validation
    // If the dispatch doesn't trigger a re-render immediately, button stays disabled

    const mockGlobalFormState = {
      currentStep: 2,
      propertyInfo: {
        propertyType: "apartment", // This is SET
        size: 1, // Size has been bootstrapped to 1 by useEffect
        bedrooms: 0,
        bathrooms: 1,
        numberOfGarages: 0,
        energyClass: "",
        constructedBefore2000: null,
        propertyState: null,
        hasCentralHeating: null,
        hasThermalRegulation: null,
        hasDoubleGlazing: null,
        hasSecondBathroom: null,
        hasRecreationalSpaces: null,
        hasStorageSpaces: null,
      },
      userProfile: {
        email: "",
        phone: "",
        joinNewsletter: false,
        joinAssembly: false,
      },
      rentalInfo: {
        actualRent: "",
        leaseType: "",
        leaseStartDate: "",
        rentIndexation: "",
        boilerMaintenance: false,
        fireInsurance: false,
      },
      calculationResults: {
        difficultyIndex: null,
        medianRent: null,
        minRent: null,
        maxRent: null,
        isLoading: false,
        error: null,
        errorCode: null,
      },
      currentPage: "calculator" as const,
    };

    (useGlobalForm as any).mockReturnValue({
      state: mockGlobalFormState,
      updateUserProfile: vi.fn(),
      updatePropertyInfo: vi.fn(),
      updateRentalInfo: vi.fn(),
      updateCalculationResults: vi.fn(),
      setCurrentStep: vi.fn(),
      resetForm: vi.fn(),
      getActualRent: vi.fn(() => ""),
      getContactInfo: vi.fn(() => ({ email: "", phone: "" })),
    });

    render(
      <GlobalFormProvider>
        <FormProvider>
          <StepNavigationProvider>
            <PropertyDetailsStep />
          </StepNavigationProvider>
        </FormProvider>
      </GlobalFormProvider>,
    );

    // The button SHOULD be enabled (both propertyType and size are valid)
    // But the BUG is that it stays disabled
    const continueButtonText = screen.getByText("continueButton");
    const continueButton = continueButtonText.closest("button");

    // This should pass, but if there's a bug with the validation logic, it might fail
    expect(continueButton).not.toBeDisabled();
  });

  it("BUG: button enabled state doesn't properly reflect valid form state after rapid changes", async () => {
    // This reproduces a scenario where:
    // 1. User types a value in size input
    // 2. Validation check happens before state update completes
    // 3. Button stays disabled even though all fields are valid

    // Start with invalid state (size = 0)
    let currentSize = 0;

    const mockGlobalFormState = {
      currentStep: 2,
      propertyInfo: {
        propertyType: "apartment",
        get size() {
          return currentSize;
        },
        bedrooms: 0,
        bathrooms: 1,
        numberOfGarages: 0,
        energyClass: "",
        constructedBefore2000: null,
        propertyState: null,
        hasCentralHeating: null,
        hasThermalRegulation: null,
        hasDoubleGlazing: null,
        hasSecondBathroom: null,
        hasRecreationalSpaces: null,
        hasStorageSpaces: null,
      },
      userProfile: {
        email: "",
        phone: "",
        joinNewsletter: false,
        joinAssembly: false,
      },
      rentalInfo: {
        actualRent: "",
        leaseType: "",
        leaseStartDate: "",
        rentIndexation: "",
        boilerMaintenance: false,
        fireInsurance: false,
      },
      calculationResults: {
        difficultyIndex: null,
        medianRent: null,
        minRent: null,
        maxRent: null,
        isLoading: false,
        error: null,
        errorCode: null,
      },
      currentPage: "calculator" as const,
    };

    const mockUpdatePropertyInfo = vi.fn((updates) => {
      if (updates.size !== undefined) {
        currentSize = updates.size;
      }
    });

    (useGlobalForm as any).mockReturnValue({
      state: mockGlobalFormState,
      updateUserProfile: vi.fn(),
      updatePropertyInfo: mockUpdatePropertyInfo,
      updateRentalInfo: vi.fn(),
      updateCalculationResults: vi.fn(),
      setCurrentStep: vi.fn(),
      resetForm: vi.fn(),
      getActualRent: vi.fn(() => ""),
      getContactInfo: vi.fn(() => ({ email: "", phone: "" })),
    });

    const { rerender } = render(
      <GlobalFormProvider>
        <FormProvider>
          <StepNavigationProvider>
            <PropertyDetailsStep />
          </StepNavigationProvider>
        </FormProvider>
      </GlobalFormProvider>,
    );

    // useEffect bootstraps size from 0 to 1
    // Since we're using convenience methods now, we check if updatePropertyInfo was called
    await waitFor(() => {
      // The bootstrap effect should call updatePropertyInfo with size: 1
      expect(mockUpdatePropertyInfo).toHaveBeenCalledWith({ size: 1 });
    }, { timeout: 100 });

    // Force re-render to pick up the state change
    rerender(
      <GlobalFormProvider>
        <FormProvider>
          <StepNavigationProvider>
            <PropertyDetailsStep />
          </StepNavigationProvider>
        </FormProvider>
      </GlobalFormProvider>,
    );

    // NOW the button should be enabled
    // If this fails, it means the button validation is not properly reactive to state changes
    await waitFor(() => {
      const continueButton = screen.getByText("continueButton").closest("button");
      expect(continueButton).not.toBeDisabled();
    });
  });

  it("EDGE CASE: button should be disabled when size is NaN", async () => {
    // This tests an edge case where size might become NaN due to invalid input
    const mockGlobalFormState = {
      currentStep: 2,
      propertyInfo: {
        propertyType: "apartment",
        size: NaN, // This could happen from parseInt("invalid")
        bedrooms: 0,
        bathrooms: 1,
        numberOfGarages: 0,
        energyClass: "",
        constructedBefore2000: null,
        propertyState: null,
        hasCentralHeating: null,
        hasThermalRegulation: null,
        hasDoubleGlazing: null,
        hasSecondBathroom: null,
        hasRecreationalSpaces: null,
        hasStorageSpaces: null,
      },
      userProfile: {
        email: "",
        phone: "",
        joinNewsletter: false,
        joinAssembly: false,
      },
      rentalInfo: {
        actualRent: "",
        leaseType: "",
        leaseStartDate: "",
        rentIndexation: "",
        boilerMaintenance: false,
        fireInsurance: false,
      },
      calculationResults: {
        difficultyIndex: null,
        medianRent: null,
        minRent: null,
        maxRent: null,
        isLoading: false,
        error: null,
        errorCode: null,
      },
      currentPage: "calculator" as const,
    };

    (useGlobalForm as any).mockReturnValue({
      state: mockGlobalFormState,
      updateUserProfile: vi.fn(),
      updatePropertyInfo: vi.fn(),
      updateRentalInfo: vi.fn(),
      updateCalculationResults: vi.fn(),
      setCurrentStep: vi.fn(),
      resetForm: vi.fn(),
      getActualRent: vi.fn(() => ""),
      getContactInfo: vi.fn(() => ({ email: "", phone: "" })),
    });

    render(
      <GlobalFormProvider>
        <FormProvider>
          <StepNavigationProvider>
            <PropertyDetailsStep />
          </StepNavigationProvider>
        </FormProvider>
      </GlobalFormProvider>,
    );

    // When size is NaN, the button should be disabled
    // Current check: size <= 0 - this will be FALSE for NaN (NaN <= 0 is false)
    // This is a BUG! NaN <= 0 returns false, so button would be enabled when it shouldn't be
    const continueButton = screen.getByText("continueButton").closest("button");

    // This test SHOULD FAIL because the validation doesn't check for NaN
    // The button will be ENABLED (not disabled) when size is NaN
    expect(continueButton).toBeDisabled();
  });

  it("EDGE CASE: button should be disabled when propertyType is empty string (not null/undefined)", async () => {
    // This tests an edge case where propertyType might be set to empty string
    const mockGlobalFormState = {
      currentStep: 2,
      propertyInfo: {
        propertyType: "", // Empty string is falsy, but might not be caught by !propertyType
        size: 75,
        bedrooms: 0,
        bathrooms: 1,
        numberOfGarages: 0,
        energyClass: "",
        constructedBefore2000: null,
        propertyState: null,
        hasCentralHeating: null,
        hasThermalRegulation: null,
        hasDoubleGlazing: null,
        hasSecondBathroom: null,
        hasRecreationalSpaces: null,
        hasStorageSpaces: null,
      },
      userProfile: {
        email: "",
        phone: "",
        joinNewsletter: false,
        joinAssembly: false,
      },
      rentalInfo: {
        actualRent: "",
        leaseType: "",
        leaseStartDate: "",
        rentIndexation: "",
        boilerMaintenance: false,
        fireInsurance: false,
      },
      calculationResults: {
        difficultyIndex: null,
        medianRent: null,
        minRent: null,
        maxRent: null,
        isLoading: false,
        error: null,
        errorCode: null,
      },
      currentPage: "calculator" as const,
    };

    (useGlobalForm as any).mockReturnValue({
      state: mockGlobalFormState,
      updateUserProfile: vi.fn(),
      updatePropertyInfo: vi.fn(),
      updateRentalInfo: vi.fn(),
      updateCalculationResults: vi.fn(),
      setCurrentStep: vi.fn(),
      resetForm: vi.fn(),
      getActualRent: vi.fn(() => ""),
      getContactInfo: vi.fn(() => ({ email: "", phone: "" })),
    });

    render(
      <GlobalFormProvider>
        <FormProvider>
          <StepNavigationProvider>
            <PropertyDetailsStep />
          </StepNavigationProvider>
        </FormProvider>
      </GlobalFormProvider>,
    );

    // When propertyType is empty string, the button SHOULD be disabled
    // Current check: !propertyType - this should work since "" is falsy
    const continueButton = screen.getByText("continueButton").closest("button");
    expect(continueButton).toBeDisabled();
  });
});
