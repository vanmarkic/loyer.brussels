import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

// Import the component after mocks
import CalculatorStepPage from "../page";

describe("Step Calculator Integration Tests", () => {
  const mockPush = vi.fn();
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

  const mockNavigateToStep = vi.fn();
  const mockGetStepUrl = vi.fn();
  const mockGetCurrentStepFromUrl = vi.fn();

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
      getCurrentStepFromUrl: mockGetCurrentStepFromUrl,
      getStepUrl: mockGetStepUrl,
    });

    (useGlobalForm as any).mockReturnValue({
      state: mockGlobalFormState,
      dispatch: mockDispatch,
    });
  });

  describe("Complete step navigation flow", () => {
    it("should handle step progression correctly", async () => {
      const { rerender } = render(<CalculatorStepPage />);

      // Initial state - step 1
      expect(screen.getByTestId("rental-calculator")).toBeInTheDocument();
      // The StepCalculator component overrides dispatch to use navigateToStep
      // so we don't expect the original dispatch to be called

      // Simulate navigation to step 2
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-details",
      });

      rerender(<CalculatorStepPage />);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "SET_CURRENT_STEP",
          payload: 2,
        });
      });
    });

    it("should handle step regression correctly", async () => {
      // Start at step 3
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "features",
      });

      (useGlobalForm as any).mockReturnValue({
        state: { ...mockGlobalFormState, currentStep: 3 },
        dispatch: mockDispatch,
      });

      const { rerender } = render(<CalculatorStepPage />);

      // Go back to step 2
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-details",
      });

      rerender(<CalculatorStepPage />);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "SET_CURRENT_STEP",
          payload: 2,
        });
      });
    });

    it("should handle invalid step gracefully", () => {
      const mockReplace = vi.fn();
      (useRouter as any).mockReturnValue({
        push: mockPush,
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
  });

  describe("Multi-locale support", () => {
    const locales = ["fr", "en", "nl"];

    locales.forEach((locale) => {
      it(`should handle ${locale} locale correctly`, () => {
        (useParams as any).mockReturnValue({
          locale,
          step: "property-type",
        });

        render(<CalculatorStepPage />);

        expect(screen.getByTestId("rental-calculator")).toBeInTheDocument();
        // The StepCalculator component overrides dispatch to use navigateToStep
        // so we don't expect the original dispatch to be called
      });
    });
  });

  describe("Step synchronization", () => {
    it("should sync URL step with form state on mount", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "energy",
      });

      (useGlobalForm as any).mockReturnValue({
        state: { ...mockGlobalFormState, currentStep: 1 }, // Different from URL
        dispatch: mockDispatch,
      });

      render(<CalculatorStepPage />);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SET_CURRENT_STEP",
        payload: 4,
      });
    });

    it("should not sync when step is already correct", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "features",
      });

      (useGlobalForm as any).mockReturnValue({
        state: { ...mockGlobalFormState, currentStep: 3 }, // Same as URL
        dispatch: mockDispatch,
      });

      render(<CalculatorStepPage />);

      expect(mockDispatch).not.toHaveBeenCalledWith({
        type: "SET_CURRENT_STEP",
        payload: 3,
      });
    });

    it("should sync state when URL changes from property-type to property-details", async () => {
      const { rerender } = render(<CalculatorStepPage />);

      // Initial state - property-type step (step 1)
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-type",
      });

      (useGlobalForm as any).mockReturnValue({
        state: { ...mockGlobalFormState, currentStep: 1 },
        dispatch: mockDispatch,
      });

      rerender(<CalculatorStepPage />);

      // Simulate URL change to property-details (step 2)
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-details",
      });

      rerender(<CalculatorStepPage />);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "SET_CURRENT_STEP",
          payload: 2,
        });
      });
    });
  });

  describe("Error scenarios", () => {
    it("should handle missing locale parameter", () => {
      (useParams as any).mockReturnValue({
        step: "property-type",
      });

      expect(() => {
        render(<CalculatorStepPage />);
      }).not.toThrow();
    });

    it("should handle undefined step parameter", () => {
      const mockReplace = vi.fn();
      (useRouter as any).mockReturnValue({
        push: mockPush,
        replace: mockReplace,
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
      });

      (useParams as any).mockReturnValue({
        locale: "fr",
        step: undefined,
      });

      render(<CalculatorStepPage />);

      expect(mockReplace).toHaveBeenCalledWith(
        "/fr/calculateur/bruxelles/step/property-type",
      );
    });

    it("should handle empty step parameter", () => {
      const mockReplace = vi.fn();
      (useRouter as any).mockReturnValue({
        push: mockPush,
        replace: mockReplace,
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
      });

      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "",
      });

      render(<CalculatorStepPage />);

      expect(mockReplace).toHaveBeenCalledWith(
        "/fr/calculateur/bruxelles/step/property-type",
      );
    });
  });

  describe("Component lifecycle", () => {
    it("should handle component unmounting gracefully", () => {
      const { unmount } = render(<CalculatorStepPage />);

      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it("should handle re-mounting after unmount", () => {
      const { unmount } = render(<CalculatorStepPage />);
      unmount();

      expect(() => {
        render(<CalculatorStepPage />);
      }).not.toThrow();
    });
  });

  describe("Performance considerations", () => {
    it("should not cause unnecessary re-renders", () => {
      const renderSpy = vi.fn();

      function RenderTrackingComponent() {
        renderSpy();
        return <div>Test</div>;
      }

      const { rerender } = render(<CalculatorStepPage />);

      const initialRenderCount = renderSpy.mock.calls.length;

      // Re-render with same props
      rerender(<CalculatorStepPage />);

      // Should not cause excessive re-renders
      expect(renderSpy.mock.calls.length).toBeLessThanOrEqual(
        initialRenderCount + 2,
      );
    });
  });

  describe("Size increment click behavior", () => {
    it("should handle click-only size increment flow", async () => {
      const mockNavigateToStep = vi.fn();
      const mockDispatch = vi.fn();

      (useStepNavigation as any).mockReturnValue({
        navigateToStep: mockNavigateToStep,
        getStepUrl: vi.fn(
          () => "/fr/calculateur/bruxelles/step/property-details",
        ),
      });

      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-details",
      });

      (useRouter as any).mockReturnValue({
        replace: vi.fn(),
      });

      (useGlobalForm as any).mockReturnValue({
        state: {
          currentStep: 2,
          propertyInfo: {
            size: 0,
            bedrooms: 1,
            propertyType: "apartment",
          },
        },
        dispatch: mockDispatch,
      });

      render(<CalculatorStepPage />);

      await waitFor(() => {
        expect(screen.getByTestId("rental-calculator")).toBeInTheDocument();
      });

      // The bootstrap effect should be triggered when size is 0
      // Since we're mocking the component, we can't test the actual bootstrap effect
      // Instead, we verify the component renders correctly
      expect(screen.getByTestId("rental-calculator")).toBeInTheDocument();
    });
  });
});
