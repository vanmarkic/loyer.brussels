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
  const actual = await importOriginal();
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

describe("PropertyDetailsStep Navigation", () => {
  const mockPush = vi.fn();
  const mockNavigateToStep = vi.fn();
  const mockDispatch = vi.fn();

  const mockGlobalFormState = {
    currentStep: 1, // This is the bug: currentStep is still 1 when on property-details
    propertyInfo: {
      propertyType: "apartment",
      size: 50,
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
    currentPage: "calculator" as const,
    lastUpdated: Date.now(),
    sessionId: "test-session-id",
  };

  const mockSaveSession = vi.fn();
  const mockLoadSession = vi.fn();
  const mockClearSession = vi.fn();

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

    (useGlobalForm as any).mockReturnValue({
      state: mockGlobalFormState,
      dispatch: mockDispatch,
      saveSession: mockSaveSession,
      loadSession: mockLoadSession,
      clearSession: mockClearSession,
      updateUserProfile: vi.fn(),
      updatePropertyInfo: vi.fn(),
      updateRentalInfo: vi.fn(),
      updateHouseholdInfo: vi.fn(),
      updatePropertyIssues: vi.fn(),
      updateCalculationResults: vi.fn(),
      getActualRent: vi.fn(() => ""),
      getLivingSpace: vi.fn(() => 50),
      getContactInfo: vi.fn(() => ({ email: "", phone: "" })),
    });
  });

  it("should navigate to features step (3) when Continue is clicked from property-details", async () => {
    render(
      <GlobalFormProvider>
        <FormProvider>
          <StepNavigationProvider>
            <PropertyDetailsStep />
          </StepNavigationProvider>
        </FormProvider>
      </GlobalFormProvider>,
    );

    // Find and click the Continue button - the mock translation returns the key as the value
    const continueButton = screen.getByText("continueButton");
    expect(continueButton).toBeInTheDocument();

    fireEvent.click(continueButton);

    // The test should fail initially because currentStep is 1, so it navigates to step 2 (property-details again)
    // After the fix, it should navigate to step 3 (features)
    await waitFor(() => {
      expect(mockNavigateToStep).toHaveBeenCalledWith(3);
    });
  });

  it("should navigate to property-type step (1) when Back is clicked from property-details", async () => {
    render(
      <GlobalFormProvider>
        <FormProvider>
          <StepNavigationProvider>
            <PropertyDetailsStep />
          </StepNavigationProvider>
        </FormProvider>
      </GlobalFormProvider>,
    );

    // Find and click the Back button - the mock translation returns the key as the value
    const backButton = screen.getByText("backButton");
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);

    await waitFor(() => {
      expect(mockNavigateToStep).toHaveBeenCalledWith(1);
    });
  });
});
