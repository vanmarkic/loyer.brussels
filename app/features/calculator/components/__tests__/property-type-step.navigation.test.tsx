import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, useParams } from "next/navigation";
import { useGlobalForm } from "@/features/calculator/context/global-form-context";
import { useStepNavigation } from "@/features/calculator/hooks/use-step-navigation";
import { StepNavigationProvider } from "@/features/calculator/components/step-wrapper";
import { GlobalFormProvider } from "@/features/calculator/context/global-form-context";
import { FormProvider } from "@/features/calculator/context/form-context";
import { PropertyTypeStep } from "@/features/calculator/components/property-type-step";
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

describe("PropertyTypeStep Navigation", () => {
  const mockPush = vi.fn();
  const mockNavigateToStep = vi.fn();
  const mockDispatch = vi.fn();

  const mockGlobalFormState = {
    currentStep: 1,
    propertyInfo: {
      propertyType: "apartment", // Pre-selected to enable Continue button
      size: 0,
      bedrooms: 1,
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

  const mockUpdateUserProfile = vi.fn();
  const mockUpdatePropertyInfo = vi.fn();
  const mockUpdateRentalInfo = vi.fn();
  const mockUpdateCalculationResults = vi.fn();
  const mockSetCurrentStep = vi.fn();
  const mockResetForm = vi.fn();
  const mockGetActualRent = vi.fn();
  const mockGetContactInfo = vi.fn();

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
      step: "property-type",
    });

    (useStepNavigation as any).mockReturnValue({
      navigateToStep: mockNavigateToStep,
      getCurrentStepFromUrl: vi.fn(() => 1),
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
      updateUserProfile: mockUpdateUserProfile,
      updatePropertyInfo: mockUpdatePropertyInfo,
      updateRentalInfo: mockUpdateRentalInfo,
      updateCalculationResults: mockUpdateCalculationResults,
      setCurrentStep: mockSetCurrentStep,
      resetForm: mockResetForm,
      getActualRent: mockGetActualRent.mockReturnValue(""),
      getContactInfo: mockGetContactInfo.mockReturnValue({ email: "", phone: "" }),
    });
  });

  it("should dispatch SET_CURRENT_STEP and navigate to step 2 when Continue is clicked", async () => {
    render(
      <GlobalFormProvider>
        <FormProvider>
          <StepNavigationProvider>
            <PropertyTypeStep />
          </StepNavigationProvider>
        </FormProvider>
      </GlobalFormProvider>,
    );

    // Find and click the Continue button - the mock translation returns the key as the value
    const continueButton = screen.getByText("continueButton");
    expect(continueButton).toBeInTheDocument();

    fireEvent.click(continueButton);

    // The component should use the setCurrentStep convenience method
    await waitFor(() => {
      expect(mockSetCurrentStep).toHaveBeenCalledWith(2);
    });

    await waitFor(() => {
      expect(mockNavigateToStep).toHaveBeenCalledWith(2);
    });
  });

  it("should not navigate when no property type is selected", async () => {
    // Mock state with no property type selected
    const stateWithoutPropertyType = {
      ...mockGlobalFormState,
      propertyInfo: {
        ...mockGlobalFormState.propertyInfo,
        propertyType: "", // No selection
      },
    };

    (useGlobalForm as any).mockReturnValue({
      state: stateWithoutPropertyType,
      dispatch: mockDispatch,
      updateUserProfile: mockUpdateUserProfile,
      updatePropertyInfo: mockUpdatePropertyInfo,
      updateRentalInfo: mockUpdateRentalInfo,
      updateCalculationResults: mockUpdateCalculationResults,
      setCurrentStep: mockSetCurrentStep,
      resetForm: mockResetForm,
      getActualRent: mockGetActualRent.mockReturnValue(""),
      getContactInfo: mockGetContactInfo.mockReturnValue({ email: "", phone: "" }),
    });

    render(
      <GlobalFormProvider>
        <FormProvider>
          <StepNavigationProvider>
            <PropertyTypeStep />
          </StepNavigationProvider>
        </FormProvider>
      </GlobalFormProvider>,
    );

    // Find the Continue button - it should be disabled
    const continueButton = screen.getByText("continueButton");
    // The SaveContinue component renders the button with disabled attribute on the button element
    const buttonElement = continueButton.closest("button");
    expect(buttonElement).toBeDisabled();

    fireEvent.click(continueButton);

    // Should not dispatch or navigate when disabled
    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalledWith({
        type: "SET_CURRENT_STEP",
        payload: 2,
      });
    });

    expect(mockNavigateToStep).not.toHaveBeenCalled();
  });
});
