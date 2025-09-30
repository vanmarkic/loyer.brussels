"use client";

import { useGlobalForm } from "@/app/context/global-form-context";
import { useTranslations } from "next-intl"; // Add this import
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, RefreshCw, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EnergyClass } from "@/app/data/types";

// Helper function to get energy class styling
const getEnergyClassStyle = (energyClass: string) => {
  const styles = {
    A: {
      default:
        "bg-green-100 border-green-300 text-green-800 hover:bg-green-200",
      selected: "bg-green-600 border-green-600 text-white shadow-lg",
    },
    B: {
      default: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
      selected: "bg-green-500 border-green-500 text-white shadow-lg",
    },
    C: {
      default:
        "bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200",
      selected: "bg-yellow-600 border-yellow-600 text-white shadow-lg",
    },
    D: {
      default:
        "bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200",
      selected: "bg-orange-600 border-orange-600 text-white shadow-lg",
    },
    E: {
      default: "bg-red-100 border-red-300 text-red-800 hover:bg-red-200",
      selected: "bg-red-600 border-red-600 text-white shadow-lg",
    },
    F: {
      default: "bg-red-200 border-red-400 text-red-900 hover:bg-red-300",
      selected: "bg-red-700 border-red-700 text-white shadow-lg",
    },
    G: {
      default: "bg-red-300 border-red-500 text-red-900 hover:bg-red-400",
      selected: "bg-red-800 border-red-800 text-white shadow-lg",
    },
  };
  return styles[energyClass as keyof typeof styles] || styles.G;
};

export function EnergyStep() {
  const { state, updatePropertyInfo, updateCalculationResults, dispatch } =
    useGlobalForm();
  const t = useTranslations("EnergyStep"); // Add this hook

  const handleBack = () => {
    dispatch({
      type: "SET_CURRENT_STEP",
      payload: Math.max(1, state.currentStep - 1),
    });
  };

  const handleContinue = () => {
    if (state.propertyInfo.energyClass) {
      dispatch({ type: "SET_CURRENT_STEP", payload: state.currentStep + 1 });
    }
  };

  // Function to render appropriate error message with action buttons
  const renderErrorMessage = () => {
    if (!state.calculationResults.error) return null;

    // Different error types might need different actions
    switch (state.calculationResults.errorCode) {
      case "DATABASE_ERROR":
        return (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("error.databaseErrorTitle")}</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{state.calculationResults.error}</p>
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    updateCalculationResults({ error: null, errorCode: null });
                  }}
                  className="text-sm flex items-center gap-1 min-h-[44px] px-4 py-2 touch-manipulation"
                >
                  <RefreshCw className="h-3 w-3" /> {t("error.retryButton")}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        );

      default:
        return (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {state.calculationResults.error}
            </AlertDescription>
          </Alert>
        );
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

      {renderErrorMessage()}

      <div className="space-y-8">
        <div>
          <Label className="text-xl font-semibold mb-6 block">
            {t("energyClassLabel")}
          </Label>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {(["A", "B", "C", "D", "E", "F", "G"] as const).map(
              (energyClass) => (
                <button
                  key={energyClass}
                  type="button"
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_PROPERTY_INFO",
                      payload: { energyClass: energyClass },
                    })
                  }
                  className={`
                  aspect-square rounded-xl border-3 font-bold text-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg min-h-[48px] min-w-[48px] touch-manipulation
                  ${
                    state.propertyInfo.energyClass === energyClass
                      ? getEnergyClassStyle(energyClass).selected
                      : getEnergyClassStyle(energyClass).default
                  }
                `}
                  aria-label={`Classe énergétique ${energyClass}`}
                >
                  {energyClass}
                </button>
              ),
            )}
          </div>

          <p className="text-sm text-gray-600 text-center mt-4">
            Sélectionnez la classe énergétique de votre logement
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-6">
        <Button
          onClick={handleContinue}
          disabled={!state.propertyInfo.energyClass}
          className="w-full bg-[#e05c6d] hover:bg-[#d04c5d] h-16 text-lg font-semibold rounded-xl"
        >
          {t("continueButton")}
        </Button>
        <Button
          onClick={handleBack}
          variant="outline"
          className="w-full h-14 text-base border-2 hover:border-gray-400 rounded-xl"
        >
          {t("backButton")}
        </Button>
      </div>
    </div>
  );
}
