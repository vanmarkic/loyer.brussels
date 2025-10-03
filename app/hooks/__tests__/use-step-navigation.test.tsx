import { renderHook } from "@testing-library/react";
import { useRouter, useParams } from "next/navigation";
import { useStepNavigation } from "@/features/calculator/hooks/use-step-navigation";
import { vi } from "vitest";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useParams: vi.fn(),
}));

const mockPush = vi.fn();
const mockRouter = {
  push: mockPush,
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

describe("useStepNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
  });

  describe("navigateToStep", () => {
    it("should navigate to correct step URL for valid step numbers", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-type",
      });

      const { result } = renderHook(() => useStepNavigation());

      // Test navigation to step 2
      result.current.navigateToStep(2);
      expect(mockPush).toHaveBeenCalledWith(
        "/fr/calculateur/bruxelles/step/property-details",
      );

      // Test navigation to step 3
      result.current.navigateToStep(3);
      expect(mockPush).toHaveBeenCalledWith(
        "/fr/calculateur/bruxelles/step/features",
      );

      // Test navigation to step 4
      result.current.navigateToStep(4);
      expect(mockPush).toHaveBeenCalledWith(
        "/fr/calculateur/bruxelles/step/energy",
      );

      // Test navigation to step 5
      result.current.navigateToStep(5);
      expect(mockPush).toHaveBeenCalledWith(
        "/fr/calculateur/bruxelles/step/address",
      );

      // Test navigation to step 6
      result.current.navigateToStep(6);
      expect(mockPush).toHaveBeenCalledWith(
        "/fr/calculateur/bruxelles/step/results",
      );
    });

    it("should not navigate for invalid step numbers", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-type",
      });

      const { result } = renderHook(() => useStepNavigation());

      // Test invalid step numbers
      result.current.navigateToStep(0);
      expect(mockPush).not.toHaveBeenCalled();

      result.current.navigateToStep(7);
      expect(mockPush).not.toHaveBeenCalled();

      result.current.navigateToStep(-1);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should handle different locales correctly", () => {
      (useParams as any).mockReturnValue({
        locale: "en",
        step: "property-type",
      });

      const { result } = renderHook(() => useStepNavigation());

      result.current.navigateToStep(2);
      expect(mockPush).toHaveBeenCalledWith(
        "/en/calculateur/bruxelles/step/property-details",
      );
    });
  });

  describe("getCurrentStepFromUrl", () => {
    it("should return correct step number for valid step parameters", () => {
      const testCases = [
        { step: "property-type", expected: 1 },
        { step: "property-details", expected: 2 },
        { step: "features", expected: 3 },
        { step: "energy", expected: 4 },
        { step: "address", expected: 5 },
        { step: "results", expected: 6 },
      ];

      testCases.forEach(({ step, expected }) => {
        (useParams as any).mockReturnValue({
          locale: "fr",
          step,
        });

        const { result } = renderHook(() => useStepNavigation());
        expect(result.current.getCurrentStepFromUrl()).toBe(expected);
      });
    });

    it("should return 1 for invalid step parameters", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "invalid-step",
      });

      const { result } = renderHook(() => useStepNavigation());
      expect(result.current.getCurrentStepFromUrl()).toBe(1);
    });

    it("should return 1 for undefined step parameter", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: undefined,
      });

      const { result } = renderHook(() => useStepNavigation());
      expect(result.current.getCurrentStepFromUrl()).toBe(1);
    });
  });

  describe("getStepUrl", () => {
    it("should return correct URL for valid step numbers", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-type",
      });

      const { result } = renderHook(() => useStepNavigation());

      expect(result.current.getStepUrl(1)).toBe(
        "/fr/calculateur/bruxelles/step/property-type",
      );
      expect(result.current.getStepUrl(2)).toBe(
        "/fr/calculateur/bruxelles/step/property-details",
      );
      expect(result.current.getStepUrl(3)).toBe(
        "/fr/calculateur/bruxelles/step/features",
      );
      expect(result.current.getStepUrl(4)).toBe(
        "/fr/calculateur/bruxelles/step/energy",
      );
      expect(result.current.getStepUrl(5)).toBe(
        "/fr/calculateur/bruxelles/step/address",
      );
      expect(result.current.getStepUrl(6)).toBe(
        "/fr/calculateur/bruxelles/step/results",
      );
    });

    it("should return null for invalid step numbers", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-type",
      });

      const { result } = renderHook(() => useStepNavigation());

      expect(result.current.getStepUrl(0)).toBeNull();
      expect(result.current.getStepUrl(7)).toBeNull();
      expect(result.current.getStepUrl(-1)).toBeNull();
    });

    it("should handle different locales correctly", () => {
      (useParams as any).mockReturnValue({
        locale: "nl",
        step: "property-type",
      });

      const { result } = renderHook(() => useStepNavigation());

      expect(result.current.getStepUrl(2)).toBe(
        "/nl/calculateur/bruxelles/step/property-details",
      );
    });
  });

  describe("hook stability", () => {
    it("should return stable function references", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "property-type",
      });

      const { result, rerender } = renderHook(() => useStepNavigation());

      const firstRender = {
        navigateToStep: result.current.navigateToStep,
        getCurrentStepFromUrl: result.current.getCurrentStepFromUrl,
        getStepUrl: result.current.getStepUrl,
      };

      rerender();

      const secondRender = {
        navigateToStep: result.current.navigateToStep,
        getCurrentStepFromUrl: result.current.getCurrentStepFromUrl,
        getStepUrl: result.current.getStepUrl,
      };

      expect(firstRender.navigateToStep).toBe(secondRender.navigateToStep);
      expect(firstRender.getCurrentStepFromUrl).toBe(
        secondRender.getCurrentStepFromUrl,
      );
      expect(firstRender.getStepUrl).toBe(secondRender.getStepUrl);
    });
  });

  describe("edge cases", () => {
    it("should handle missing locale parameter", () => {
      (useParams as any).mockReturnValue({
        step: "property-type",
      });

      const { result } = renderHook(() => useStepNavigation());

      // Should still work with undefined locale
      result.current.navigateToStep(2);
      expect(mockPush).toHaveBeenCalledWith(
        "/undefined/calculateur/bruxelles/step/property-details",
      );
    });

    it("should handle empty string step parameter", () => {
      (useParams as any).mockReturnValue({
        locale: "fr",
        step: "",
      });

      const { result } = renderHook(() => useStepNavigation());
      expect(result.current.getCurrentStepFromUrl()).toBe(1);
    });
  });
});
