"use client";

import type React from "react";

import { useForm } from "@/app/context/form-context";
import type { PropertyType } from "@/app/data/types"; // Import PropertyType from its new location
import { useTranslations } from "next-intl"; // Add this import
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Building, Home, Hotel } from "lucide-react";

export function PropertyTypeStep() {
  const { state, dispatch } = useForm();
  const t = useTranslations("PropertyTypeStep"); // Add this hook

  const handleContinue = () => {
    if (state.propertyType) {
      dispatch({ type: "NEXT_STEP" });
    }
  };

  const propertyTypes: { value: PropertyType; label: string; icon: React.ReactNode }[] = [
    {
      value: "apartment",
      label: t("types.apartment"),
      icon: <Building className="h-6 w-6" />,
    },
    { value: "house", label: t("types.house"), icon: <Home className="h-6 w-6" /> },
    { value: "studio", label: t("types.studio"), icon: <Hotel className="h-6 w-6" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <RadioGroup
        value={state.propertyType}
        onValueChange={(value) =>
          dispatch({ type: "UPDATE_FIELD", field: "propertyType", value })
        }
        className="grid grid-cols-2 gap-4"
      >
        {propertyTypes.map((type) => (
          <div key={type.value}>
            <RadioGroupItem value={type.value} id={type.value} className="peer sr-only" />
            <Label
              htmlFor={type.value}
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-[#f18240] peer-data-[state=checked]:bg-orange-50 [&:has([data-state=checked])]:border-[#f18240] [&:has([data-state=checked])]:bg-orange-50"
            >
              <div className="mb-3 rounded-full bg-orange-100 p-3 text-[#f18240]">
                {type.icon}
              </div>
              <div className="font-medium">{type.label}</div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Button
        onClick={handleContinue}
        disabled={!state.propertyType}
        className="w-full bg-[#e05c6d] hover:bg-[#d04c5d]"
      >
        {t("continueButton")}
      </Button>
    </div>
  );
}
