import React from "react";
import { render, screen } from "@testing-library/react";
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

describe("PropertyDetailsStep - Session Restoration Bug", () => {
  const mockPush = vi.fn();
  const mockNavigateToStep = vi.fn();
  const mockDispatch = vi.fn();

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

  it("BUG: button stays disabled after session restoration when propertyType becomes empty string", async () => {
    // This reproduces the exact bug from the localStorage state provided:
    // {
    //   "size": 0,  // <-- Duplicate size at root
    //   "propertyInfo": {
    //     "propertyType": "",  // <-- Empty string after restoration!
    //     "size": 5,
    //   }
    // }

    const mockGlobalFormState = {
      size: 0, // This shouldn't be here - it's a schema bug
      currentStep: 2,
      currentPage: "calculator" as const,
      propertyInfo: {
        postalCode: 0,
        streetName: "",
        streetNumber: "",
        propertyType: "", // Empty string - this is the BUG
        size: 5, // Size is valid
        bedrooms: 2,
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
      householdInfo: {
        monthlyIncome: "",
        householdComposition: "",
        paymentDelays: "",
        evictionThreats: "",
        mediationAttempts: "",
      },
      propertyIssues: {
        healthIssues: [],
        majorDefects: [],
        positiveAspects: [],
        additionalComments: "",
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
      lastUpdated: 1761043299279,
      sessionId: "mh0fpjnecmnf8wqf7qm",
    };

    (useGlobalForm as any).mockReturnValue({
      state: mockGlobalFormState,
      dispatch: mockDispatch,
      saveSession: vi.fn(),
      loadSession: vi.fn(),
      clearSession: vi.fn(),
      updateUserProfile: vi.fn(),
      updatePropertyInfo: vi.fn(),
      updateRentalInfo: vi.fn(),
      updateHouseholdInfo: vi.fn(),
      updatePropertyIssues: vi.fn(),
      updateCalculationResults: vi.fn(),
      getActualRent: vi.fn(() => ""),
      getLivingSpace: vi.fn(() => 5),
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

    // The button SHOULD be disabled because propertyType is empty
    // This is the bug - after session restoration, propertyType becomes ""
    const continueButton = screen.getByText("continueButton").closest("button");
    expect(continueButton).toBeDisabled();

    // This test documents the bug - propertyType should NOT be empty after restoration
    // The user had selected "apartment" but it got lost during restoration
  });

  it("should enable button when session is properly restored with valid propertyType", async () => {
    // This is what SHOULD happen after fixing the bug
    const mockGlobalFormState = {
      // Remove the duplicate size field
      currentStep: 2,
      currentPage: "calculator" as const,
      propertyInfo: {
        postalCode: 0,
        streetName: "",
        streetNumber: "",
        propertyType: "apartment", // This should be preserved after restoration
        size: 26,
        bedrooms: 2,
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
      householdInfo: {
        monthlyIncome: "",
        householdComposition: "",
        paymentDelays: "",
        evictionThreats: "",
        mediationAttempts: "",
      },
      propertyIssues: {
        healthIssues: [],
        majorDefects: [],
        positiveAspects: [],
        additionalComments: "",
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
      lastUpdated: Date.now(),
      sessionId: "test-session-id",
    };

    (useGlobalForm as any).mockReturnValue({
      state: mockGlobalFormState,
      dispatch: mockDispatch,
      saveSession: vi.fn(),
      loadSession: vi.fn(),
      clearSession: vi.fn(),
      updateUserProfile: vi.fn(),
      updatePropertyInfo: vi.fn(),
      updateRentalInfo: vi.fn(),
      updateHouseholdInfo: vi.fn(),
      updatePropertyIssues: vi.fn(),
      updateCalculationResults: vi.fn(),
      getActualRent: vi.fn(() => ""),
      getLivingSpace: vi.fn(() => 26),
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

    // After fixing the session restoration bug, the button should be enabled
    const continueButton = screen.getByText("continueButton").closest("button");
    expect(continueButton).not.toBeDisabled();
  });
});
