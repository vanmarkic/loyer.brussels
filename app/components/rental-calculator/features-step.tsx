"use client";

import { useForm } from "@/app/context/form-context";
import { useTranslations } from "next-intl"; // Add this import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function FeaturesStep() {
  const { state, dispatch } = useForm();
  const t = useTranslations("FeaturesStep"); // Add this hook

  const handleContinue = () => {
    // Check if all options have been selected
    const allSelected =
      state.hasCentralHeating !== null &&
      state.hasThermalRegulation !== null &&
      state.hasDoubleGlazing !== null &&
      state.hasSecondBathroom !== null &&
      state.hasRecreationalSpaces !== null &&
      state.hasStorageSpaces !== null &&
      state.constructedBefore2000 !== null; // Add validation for construction year

    if (allSelected) {
      dispatch({ type: "NEXT_STEP" });
    }
  };

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" });
  };

  // Helper function to create radio options
  const createRadioOption = (
    field:
      | "hasCentralHeating"
      | "hasThermalRegulation"
      | "hasDoubleGlazing"
      | "hasSecondBathroom"
      | "hasRecreationalSpaces"
      | "hasStorageSpaces"
      | "constructedBefore2000", // Add new field to type
    label: string
  ) => {
    const value = state[field];

    // Determine the value for the RadioGroup explicitly
    let radioGroupValue: string | undefined;

    // For boolean fields (hasCentralHeating, etc.)
    if (typeof value === "boolean") {
      radioGroupValue = value ? "true" : "false";
    } else {
      radioGroupValue = undefined; // value is null
    }

    return (
      <div className="grid grid-cols-[2fr,1fr,1fr] items-center py-3 border-b border-gray-100">
        <div className="font-medium">{label}</div>
        <div className="flex items-center justify-center">
          <RadioGroup
            value={radioGroupValue} // Use the pre-calculated value
            onValueChange={(val) =>
              dispatch({
                type: "UPDATE_FIELD",
                field,
                value: val === "true" ? true : false,
              })
            }
            className="flex items-center space-x-4"
          >
            <>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="true" id={`${field}-true`} />
                <Label htmlFor={`${field}-true`} className="text-sm">
                  {t("yes")}
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="false" id={`${field}-false`} />
                <Label htmlFor={`${field}-false`} className="text-sm">
                  {t("no")}
                </Label>
              </div>
            </>
          </RadioGroup>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="grid grid-cols-[2fr,1fr,1fr] bg-gray-50 py-2 px-3 border-b border-gray-200">
          <div className="font-semibold">{t("tableHeaders.option")}</div>
          <div className="text-center font-semibold">{t("tableHeaders.yes")}</div>
          <div className="text-center font-semibold">{t("tableHeaders.no")}</div>
        </div>

        <div className="px-3">
          {createRadioOption("hasCentralHeating", t("options.centralHeating"))}
          {createRadioOption("hasThermalRegulation", t("options.thermalRegulation"))}
          {createRadioOption("hasDoubleGlazing", t("options.doubleGlazing"))}
          {createRadioOption("hasSecondBathroom", t("options.secondBathroom"))}
          {createRadioOption("hasRecreationalSpaces", t("options.recreationalSpaces"))}
          {createRadioOption("hasStorageSpaces", t("options.storageSpaces"))}
          {createRadioOption("constructedBefore2000", t("options.constructedBefore2000"))}

          {/* Add Garage Input Section */}
          <div className="grid grid-cols-[2fr,2fr] items-center py-3 border-t border-gray-100">
            <Label htmlFor="numberOfGarages" className="font-medium">
              {t("garageLabel")}
            </Label>
            <Input
              id="numberOfGarages"
              type="number"
              min="0"
              value={state.numberOfGarages}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  field: "numberOfGarages",
                  value: parseInt(e.target.value, 10) || 0, // Ensure it's a number, default to 0
                })
              }
              className="w-20 justify-self-center" // Adjust width and alignment as needed
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleBack} variant="outline" className="flex-1">
          {t("backButton")}
        </Button>
        <Button
          onClick={handleContinue}
          disabled={
            state.hasCentralHeating === null ||
            state.hasThermalRegulation === null ||
            state.hasDoubleGlazing === null ||
            state.hasSecondBathroom === null ||
            state.hasRecreationalSpaces === null ||
            state.hasStorageSpaces === null ||
            state.constructedBefore2000 === null // Add check for construction year
          }
          className="flex-1 bg-[#e05c6d] hover:bg-[#d04c5d]"
        >
          {t("continueButton")}
        </Button>
      </div>
    </div>
  );
}
