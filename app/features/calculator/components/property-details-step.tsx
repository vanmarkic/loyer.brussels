"use client";

import { useRef, useEffect, useCallback } from "react";
import { useGlobalForm } from "@/features/calculator/context/global-form-context";
import { useTranslations } from "next-intl";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { NavigationControls } from "@/app/components/navigation-controls";
import { useHoldRepeat } from "@/features/calculator/hooks/use-hold-repeat";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useStepNavigationContext } from "./step-wrapper";

export function PropertyDetailsStep() {
  const { state, updatePropertyInfo, setCurrentStep } = useGlobalForm();
  const { navigateToStep } = useStepNavigationContext();
  const t = useTranslations("PropertyDetailsStep");

  const plusButtonRef = useRef<HTMLButtonElement>(null);
  const minusButtonRef = useRef<HTMLButtonElement>(null);

  // Bootstrap size to 1 if it's 0 (UX improvement)
  useEffect(() => {
    if (state.propertyInfo.size === 0) {
      updatePropertyInfo({ size: 1 });
    }
  }, [updatePropertyInfo, state.propertyInfo.size]);

  // Use a ref to track current size to avoid recreating callbacks
  const sizeRef = useRef(state.propertyInfo.size);

  // Keep ref in sync with state
  useEffect(() => {
    sizeRef.current = state.propertyInfo.size;
  }, [state.propertyInfo.size]);

  // Size increment/decrement functions - stable references
  const incrementSize = useCallback(() => {
    const currentSize = sizeRef.current;
    const newValue = currentSize + 1;
    sizeRef.current = newValue; // Update ref immediately
    updatePropertyInfo({ size: newValue });
  }, [updatePropertyInfo]);

  const decrementSize = useCallback(() => {
    const currentSize = sizeRef.current;
    const newValue = Math.max(1, currentSize - 1);
    sizeRef.current = newValue; // Update ref immediately
    updatePropertyInfo({ size: newValue });
  }, [updatePropertyInfo]);

  // Hold repeat hooks with acceleration
  const incrementControls = useHoldRepeat({
    onRepeat: incrementSize,
    acceleration: true,
  });

  const decrementControls = useHoldRepeat({
    onRepeat: decrementSize,
    acceleration: true,
  });

  // Prevent duplicate events and handle pointer interactions
  const handleIncrementStart = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only respond to primary pointer (ignore duplicate events)
    if (!e.isPrimary) return;
    incrementControls.start();
  };

  const handleIncrementStop = (e?: React.PointerEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!e.isPrimary) return;
    }
    incrementControls.stop();
  };

  const handleDecrementStart = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.isPrimary) return;
    decrementControls.start();
  };

  const handleDecrementStop = (e?: React.PointerEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!e.isPrimary) return;
    }
    decrementControls.stop();
  };

  // Expose test helpers for E2E tests
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__testHelpers = {
        startIncrement: incrementControls.start,
        stopIncrement: incrementControls.stop,
        startDecrement: decrementControls.start,
        stopDecrement: decrementControls.stop,
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__testHelpers;
      }
    };
  }, [incrementControls, decrementControls]);

  // Store controls in refs to avoid re-registering listeners
  const incrementControlsRef = useRef(incrementControls);
  const decrementControlsRef = useRef(decrementControls);

  useEffect(() => {
    incrementControlsRef.current = incrementControls;
    decrementControlsRef.current = decrementControls;
  }, [incrementControls, decrementControls]);

  // Global cleanup for pointer events - only register once
  useEffect(() => {
    const stopAll = () => {
      incrementControlsRef.current.stop();
      decrementControlsRef.current.stop();
    };

    const handleVisibility = () => {
      if (document.hidden) stopAll();
    };

    window.addEventListener("pointerup", stopAll);
    window.addEventListener("blur", stopAll);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("pointerup", stopAll);
      window.removeEventListener("blur", stopAll);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []); // Only register listeners once

  // Handle input change
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      const numValue = value === "" ? 0 : parseInt(value, 10);
      updatePropertyInfo({ size: numValue });
    }
  };

  const handleContinue = () => {
    if (
      state.propertyInfo.size > 0 &&
      !isNaN(state.propertyInfo.size) &&
      state.propertyInfo.propertyType
    ) {
      setCurrentStep(3);
      navigateToStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    navigateToStep(1);
  };

  // Bedroom increment/decrement functions
  const incrementBedrooms = () => {
    if (state.propertyInfo.bedrooms < 4) {
      updatePropertyInfo({ bedrooms: state.propertyInfo.bedrooms + 1 });
    }
  };

  const decrementBedrooms = () => {
    if (state.propertyInfo.bedrooms > 0) {
      updatePropertyInfo({ bedrooms: state.propertyInfo.bedrooms - 1 });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">{t("title")}</h2>
        <p className="text-gray-600 text-lg">{t("description")}</p>
      </div>

      <div className="space-y-10">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <Label htmlFor="size" className="text-xl font-bold mb-6 block text-gray-800 text-center">
            {t("sizeLabel")}
          </Label>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <Button
                ref={minusButtonRef}
                type="button"
                variant="outline"
                size="icon"
                onPointerDown={handleDecrementStart}
                onPointerUp={handleDecrementStop}
                onPointerLeave={handleDecrementStop}
                onPointerCancel={handleDecrementStop}
                disabled={state.propertyInfo.size <= 1}
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-transparent touch-manipulation flex-shrink-0 select-none transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="Diminuer la superficie par 1m²"
                data-testid="decrease-size-btn"
              >
                <MinusCircle className="h-7 w-7 sm:h-8 sm:w-8" />
              </Button>
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md px-6 sm:px-10 py-5 min-w-[180px] text-center hover:border-red-300 transition-all duration-200">
                <Input
                  id="size"
                  type="number"
                  value={state.propertyInfo.size || ""}
                  onChange={handleSizeChange}
                  className="!text-5xl !font-bold text-center !border-0 bg-transparent !p-0 !h-auto w-full !focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-gray-800 !leading-none"
                  placeholder="75"
                  inputMode="numeric"
                />
                <div className="text-sm font-semibold text-gray-500 mt-2">m²</div>
              </div>
              <Button
                ref={plusButtonRef}
                type="button"
                variant="outline"
                size="icon"
                onPointerDown={handleIncrementStart}
                onPointerUp={handleIncrementStop}
                onPointerLeave={handleIncrementStop}
                onPointerCancel={handleIncrementStop}
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 touch-manipulation flex-shrink-0 select-none transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="Augmenter la superficie par 1m²"
                data-testid="increase-size-btn"
              >
                <PlusCircle className="h-7 w-7 sm:h-8 sm:w-8" />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <Label className="text-xl font-bold mb-6 block text-gray-800 text-center">
            {t("bedroomsLabel")}
          </Label>
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={decrementBedrooms}
              disabled={state.propertyInfo.bedrooms === 0}
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-transparent touch-manipulation flex-shrink-0 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Diminuer le nombre de chambres"
            >
              <MinusCircle className="h-7 w-7 sm:h-8 sm:w-8" />
            </Button>
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md px-8 sm:px-10 py-5 min-w-[160px] text-center hover:border-red-300 transition-all duration-200">
              <span className="text-5xl font-bold text-gray-800 block">
                {state.propertyInfo.bedrooms === 4
                  ? t("bedroomsCountMax")
                  : state.propertyInfo.bedrooms}
              </span>
              <div className="text-sm font-semibold text-gray-500 mt-2">chambres</div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={incrementBedrooms}
              disabled={state.propertyInfo.bedrooms >= 4}
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-transparent touch-manipulation flex-shrink-0 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Augmenter le nombre de chambres"
            >
              <PlusCircle className="h-7 w-7 sm:h-8 sm:w-8" />
            </Button>
          </div>
        </div>
      </div>

      <NavigationControls
        currentStep={2}
        totalSteps={6}
        onNext={handleContinue}
        onPrevious={handleBack}
        nextDisabled={
          !state.propertyInfo.size ||
          state.propertyInfo.size <= 0 ||
          isNaN(state.propertyInfo.size) ||
          !state.propertyInfo.propertyType
        }
        nextText={t("continueButton")}
        previousText={t("backButton")}
        autoSaveEnabled={true}
        autoSaveInterval={30}
        className="mt-8"
      />
    </div>
  );
}
