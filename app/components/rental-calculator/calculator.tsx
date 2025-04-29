"use client";

import { useForm } from "@/app/context/form-context";
import { useTranslations } from "next-intl"; // Add this import
import { Progress } from "@/components/ui/progress";
import dynamic from "next/dynamic";

// Dynamically import step components
const PropertyTypeStep = dynamic(
  () => import("./property-type-step").then((mod) => mod.PropertyTypeStep),
  { ssr: false }
);
const PropertyDetailsStep = dynamic(
  () => import("./property-details-step").then((mod) => mod.PropertyDetailsStep),
  { ssr: false }
);
const FeaturesStep = dynamic(
  () => import("./features-step").then((mod) => mod.FeaturesStep),
  { ssr: false }
);
const EnergyStep = dynamic(() => import("./energy-step").then((mod) => mod.EnergyStep), {
  ssr: false,
});
const AddressStep = dynamic(
  () => import("./address-step").then((mod) => mod.AddressStep),
  { ssr: false }
);
const ResultStep = dynamic(() => import("./result-step").then((mod) => mod.ResultStep), {
  ssr: false,
});

export function RentalCalculator() {
  const { state } = useForm();
  const t = useTranslations("RentalCalculator"); // Add this hook

  // Calculate progress percentage
  const totalSteps = 6;
  const progressPercentage = (Math.min(state.step, totalSteps) / totalSteps) * 100;

  return (
    <div
      className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 transition-all duration-1000 min-h-[400px]" // Set a minimum height to prevent height changes
    >
      {state.step < totalSteps && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>
              {t("stepProgress", { currentStep: state.step, totalSteps: totalSteps - 1 })}
            </span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      )}

      {/* Render dynamic components */}
      {state.step === 1 && <PropertyTypeStep />}
      {state.step === 2 && <PropertyDetailsStep />}
      {state.step === 3 && <FeaturesStep />}
      {state.step === 4 && <EnergyStep />}
      {state.step === 5 && <AddressStep />}
      {state.step === 6 && <ResultStep />}
    </div>
  );
}
