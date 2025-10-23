"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGlobalForm } from "@/features/calculator/context/global-form-context";
import { UnifiedCalculatorLayout } from "@/app/components/layouts/unified-calculator-layout";
import { FormProvider } from "@/features/calculator/context/form-context";
import { RentalCalculator } from "@/features/calculator/components/calculator";
import { useStepNavigation } from "@/features/calculator/hooks/use-step-navigation";
import { StepNavigationProvider } from "@/features/calculator/components/step-wrapper";

// Step mapping
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

export default function CalculatorStepPage() {
  const params = useParams();
  const router = useRouter();
  const stepParam = params.step as string;
  const currentLocale = params.locale as string;

  // Validate step parameter
  const stepNumber = STEP_MAPPING[stepParam as StepKey];

  if (!stepNumber) {
    // Invalid step, redirect to first step
    router.replace(
      `/${currentLocale}/calculateur/bruxelles/step/property-type`,
    );
    return null;
  }

  return (
    <UnifiedCalculatorLayout
      title="Évaluation Bruxelles"
      backUrl={
        stepNumber === 1
          ? `/${currentLocale}/calculateur/bruxelles`
          : `/${currentLocale}/calculateur/bruxelles/step/${REVERSE_STEP_MAPPING[(stepNumber - 1) as keyof typeof REVERSE_STEP_MAPPING]}`
      }
      backText="Retour"
      showProgress={false}
    >
      <div className="max-w-4xl mx-auto">
        <FormProvider>
          <StepNavigationProvider>
            <div className="space-y-4">
              <StepCalculator stepNumber={stepNumber} />
            </div>
          </StepNavigationProvider>
        </FormProvider>
      </div>
    </UnifiedCalculatorLayout>
  );
}

// Component that handles step-specific logic
function StepCalculator({ stepNumber }: { stepNumber: number }) {
  const { state, dispatch } = useGlobalForm();
  const { navigateToStep } = useStepNavigation();

  // Sync URL step with form state
  useEffect(() => {
    if (state.currentStep !== stepNumber) {
      dispatch({ type: "SET_CURRENT_STEP", payload: stepNumber });
    }
  }, [stepNumber, state.currentStep, dispatch]);

  // Override the global form context to use URL-based navigation
  const enhancedDispatch = (action: any) => {
    if (action.type === "SET_CURRENT_STEP") {
      navigateToStep(action.payload);
    } else {
      dispatch(action);
    }
  };

  return (
    <div className="w-full max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-1000 min-h-[500px] sm:min-h-[400px]">
      <RentalCalculator />
    </div>
  );
}
