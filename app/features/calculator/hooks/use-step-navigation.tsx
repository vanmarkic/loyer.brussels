"use client";

import { useRouter, useParams } from "next/navigation";
import { useCallback } from "react";

// Step mapping for URL parameters
const STEP_MAPPING = {
  "property-type": 1,
  "property-details": 2,
  features: 3,
  energy: 4,
  address: 5,
  results: 6,
} as const;

const REVERSE_STEP_MAPPING = {
  1: "property-type",
  2: "property-details",
  3: "features",
  4: "energy",
  5: "address",
  6: "results",
} as const;

type StepKey = keyof typeof STEP_MAPPING;

export function useStepNavigation() {
  const router = useRouter();
  const params = useParams();
  const currentLocale = params.locale as string;

  const navigateToStep = useCallback(
    (stepNumber: number) => {
      const stepKey =
        REVERSE_STEP_MAPPING[stepNumber as keyof typeof REVERSE_STEP_MAPPING];
      if (stepKey) {
        router.push(`/${currentLocale}/calculateur/bruxelles/step/${stepKey}`);
      }
    },
    [router, currentLocale],
  );

  const getCurrentStepFromUrl = useCallback(() => {
    const stepParam = params.step as string;
    return STEP_MAPPING[stepParam as StepKey] || 1;
  }, [params.step]);

  const getStepUrl = useCallback(
    (stepNumber: number) => {
      const stepKey =
        REVERSE_STEP_MAPPING[stepNumber as keyof typeof REVERSE_STEP_MAPPING];
      return stepKey
        ? `/${currentLocale}/calculateur/bruxelles/step/${stepKey}`
        : null;
    },
    [currentLocale],
  );

  return {
    navigateToStep,
    getCurrentStepFromUrl,
    getStepUrl,
  };
}
