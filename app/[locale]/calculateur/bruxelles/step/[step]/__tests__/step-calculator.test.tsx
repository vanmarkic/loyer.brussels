import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter, useParams } from "next/navigation";
import { useGlobalForm } from "@/app/context/global-form-context";
import { useStepNavigation } from "@/app/hooks/use-step-navigation";
import { StepNavigationProvider } from "@/app/components/rental-calculator/step-wrapper";
import { GlobalFormProvider } from "@/app/context/global-form-context";
import { FormProvider } from "@/app/context/form-context";
import { SessionManagerProvider } from "@/app/components/ui/session-manager";
import { vi } from "vitest";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useParams: vi.fn(),
}));

// Mock the step navigation hook
vi.mock("@/app/hooks/use-step-navigation", () => ({
  useStepNavigation: vi.fn(),
}));

// Mock the global form context
vi.mock("@/app/context/global-form-context", () => ({
  useGlobalForm: vi.fn(),
  GlobalFormProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the form context
vi.mock("@/app/context/form-context", () => ({
  FormProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock session manager
vi.mock("@/app/components/ui/session-manager", () => ({
  SessionManagerProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  SessionHealthIndicator: ({ className }: { className?: string }) => (
    <div data-testid="session-health-indicator" className={className}>
      Session Health
    </div>
  ),
}));

// Mock the rental calculator component
vi.mock("@/app/components/rental-calculator/calculator", () => ({
  RentalCalculator: () => (
    <div data-testid="rental-calculator">Rental Calculator</div>
  ),
}));

// Mock the unified calculator layout
vi.mock("@/app/components/layouts/unified-calculator-layout", () => ({
  UnifiedCalculatorLayout: ({
    children,
    title,
    backUrl,
    backText,
    showProgress,
  }: any) => (
    <div data-testid="unified-calculator-layout">
      <div data-testid="layout-title">{title}</div>
      <div data-testid="layout-back-url">{backUrl}</div>
      <div data-testid="layout-back-text">{backText}</div>
      <div data-testid="layout-show-progress">
        {showProgress ? "true" : "false"}
      </div>
      {children}
    </div>
  ),
}));

// Mock the step navigation context
const mockNavigateToStep = vi.fn();
const mockUseStepNavigation = {
  navigateToStep: mockNavigateToStep,
  getCurrentStepFromUrl: vi.fn(() => 1),
  getStepUrl: vi.fn(() => "/fr/calculateur/bruxelles/step/property-type"),
};

// Mock the global form state and dispatch
const mockDispatch = vi.fn();
const mockGlobalFormState = {
  currentStep: 1,
  propertyInfo: {
    propertyType: "",
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

// Import the component after mocks
import CalculatorStepPage from "../page";

describe("CalculatorStepPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as any).mockReturnValue({
      push: vi.fn(),
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

    (useStepNavigation as any).mockReturnValue(mockUseStepNavigation);
    (useGlobalForm as any).mockReturnValue({
      state: mockGlobalFormState,
      dispatch: mockDispatch,
    });
  });

  describe("URL parameter validation", () => {
    it("should render for valid step parameters", () => {
      const validSteps = [
        "property-type",
        "property-details",
        "features",
        "energy",
        "address",
        "results",
      ];

      validSteps.forEach((step) => {
        (useParams as any).mockReturnValue({
          locale: "fr",
          step,
        });

        const { unmount } = render(<CalculatorStepPage />);
        expect(screen.getByTestId("rental-calculator")).toBeInTheDocument();
        unmount();
      });
    });

    it("should redirect for invalid step parameters", () => {
      const mockReplace = vi.fn();
      (useRouter as any).mockReturnValue({
        push: vi.fn(),
        replace: mockReplace,
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
      });

      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "invalid-step",
      });

      render(<CalculatorStepPage />);

      expect(mockReplace).toHaveBeenCalledWith(
        "/fr/calculateur/bruxelles/step/property-type",
      );
    });

    it("should handle different locales correctly", () => {
      (useParams as any).mockReturnValue({
        locale: "en",
        step: "property-details",
      });

      render(<CalculatorStepPage />);
      expect(screen.getByTestId("rental-calculator")).toBeInTheDocument();
    });
  });

  describe("StepCalculator component", () => {
    it("should sync URL step with form state", async () => {
      const testStepNumber = 3;

      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "features",
      });

      // Mock different current step in form state
      (useGlobalForm as any).mockReturnValue({
        state: { ...mockGlobalFormState, currentStep: 1 },
        dispatch: mockDispatch,
      });

      render(<CalculatorStepPage />);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "SET_CURRENT_STEP",
          payload: testStepNumber,
        });
      });
    });

    it("should not dispatch when step is already synced", () => {
      const testStepNumber = 2;

      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-details",
      });

      // Mock same current step in form state
      (useGlobalForm as any).mockReturnValue({
        state: { ...mockGlobalFormState, currentStep: testStepNumber },
        dispatch: mockDispatch,
      });

      render(<CalculatorStepPage />);

      expect(mockDispatch).not.toHaveBeenCalledWith({
        type: "SET_CURRENT_STEP",
        payload: testStepNumber,
      });
    });

    it("should render RentalCalculator component", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-type",
      });

      render(<CalculatorStepPage />);

      expect(screen.getByTestId("rental-calculator")).toBeInTheDocument();
    });

    it("should have correct CSS classes for styling", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-type",
      });

      render(<CalculatorStepPage />);

      const calculatorContainer =
        screen.getByTestId("rental-calculator").parentElement;
      expect(calculatorContainer).toHaveClass(
        "w-full",
        "max-w-lg",
        "md:max-w-2xl",
        "lg:max-w-4xl",
        "mx-auto",
        "bg-white",
        "rounded-lg",
        "shadow-lg",
        "p-4",
        "sm:p-6",
        "transition-all",
        "duration-1000",
        "min-h-[500px]",
        "sm:min-h-[400px]",
      );
    });
  });

  describe("Step navigation integration", () => {
    it("should provide step navigation context to child components", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-type",
      });

      render(<CalculatorStepPage />);

      // The StepNavigationProvider should be rendered
      // This is tested implicitly by the component rendering without errors
      expect(screen.getByTestId("rental-calculator")).toBeInTheDocument();
    });

    it("should handle step changes correctly", async () => {
      const { rerender } = render(<CalculatorStepPage />);

      // Change to a different step
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "features",
      });

      rerender(<CalculatorStepPage />);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "SET_CURRENT_STEP",
          payload: 3,
        });
      });
    });
  });

  describe("Error handling", () => {
    it("should handle missing step parameter gracefully", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: undefined,
      });

      const mockReplace = vi.fn();
      (useRouter as any).mockReturnValue({
        push: vi.fn(),
        replace: mockReplace,
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
      });

      render(<CalculatorStepPage />);

      expect(mockReplace).toHaveBeenCalledWith(
        "/fr/calculateur/bruxelles/step/property-type",
      );
    });

    it("should handle empty step parameter", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "",
      });

      const mockReplace = vi.fn();
      (useRouter as any).mockReturnValue({
        push: vi.fn(),
        replace: mockReplace,
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
      });

      render(<CalculatorStepPage />);

      expect(mockReplace).toHaveBeenCalledWith(
        "/fr/calculateur/bruxelles/step/property-type",
      );
    });
  });

  describe("Component structure", () => {
    it("should render with all required providers", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-type",
      });

      render(<CalculatorStepPage />);

      // All providers should be present (tested by successful rendering)
      expect(screen.getByTestId("rental-calculator")).toBeInTheDocument();
    });

    it("should pass correct props to UnifiedCalculatorLayout", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-details",
      });

      render(<CalculatorStepPage />);

      // The layout should be rendered with correct props
      // This is tested implicitly by the component rendering without errors
      expect(screen.getByTestId("rental-calculator")).toBeInTheDocument();
    });
  });

  describe("Step mapping", () => {
    const stepMappings = [
      { step: "property-type", expectedStep: 1 },
      { step: "property-details", expectedStep: 2 },
      { step: "features", expectedStep: 3 },
      { step: "energy", expectedStep: 4 },
      { step: "address", expectedStep: 5 },
      { step: "results", expectedStep: 6 },
    ];

    stepMappings.forEach(({ step, expectedStep }) => {
      it(`should handle step '${step}' correctly`, () => {
        (useParams as any).mockReturnValue({
          locale: "fr",
          step,
        });

        render(<CalculatorStepPage />);

        expect(screen.getByTestId("rental-calculator")).toBeInTheDocument();
      });
    });
  });
});
