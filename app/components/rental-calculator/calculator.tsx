"use client";

import { useForm } from "@/app/context/form-context";
import { useTranslations } from "next-intl"; // Add this import
import { PropertyTypeStep } from "./property-type-step";
import { PropertyDetailsStep } from "./property-details-step";
import { AddressStep } from "./address-step";
import { FeaturesStep } from "./features-step";
import { EnergyStep } from "./energy-step";
import { ResultStep } from "./result-step";
import { Progress } from "@/components/ui/progress";

export function RentalCalculator() {
  const { state } = useForm();
  const t = useTranslations("RentalCalculator"); // Add this hook

  // Calculate progress percentage
  const totalSteps = 6;
  const progressPercentage = (Math.min(state.step, totalSteps) / totalSteps) * 100;

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
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

      {state.step === 1 && <PropertyTypeStep />}
      {state.step === 2 && <PropertyDetailsStep />}
      {state.step === 3 && <FeaturesStep />}
      {state.step === 4 && <EnergyStep />}
      {state.step === 5 && <AddressStep />}
      {state.step === 6 && <ResultStep />}
    </div>
  );
}
