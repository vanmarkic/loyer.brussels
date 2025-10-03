"use client";

import { useState, useRef, useEffect } from "react";
import { useGlobalForm } from "@/app/context/global-form-context";
import { useTranslations } from "next-intl"; // Add this import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationControls } from "@/app/components/ui/navigation-controls";
import { useHoldRepeat } from "@/app/hooks/use-hold-repeat";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useStepNavigationContext } from "./step-wrapper";

export function PropertyDetailsStep() {
  const { state, dispatch } = useGlobalForm();
  const { navigateToStep } = useStepNavigationContext();
  const t = useTranslations("PropertyDetailsStep"); // Add this hookf

  // Auto-increment refs and state
  const [isMouseDownOnInput, setIsMouseDownOnInput] = useState(false);
  const sizeRef = useRef<number>(state.propertyInfo.size);
  const plusButtonRef = useRef<HTMLButtonElement>(null);
  const minusButtonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    sizeRef.current = state.propertyInfo.size;
  }, [state.propertyInfo.size]);

  // Bootstrap size to 1 if it's 0 (UX improvement)
  useEffect(() => {
    if (state.propertyInfo.size === 0) {
      dispatch({ type: "UPDATE_PROPERTY_INFO", payload: { size: 1 } });
    }
  }, [dispatch, state.propertyInfo.size]);

  // Helper functions for size increment/decrement
  const incrementSize = () => {
    const newValue = (sizeRef.current || 0) + 1;
    console.log(`[incrementSize] Incrementing from ${sizeRef.current} to ${newValue}`);
    sizeRef.current = newValue;
    dispatch({ type: "UPDATE_PROPERTY_INFO", payload: { size: newValue } });
  };

  const decrementSize = () => {
    const newValue = Math.max(1, (sizeRef.current || 0) - 1);
    console.log(`[decrementSize] Decrementing from ${sizeRef.current} to ${newValue}`);
    sizeRef.current = newValue;
    dispatch({ type: "UPDATE_PROPERTY_INFO", payload: { size: newValue } });
  };

  // Use the hold repeat hook for increment and decrement with acceleration
  const incrementControls = useHoldRepeat({
    onRepeat: incrementSize,
    acceleration: true,
  });
  const decrementControls = useHoldRepeat({
    onRepeat: decrementSize,
    acceleration: true,
  });

  // Expose test helpers to window for E2E tests
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

  // Click handlers that guard against double-fire when pointer events are active
  const handlePlusClick = () => {
    if (!incrementControls.isActive()) {
      incrementSize();
    }
  };

  const handleMinusClick = () => {
    if (!decrementControls.isActive()) {
      decrementSize();
    }
  };

  // Debug: Log when controls are triggered (removed to prevent infinite rerenders)
  // console.log("Hold repeat controls initialized:", {
  //   incrementActive: incrementControls.isActive(),
  //   decrementActive: decrementControls.isActive(),
  // });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMouseDownOnInput]);

  // Add native event listeners for E2E tests (dispatchEvent compatibility)
  useEffect(() => {
    const plusBtn = plusButtonRef.current;
    const minusBtn = minusButtonRef.current;
    
    const handlePlusMouseDown = () => {
      console.log("[E2E] Native mousedown on plus button");
      incrementControls.start();
    };
    const handlePlusMouseUp = () => {
      console.log("[E2E] Native mouseup on plus button");
      incrementControls.stop();
    };
    const handleMinusMouseDown = () => {
      console.log("[E2E] Native mousedown on minus button");
      decrementControls.start();
    };
    const handleMinusMouseUp = () => {
      console.log("[E2E] Native mouseup on minus button");
      decrementControls.stop();
    };
    
    if (plusBtn) {
      plusBtn.addEventListener('mousedown', handlePlusMouseDown);
      plusBtn.addEventListener('mouseup', handlePlusMouseUp);
    }
    if (minusBtn) {
      minusBtn.addEventListener('mousedown', handleMinusMouseDown);
      minusBtn.addEventListener('mouseup', handleMinusMouseUp);
    }
    
    return () => {
      if (plusBtn) {
        plusBtn.removeEventListener('mousedown', handlePlusMouseDown);
        plusBtn.removeEventListener('mouseup', handlePlusMouseUp);
      }
      if (minusBtn) {
        minusBtn.removeEventListener('mousedown', handleMinusMouseDown);
        minusBtn.removeEventListener('mouseup', handleMinusMouseUp);
      }
    };
  }, [incrementControls, decrementControls]);

  // Smart area estimation based on property type and rooms
  const estimateAreaFromRooms = () => {
    const baseAreaPerRoom = {
      studio: 25,
      apartment: 35,
      house: 45,
    };

    const baseArea =
      baseAreaPerRoom[
        state.propertyInfo.propertyType as keyof typeof baseAreaPerRoom
      ] || 35;
    const roomMultiplier = Math.max(1, state.propertyInfo.bedrooms);
    const estimatedArea = Math.round(baseArea * roomMultiplier * 1.2); // Include common areas

    dispatch({
      type: "UPDATE_PROPERTY_INFO",
      payload: { size: estimatedArea },
    });
  };

  // Visual area estimation helper
  const setVisualEstimate = (size: number) => {
    dispatch({ type: "UPDATE_PROPERTY_INFO", payload: { size: size } });
  };

  const handleContinue = () => {
    if (state.propertyInfo.size > 0 && state.propertyInfo.propertyType) {
      // Property-details is step 2, so next is step 3 (features)
      console.log("navigating to step 3");
      dispatch({ type: "SET_CURRENT_STEP", payload: 3 });
      navigateToStep(3);
    }
  };

  const handleBack = () => {
    // Property-details is step 2, so previous is step 1 (property-type)
    dispatch({ type: "SET_CURRENT_STEP", payload: 1 });
    navigateToStep(1);
  };

  // Update the incrementBedrooms function to limit to 4
  const incrementBedrooms = () => {
    if (state.propertyInfo.bedrooms < 4) {
      dispatch({
        type: "UPDATE_PROPERTY_INFO",
        payload: { bedrooms: state.propertyInfo.bedrooms + 1 },
      });
      // Property-details is step 2, so next is step 3 (features)
      dispatch({ type: "SET_CURRENT_STEP", payload: 3 });
      navigateToStep(3);
    }
  };

  const decrementBedrooms = () => {
    if (state.propertyInfo.bedrooms > 0) {
      dispatch({
        type: "UPDATE_PROPERTY_INFO",
        payload: { bedrooms: state.propertyInfo.bedrooms - 1 },
      });
      // Property-details is step 2, so next is step 3 (features)
      dispatch({ type: "SET_CURRENT_STEP", payload: 3 });
      navigateToStep(3);
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

          <div className="space-y-4">
            <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-6 gap-6 sm:gap-8">
              <Button
                ref={minusButtonRef}
                type="button"
                variant="outline"
                size="icon"
                onClick={handleMinusClick}
                onPointerDown={decrementControls.start}
                onPointerUp={decrementControls.stop}
                onPointerLeave={decrementControls.stop}
                onPointerCancel={decrementControls.stop}
                onTouchStart={decrementControls.start}
                onTouchEnd={decrementControls.stop}
                onMouseDown={decrementControls.start}
                onMouseUp={decrementControls.stop}
                onMouseLeave={decrementControls.stop}
                // onMouseCancel removed (unsupported prop)
                disabled={
                  !state.propertyInfo.size || state.propertyInfo.size <= 1
                }
                className="h-16 w-16 border-2 hover:border-gray-400 disabled:opacity-50 touch-manipulation flex-shrink-0 select-none"
                aria-label="Diminuer la superficie par 1m²"
                data-testid="decrease-size-btn"
              >
                <MinusCircle className="h-8 w-8" />
              </Button>
              <div className="bg-white rounded-xl border-2 border-gray-200 px-6 sm:px-8 py-4 min-w-[160px] text-center">
                <div className="flex items-center justify-center gap-2">
                  <Input
                    id="size"
                    type="number"
                    value={state.propertyInfo.size || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty input or valid numbers
                      if (value === "" || /^\d+$/.test(value)) {
                        const numValue = value === "" ? 0 : parseInt(value, 10);
                        sizeRef.current = numValue; // Keep ref in sync
                        dispatch({
                          type: "UPDATE_PROPERTY_INFO",
                          payload: { size: numValue },
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
                  <span className="text-xl font-semibold text-gray-500">
                    m²
                  </span>
                </div>
              </div>
              <Button
                ref={plusButtonRef}
                type="button"
                variant="outline"
                size="icon"
                onClick={handlePlusClick}
                onPointerDown={incrementControls.start}
                onPointerUp={incrementControls.stop}
                onPointerLeave={incrementControls.stop}
                onPointerCancel={incrementControls.stop}
                onTouchStart={incrementControls.start}
                onTouchEnd={incrementControls.stop}
                onMouseDown={incrementControls.start}
                onMouseUp={incrementControls.stop}
                onMouseLeave={incrementControls.stop}
                // onMouseCancel removed (unsupported prop)
                className="h-16 w-16 border-2 hover:border-gray-400 touch-manipulation flex-shrink-0 select-none"
                aria-label="Augmenter la superficie par 1m²"
                data-testid="increase-size-btn"
              >
                <PlusCircle className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xl font-semibold mb-6 block">
            {t("bedroomsLabel")}
          </Label>
          <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-6 gap-6 sm:gap-8">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={decrementBedrooms}
              disabled={state.propertyInfo.bedrooms === 0}
              className="h-16 w-16 border-2 hover:border-gray-400 disabled:opacity-50 touch-manipulation flex-shrink-0"
              aria-label="Diminuer le nombre de chambres"
            >
              <MinusCircle className="h-8 w-8" />
            </Button>
            <div className="bg-white rounded-xl border-2 border-gray-200 px-6 sm:px-8 py-4 min-w-[120px] text-center">
              <span className="text-4xl font-bold text-gray-800">
                {state.propertyInfo.bedrooms === 4
                  ? t("bedroomsCountMax")
                  : state.propertyInfo.bedrooms}
              </span>
              <div className="text-sm text-gray-500 mt-1">chambres</div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={incrementBedrooms}
              disabled={state.propertyInfo.bedrooms >= 4}
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
        nextDisabled={
          state.propertyInfo.size <= 0 || !state.propertyInfo.propertyType
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
