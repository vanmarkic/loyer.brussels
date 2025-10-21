"use client";

import React from "react";

import { useGlobalForm } from "@/features/calculator/context/global-form-context";
import type { PropertyType } from "@/app/data/types"; // Import PropertyType from its new location
import { useTranslations } from "next-intl"; // Add this import
import { Button } from "@/app/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";
import { SaveContinue } from "@/app/components/save-continue";
import { Building, Home, Hotel } from "lucide-react";
import { useStepNavigationContext } from "./step-wrapper";

export function PropertyTypeStep() {
  const { state, updatePropertyInfo, dispatch } = useGlobalForm();
  const { navigateToStep } = useStepNavigationContext();
  const t = useTranslations("PropertyTypeStep"); // Add this hook

  const handleContinue = () => {
    if (state.propertyInfo.propertyType) {
      const nextStep = state.currentStep + 1;
      dispatch({ type: "SET_CURRENT_STEP", payload: nextStep });
      navigateToStep(nextStep);
    }
  };

  const propertyTypes: {
    value: PropertyType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "apartment",
      label: t("types.apartment"),
      icon: <Building className="h-6 w-6" />,
    },
    {
      value: "house",
      label: t("types.house"),
      icon: <Home className="h-6 w-6" />,
    },
    {
      value: "studio",
      label: t("types.studio"),
      icon: <Hotel className="h-6 w-6" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <RadioGroup
        value={state.propertyInfo.propertyType}
        onValueChange={(value) =>
          updatePropertyInfo({ propertyType: value as PropertyType })
        }
        className="grid grid-cols-1 gap-6"
      >
        {propertyTypes.map((type) => (
          <div key={type.value}>
            <RadioGroupItem
              value={type.value}
              id={type.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={type.value}
              className="flex items-center gap-6 rounded-xl border-3 border-muted bg-white p-8 hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg peer-data-[state=checked]:border-[#f18240] peer-data-[state=checked]:bg-orange-50 peer-data-[state=checked]:shadow-xl [&:has([data-state=checked])]:border-[#f18240] [&:has([data-state=checked])]:bg-orange-50 [&:has([data-state=checked])]:shadow-xl cursor-pointer min-h-[100px] touch-manipulation transition-all duration-200"
            >
              <div className="rounded-full bg-orange-100 p-6 text-[#f18240]">
                {React.cloneElement(type.icon as React.ReactElement, {
                  className: "h-12 w-12",
                })}
              </div>
              <div className="flex-1">
                <div className="font-bold text-xl text-gray-800">
                  {type.label}
                </div>
                <div className="text-gray-600 mt-2">
                  Cliquez pour sélectionner
                </div>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <SaveContinue
        onContinue={handleContinue}
        continueText={t("continueButton")}
        disabled={!state.propertyInfo.propertyType}
        autoSaveInterval={30}
      />
    </div>
  );
}
