"use client";

import { useGlobalForm } from "@/features/calculator/context/global-form-context";
import { useTranslations } from "next-intl";
import { EnhancedProgress } from "@/components/ui/enhanced-progress";
import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import step components
const PropertyTypeStep = dynamic(
  () => import("./property-type-step").then((mod) => mod.PropertyTypeStep),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>,
  }
);
const PropertyDetailsStep = dynamic(
  () => import("./property-details-step").then((mod) => mod.PropertyDetailsStep),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>,
  }
);
const FeaturesStep = dynamic(
  () => import("./features-step").then((mod) => mod.FeaturesStep),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>,
  }
);
const EnergyStep = dynamic(() => import("./energy-step").then((mod) => mod.EnergyStep), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>,
});
const AddressStep = dynamic(
  () => import("./address-step").then((mod) => mod.AddressStep),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>,
  }
);
const ResultStep = dynamic(() => import("./result-step").then((mod) => mod.ResultStep), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>,
});
const WuuneResultStep = dynamic(
  () => import("./wuune-result-step").then((mod) => mod.WuuneResultStep),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>,
  }
);

export function RentalCalculator() {
  const { state } = useGlobalForm();
  const t = useTranslations("RentalCalculator");
  const [startTime] = useState(Date.now());
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // Update elapsed time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 60000);
      setElapsedMinutes(elapsed);
    }, 60000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Define calculator steps with time estimates
  const calculatorSteps = [
    {
      id: 1,
      name: "Type de propriété",
      estimatedMinutes: 1,
      isCompleted: state.currentStep > 1,
      isActive: state.currentStep === 1,
    },
    {
      id: 2,
      name: "Détails du bien",
      estimatedMinutes: 2,
      isCompleted: state.currentStep > 2,
      isActive: state.currentStep === 2,
    },
    {
      id: 3,
      name: "Caractéristiques",
      estimatedMinutes: 2,
      isCompleted: state.currentStep > 3,
      isActive: state.currentStep === 3,
    },
    {
      id: 4,
      name: "Performance énergétique",
      estimatedMinutes: 1,
      isCompleted: state.currentStep > 4,
      isActive: state.currentStep === 4,
    },
    {
      id: 5,
      name: "Adresse",
      estimatedMinutes: 2,
      isCompleted: state.currentStep > 5,
      isActive: state.currentStep === 5,
    },
    {
      id: 6,
      name: "Résultats",
      estimatedMinutes: 0,
      isCompleted: state.currentStep > 6,
      isActive: state.currentStep === 6,
    },
  ];

  const totalSteps = 6;
  const totalTimeMinutes = calculatorSteps.reduce(
    (sum, step) => sum + step.estimatedMinutes,
    0
  );

  return (
    <div className="w-full max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-1000 min-h-[500px] sm:min-h-[400px]">
      {state.currentStep < totalSteps && (
        <div className="mb-4 sm:mb-6">
          <EnhancedProgress
            steps={calculatorSteps}
            currentStep={state.currentStep}
            totalTimeMinutes={totalTimeMinutes}
            elapsedTimeMinutes={elapsedMinutes}
            showTimeEstimate={true}
            className="mb-4"
          />
        </div>
      )}

      {/* Render dynamic components */}
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded"></div>}>
        {state.currentStep === 1 && <PropertyTypeStep />}
        {state.currentStep === 2 && <PropertyDetailsStep />}
        {state.currentStep === 3 && <FeaturesStep />}
        {state.currentStep === 4 && <EnergyStep />}
        {state.currentStep === 5 && <AddressStep />}
        {state.currentStep === 6 && <WuuneResultStep />}
      </Suspense>
    </div>
  );
}
