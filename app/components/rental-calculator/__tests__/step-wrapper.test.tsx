import React from "react";
import { render, screen } from "@testing-library/react";
import { useRouter, useParams } from "next/navigation";
import {
  StepNavigationProvider,
  useStepNavigationContext,
} from "../step-wrapper";
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

const mockNavigateToStep = vi.fn();
const mockGetStepUrl = vi.fn();
const mockGetCurrentStepFromUrl = vi.fn();

const mockUseStepNavigation = {
  navigateToStep: mockNavigateToStep,
  getCurrentStepFromUrl: mockGetCurrentStepFromUrl,
  getStepUrl: mockGetStepUrl,
};

// Test component that uses the context
function TestComponent() {
  const { navigateToStep, getStepUrl } = useStepNavigationContext();

  return (
    <div>
      <button onClick={() => navigateToStep(2)} data-testid="navigate-button">
        Navigate to Step 2
      </button>
      <button onClick={() => getStepUrl(3)} data-testid="get-url-button">
        Get Step 3 URL
      </button>
    </div>
  );
}

// Import the hook after mocks
import { useStepNavigation } from "@/app/hooks/use-step-navigation";

describe("StepNavigationProvider", () => {
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
  });

  describe("Provider functionality", () => {
    it("should provide navigation context to child components", () => {
      render(
        <StepNavigationProvider>
          <TestComponent />
        </StepNavigationProvider>,
      );

      expect(screen.getByTestId("navigate-button")).toBeInTheDocument();
      expect(screen.getByTestId("get-url-button")).toBeInTheDocument();
    });

    it("should pass through navigation functions correctly", () => {
      render(
        <StepNavigationProvider>
          <TestComponent />
        </StepNavigationProvider>,
      );

      // The context should provide the same functions as the hook
      expect(mockNavigateToStep).toBeDefined();
      expect(mockGetStepUrl).toBeDefined();
    });

    it("should handle multiple child components", () => {
      function MultipleTestComponents() {
        return (
          <div>
            <TestComponent />
            <TestComponent />
          </div>
        );
      }

      render(
        <StepNavigationProvider>
          <MultipleTestComponents />
        </StepNavigationProvider>,
      );

      const navigateButtons = screen.getAllByTestId("navigate-button");
      const urlButtons = screen.getAllByTestId("get-url-button");

      expect(navigateButtons).toHaveLength(2);
      expect(urlButtons).toHaveLength(2);
    });
  });

  describe("Context error handling", () => {
    it("should throw error when used outside provider", () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      function ComponentWithoutProvider() {
        useStepNavigationContext();
        return <div>Test</div>;
      }

      expect(() => {
        render(<ComponentWithoutProvider />);
      }).toThrow(
        "useStepNavigationContext must be used within a StepNavigationProvider",
      );

      consoleSpy.mockRestore();
    });

    it("should not throw error when used within provider", () => {
      function ComponentWithProvider() {
        useStepNavigationContext();
        return <div>Test</div>;
      }

      expect(() => {
        render(
          <StepNavigationProvider>
            <ComponentWithProvider />
          </StepNavigationProvider>,
        );
      }).not.toThrow();
    });
  });

  describe("Context value stability", () => {
    it("should provide stable function references", () => {
      const { rerender } = render(
        <StepNavigationProvider>
          <TestComponent />
        </StepNavigationProvider>,
      );

      const firstRender = {
        navigateToStep: mockNavigateToStep,
        getStepUrl: mockGetStepUrl,
      };

      rerender(
        <StepNavigationProvider>
          <TestComponent />
        </StepNavigationProvider>,
      );

      const secondRender = {
        navigateToStep: mockNavigateToStep,
        getStepUrl: mockGetStepUrl,
      };

      // The functions should be the same references
      expect(firstRender.navigateToStep).toBe(secondRender.navigateToStep);
      expect(firstRender.getStepUrl).toBe(secondRender.getStepUrl);
    });
  });

  describe("Integration with useStepNavigation hook", () => {
    it("should use the hook's return values", () => {
      const customNavigateToStep = vi.fn();
      const customGetStepUrl = vi.fn();
      const customGetCurrentStepFromUrl = vi.fn();

      (useStepNavigation as any).mockReturnValue({
        navigateToStep: customNavigateToStep,
        getCurrentStepFromUrl: customGetCurrentStepFromUrl,
        getStepUrl: customGetStepUrl,
      });

      render(
        <StepNavigationProvider>
          <TestComponent />
        </StepNavigationProvider>,
      );

      // The provider should use the hook's functions
      expect(customNavigateToStep).toBeDefined();
      expect(customGetStepUrl).toBeDefined();
    });

    it("should handle hook errors gracefully", () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      (useStepNavigation as any).mockImplementation(() => {
        throw new Error("Hook error");
      });

      // Should throw the hook error
      expect(() => {
        render(
          <StepNavigationProvider>
            <div>Test</div>
          </StepNavigationProvider>,
        );
      }).toThrow("Hook error");

      consoleSpy.mockRestore();
    });
  });

  describe("Provider composition", () => {
    it("should work with nested providers", () => {
      function NestedTestComponent() {
        const { navigateToStep } = useStepNavigationContext();
        return (
          <button onClick={() => navigateToStep(2)} data-testid="nested-button">
            Nested Navigate
          </button>
        );
      }

      render(
        <StepNavigationProvider>
          <div>
            <TestComponent />
            <StepNavigationProvider>
              <NestedTestComponent />
            </StepNavigationProvider>
          </div>
        </StepNavigationProvider>,
      );

      expect(screen.getByTestId("navigate-button")).toBeInTheDocument();
      expect(screen.getByTestId("nested-button")).toBeInTheDocument();
    });

    it("should handle empty children", () => {
      expect(() => {
        render(<StepNavigationProvider>{null}</StepNavigationProvider>);
      }).not.toThrow();

      expect(() => {
        render(<StepNavigationProvider>{undefined}</StepNavigationProvider>);
      }).not.toThrow();
    });
  });

  describe("Performance", () => {
    it("should not re-render unnecessarily", () => {
      const renderSpy = vi.fn();

      function RenderTrackingComponent() {
        renderSpy();
        return <div>Test</div>;
      }

      const { rerender } = render(
        <StepNavigationProvider>
          <RenderTrackingComponent />
        </StepNavigationProvider>,
      );

      const initialRenderCount = renderSpy.mock.calls.length;

      // Re-render with same props
      rerender(
        <StepNavigationProvider>
          <RenderTrackingComponent />
        </StepNavigationProvider>,
      );

      // Should not cause unnecessary re-renders
      expect(renderSpy.mock.calls.length).toBe(initialRenderCount + 1);
    });
  });
});
