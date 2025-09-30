"use client";

import { useGlobalForm } from "@/app/context/global-form-context";
import { useTranslations } from "next-intl"; // Add this import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaveContinue } from "@/app/components/ui/save-continue";
import { AlertCircle, Loader2, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddressAutocomplete } from "./address-autocomplete";
import type { AddressResult } from "@/app/data/types"; // Import type from new location

export function AddressStep() {
  const { state, updatePropertyInfo, updateCalculationResults, dispatch } =
    useGlobalForm();
  const t = useTranslations("AddressStep"); // Add this hook

  const handleCalculate = async () => {
    if (
      state.propertyInfo.postalCode &&
      state.propertyInfo.streetName &&
      state.propertyInfo.streetNumber
    ) {
      // TODO: Implement difficulty index fetch and calculation
      console.log("Calculate rent for:", state.propertyInfo);
    }
  };

  const handleBack = () => {
    dispatch({ type: "SET_CURRENT_STEP", payload: Math.max(1, state.currentStep - 1) });
  };

  const handleAddressSelect = (address: AddressResult) => {
    // Clear any previous errors
    updateCalculationResults({ error: null, errorCode: null });

    updatePropertyInfo({
      postalCode: parseInt(address.postcode),
      streetName: address.streetname_fr,
      streetNumber: address.house_number,
    });

    // If we already have the difficulty index from the search, store it
    if (address.indice_synth_difficulte !== undefined) {
      updateCalculationResults({ difficultyIndex: address.indice_synth_difficulte });
    }
  };

  // Check if Supabase environment variables are available
  const hasSupabaseCredentials =
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      {!hasSupabaseCredentials && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            {t("demoModeAlert")}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6 sm:space-y-4">
        <AddressAutocomplete
          onAddressSelect={handleAddressSelect}
          label={t("autocompleteLabel")}
          placeholder={t("autocompletePlaceholder")}
        />

        <div className="pt-4 border-t border-gray-200">
          <p className="text-base sm:text-sm text-muted-foreground mb-4 sm:mb-3">
            {t("manualEntryInstruction")}
          </p>

          <div className="space-y-4 sm:space-y-3">
            <div>
              <Label htmlFor="postalCode" className="text-base sm:text-sm font-medium">
                {t("postalCodeLabel")}
              </Label>
              <Input
                id="postalCode"
                value={state.propertyInfo.postalCode || ""}
                onChange={(e) => {
                  updateCalculationResults({ error: null, errorCode: null });
                  updatePropertyInfo({
                    postalCode: parseInt(e.target.value) || 0,
                  });
                }}
                placeholder={t("postalCodePlaceholder")}
                className="mt-2 sm:mt-1 h-12 sm:h-10 text-lg sm:text-base touch-manipulation"
                inputMode="numeric"
              />
            </div>

            <div>
              <Label htmlFor="streetName" className="text-base sm:text-sm font-medium">
                {t("streetNameLabel")}
              </Label>
              <Input
                id="streetName"
                value={state.propertyInfo.streetName}
                onChange={(e) => {
                  updateCalculationResults({ error: null, errorCode: null });
                  updatePropertyInfo({
                    streetName: e.target.value,
                  });
                }}
                placeholder={t("streetNamePlaceholder")}
                className="mt-2 sm:mt-1 h-12 sm:h-10 text-lg sm:text-base touch-manipulation"
              />
            </div>

            <div>
              <Label htmlFor="streetNumber" className="text-base sm:text-sm font-medium">
                {t("streetNumberLabel")}
              </Label>
              <Input
                id="streetNumber"
                value={state.propertyInfo.streetNumber}
                onChange={(e) => {
                  updateCalculationResults({ error: null, errorCode: null });
                  updatePropertyInfo({
                    streetNumber: e.target.value,
                  });
                }}
                placeholder={t("streetNumberPlaceholder")}
                className="mt-2 sm:mt-1 h-12 sm:h-10 text-lg sm:text-base touch-manipulation"
                inputMode="numeric"
              />
            </div>
          </div>
        </div>
      </div>

      {state.calculationResults.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.calculationResults.error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleBack}
          variant="outline"
          className="w-full sm:flex-1 h-12 sm:h-10 text-base sm:text-base touch-manipulation"
        >
          {t("backButton")}
        </Button>
        <SaveContinue
          onContinue={handleCalculate}
          continueText={
            state.calculationResults.isLoading
              ? `${t("calculatingButton")}...`
              : t("calculateButton")
          }
          disabled={
            !state.propertyInfo.postalCode ||
            !state.propertyInfo.streetName ||
            !state.propertyInfo.streetNumber ||
            state.calculationResults.isLoading
          }
          isLastStep={true}
          autoSaveInterval={30}
        />
      </div>
    </div>
  );
}
