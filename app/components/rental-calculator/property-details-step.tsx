"use client";

import { useState, useRef, useEffect } from "react";
import { useGlobalForm } from "@/app/context/global-form-context";
import { useTranslations } from "next-intl"; // Add this import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationControls } from "@/app/components/ui/navigation-controls";
import { useHoldRepeat } from "@/app/hooks/use-hold-repeat";
import { MinusCircle, PlusCircle, Calculator, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function PropertyDetailsStep() {
  const { state, updatePropertyInfo, dispatch } = useGlobalForm();
  const t = useTranslations("PropertyDetailsStep"); // Add this hook
  const [showAreaEstimator, setShowAreaEstimator] = useState(false);

  // Auto-increment refs and state
  const [isMouseDownOnInput, setIsMouseDownOnInput] = useState(false);
  const sizeRef = useRef<number>(state.size);
  useEffect(() => {
    sizeRef.current = state.size;
  }, [state.size]);

  // Helper functions for size increment/decrement
  const incrementSize = () => {
    const newValue = (sizeRef.current || 0) + 1;
    sizeRef.current = newValue;
    dispatch({ type: "UPDATE_FIELD", field: "size", value: newValue });
  };

  const decrementSize = () => {
    const newValue = Math.max(1, (sizeRef.current || 0) - 1);
    sizeRef.current = newValue;
    dispatch({ type: "UPDATE_FIELD", field: "size", value: newValue });
  };

  // Use the hold repeat hook for increment and decrement
  const incrementControls = useHoldRepeat({ onRepeat: incrementSize, interval: 150 });
  const decrementControls = useHoldRepeat({ onRepeat: decrementSize, interval: 150 });

  // Input-specific handlers
  const handleInputMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent focus when clicking for increment
    setIsMouseDownOnInput(true);
    incrementControls.start();
  };

  const handleInputMouseUp = () => {
    setIsMouseDownOnInput(false);
    incrementControls.stop();
  };

  const handleInputMouseLeave = () => {
    setIsMouseDownOnInput(false);
    incrementControls.stop();
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // If mouse is down, blur immediately to prevent typing mode
    if (isMouseDownOnInput) {
      e.target.blur();
    }
  };

  // Cleanup intervals on unmount and add global stop event listeners
  useEffect(() => {
    const stopAll = () => {
      setIsMouseDownOnInput(false);
      incrementControls.stop();
      decrementControls.stop();
    };

    const handleGlobalMouseUp = () => {
      if (isMouseDownOnInput) {
        stopAll();
      }
    };

    const handleVisibility = () => {
      if (document.hidden) stopAll();
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("pointerup", stopAll);
    window.addEventListener("blur", stopAll);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopAll();
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("pointerup", stopAll);
      window.removeEventListener("blur", stopAll);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isMouseDownOnInput, incrementControls, decrementControls]);

  // Smart area estimation based on property type and rooms
  const estimateAreaFromRooms = () => {
    const baseAreaPerRoom = {
      studio: 25,
      apartment: 35,
      house: 45,
    };

    const baseArea =
      baseAreaPerRoom[state.propertyType as keyof typeof baseAreaPerRoom] || 35;
    const roomMultiplier = Math.max(1, state.bedrooms);
    const estimatedArea = Math.round(baseArea * roomMultiplier * 1.2); // Include common areas

    dispatch({ type: "UPDATE_FIELD", field: "size", value: estimatedArea });
    setShowAreaEstimator(false);
  };

  // Visual area estimation helper
  const setVisualEstimate = (size: number) => {
    dispatch({ type: "UPDATE_FIELD", field: "size", value: size });
    setShowAreaEstimator(false);
  };

  const handleContinue = () => {
    if (state.size > 0 && state.propertyType) {
      dispatch({ type: "NEXT_STEP" });
    }
  };

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" });
  };

  // Update the incrementBedrooms function to limit to 4
  const incrementBedrooms = () => {
    if (state.bedrooms < 4) {
      dispatch({ type: "UPDATE_FIELD", field: "bedrooms", value: state.bedrooms + 1 });
    }
  };

  const decrementBedrooms = () => {
    if (state.bedrooms > 0) {
      dispatch({ type: "UPDATE_FIELD", field: "bedrooms", value: state.bedrooms - 1 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <div className="space-y-8">
        <div>
          <Label htmlFor="size" className="text-xl font-semibold mb-4 block">
            {t("sizeLabel")}
          </Label>

          {/* Area Input with Smart Help */}
          <div className="space-y-4">
            <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-6 gap-6 sm:gap-8">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onPointerDown={decrementControls.start}
                onPointerUp={decrementControls.stop}
                onPointerLeave={decrementControls.stop}
                onPointerCancel={decrementControls.stop}
                disabled={!state.size || state.size <= 1}
                className="h-16 w-16 border-2 hover:border-gray-400 disabled:opacity-50 touch-manipulation flex-shrink-0 select-none"
                aria-label="Diminuer la superficie par 1m²"
              >
                <MinusCircle className="h-8 w-8" />
              </Button>
              <div className="bg-white rounded-xl border-2 border-gray-200 px-6 sm:px-8 py-4 min-w-[160px] text-center">
                <div className="flex items-center justify-center gap-2">
                  <Input
                    id="size"
                    type="text"
                    value={state.size || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty input or valid numbers
                      if (value === "" || /^\d+$/.test(value)) {
                        const numValue = value === "" ? 0 : parseInt(value, 10);
                        dispatch({
                          type: "UPDATE_FIELD",
                          field: "size",
                          value: numValue,
                        });
                      }
                    }}
                    onMouseDown={handleInputMouseDown}
                    onMouseUp={handleInputMouseUp}
                    onMouseLeave={handleInputMouseLeave}
                    onFocus={handleInputFocus}
                    className="text-4xl font-bold text-center border-0 bg-transparent p-0 h-auto focus:ring-0 focus:outline-none cursor-pointer"
                    placeholder="75"
                    inputMode="numeric"
                  />
                  <span className="text-xl font-semibold text-gray-500">m²</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onPointerDown={incrementControls.start}
                onPointerUp={incrementControls.stop}
                onPointerLeave={incrementControls.stop}
                onPointerCancel={incrementControls.stop}
                className="h-16 w-16 border-2 hover:border-gray-400 touch-manipulation flex-shrink-0 select-none"
                aria-label="Augmenter la superficie par 1m²"
              >
                <PlusCircle className="h-8 w-8" />
              </Button>
            </div>

            {/* Smart Estimation Helper */}
            {!state.size && !showAreaEstimator && (
              <Alert className="bg-blue-50 border-blue-200">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="flex items-center justify-between">
                    <span>Vous ne connaissez pas la superficie exacte ?</span>
                    <Button
                      variant="outline"
                      onClick={() => setShowAreaEstimator(true)}
                      className="ml-4 border-blue-300 text-blue-700 hover:bg-blue-100 min-h-[44px] px-4 py-2 touch-manipulation"
                    >
                      <Calculator className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Estimer</span>
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Area Estimation Panel */}
            {showAreaEstimator && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Estimation de la superficie
                  </h3>

                  {/* Quick Visual Estimates */}
                  <div className="space-y-3 mb-6">
                    <p className="text-sm text-blue-800 font-medium">
                      Estimation visuelle rapide :
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setVisualEstimate(30)}
                        className="min-h-[56px] text-left p-4 hover:bg-blue-100 border-blue-300 touch-manipulation"
                        type="button"
                      >
                        <div className="text-sm w-full">
                          <div className="font-semibold">~30m²</div>
                          <div className="text-xs text-gray-600">Studio/petit appart</div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setVisualEstimate(55)}
                        className="min-h-[56px] text-left p-4 hover:bg-blue-100 border-blue-300 touch-manipulation"
                        type="button"
                      >
                        <div className="text-sm w-full">
                          <div className="font-semibold">~55m²</div>
                          <div className="text-xs text-gray-600">1 chambre</div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setVisualEstimate(75)}
                        className="min-h-[56px] text-left p-4 hover:bg-blue-100 border-blue-300 touch-manipulation"
                        type="button"
                      >
                        <div className="text-sm w-full">
                          <div className="font-semibold">~75m²</div>
                          <div className="text-xs text-gray-600">2 chambres</div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setVisualEstimate(95)}
                        className="min-h-[56px] text-left p-4 hover:bg-blue-100 border-blue-300 touch-manipulation"
                        type="button"
                      >
                        <div className="text-sm w-full">
                          <div className="font-semibold">~95m²</div>
                          <div className="text-xs text-gray-600">3+ chambres</div>
                        </div>
                      </Button>
                    </div>
                  </div>

                  {/* Smart Room-based Estimation */}
                  {state.bedrooms > 0 && (
                    <div className="border-t border-blue-200 pt-4">
                      <p className="text-sm text-blue-800 font-medium mb-3">
                        Basé sur vos {state.bedrooms} chambres :
                      </p>
                      <Button
                        onClick={estimateAreaFromRooms}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white min-h-[48px] py-3 touch-manipulation"
                        type="button"
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Estimer ~{Math.round(35 * Math.max(1, state.bedrooms) * 1.2)}m²
                        {state.propertyType === "house" && " (maison)"}
                        {state.propertyType === "studio" && " (studio)"}
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-end mt-4">
                    <Button
                      variant="ghost"
                      onClick={() => setShowAreaEstimator(false)}
                      className="text-blue-700 hover:bg-blue-100 min-h-[44px] px-4 py-2 touch-manipulation"
                    >
                      Fermer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div>
          <Label className="text-xl font-semibold mb-6 block">{t("bedroomsLabel")}</Label>
          <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-6 gap-6 sm:gap-8">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={decrementBedrooms}
              disabled={state.bedrooms === 0}
              className="h-16 w-16 border-2 hover:border-gray-400 disabled:opacity-50 touch-manipulation flex-shrink-0"
              aria-label="Diminuer le nombre de chambres"
            >
              <MinusCircle className="h-8 w-8" />
            </Button>
            <div className="bg-white rounded-xl border-2 border-gray-200 px-6 sm:px-8 py-4 min-w-[120px] text-center">
              <span className="text-4xl font-bold text-gray-800">
                {state.bedrooms === 4 ? t("bedroomsCountMax") : state.bedrooms}
              </span>
              <div className="text-sm text-gray-500 mt-1">chambres</div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={incrementBedrooms}
              disabled={state.bedrooms >= 4}
              className="h-16 w-16 border-2 hover:border-gray-400 disabled:opacity-50 touch-manipulation flex-shrink-0"
              aria-label="Augmenter le nombre de chambres"
            >
              <PlusCircle className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </div>

      <NavigationControls
        currentStep={2}
        totalSteps={6}
        onNext={handleContinue}
        onPrevious={handleBack}
        nextDisabled={state.size <= 0 || !state.propertyType}
        nextText={t("continueButton")}
        previousText={t("backButton")}
        autoSaveEnabled={true}
        autoSaveInterval={30}
        className="mt-8"
      />
    </div>
  );
}
