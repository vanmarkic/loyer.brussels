"use client";

import { useEffect } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";

interface NavigationControlsProps {
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onReset?: () => void;
  nextDisabled?: boolean;
  previousDisabled?: boolean;
  nextText?: string;
  previousText?: string;
  isLoading?: boolean;
  className?: string;
}

export function NavigationControls({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onReset,
  nextDisabled = false,
  previousDisabled = false,
  nextText = "Suivant",
  previousText = "Précédent",
  isLoading = false,
  className = "",
}: NavigationControlsProps) {

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Prevent the default browser navigation
      event.preventDefault();

      // Handle the navigation based on state
      if (event.state && event.state.step) {
        // Custom navigation logic based on saved state
        const targetStep = event.state.step;
        if (targetStep < currentStep && onPrevious) {
          onPrevious();
        } else if (targetStep > currentStep && onNext) {
          onNext();
        }
      }
    };

    // Only update history if step actually changed
    const currentState = window.history.state;
    if (!currentState || currentState.step !== currentStep) {
      window.history.replaceState({ step: currentStep }, "", window.location.href);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentStep, onNext, onPrevious]);

  const handleNext = () => {
    // Add new state to history
    window.history.pushState({ step: currentStep + 1 }, "", window.location.href);

    onNext?.();
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      // Navigate using history API to maintain browser back/forward
      window.history.back();
    }

    onPrevious?.();
  };

  const handleReset = () => {
    onReset?.();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
        {/* Back button */}
        <div className="flex gap-2 flex-wrap">
          {currentStep > 1 && (
            <Button
              onClick={handlePrevious}
              disabled={previousDisabled || isLoading}
              variant="outline"
              className="flex items-center gap-2 touch-manipulation text-sm px-4 py-3 min-h-[44px] whitespace-nowrap"
            >
              <ArrowLeft className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{previousText}</span>
            </Button>
          )}
        </div>

        {/* Next/Complete button */}
        <div className="flex gap-2 sm:ml-auto flex-wrap justify-end">
          {/* Reset button (only if progress exists) */}
          {currentStep > 1 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 touch-manipulation text-red-600 hover:text-red-700 px-3 py-3 min-h-[44px] whitespace-nowrap text-sm"
                >
                  <RotateCcw className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Recommencer</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Recommencer l&apos;évaluation?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action supprimera toutes vos réponses actuelles et vous ramènera
                    au début. Cette action ne peut pas être annulée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Oui, recommencer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Next button */}
          {currentStep < totalSteps && (
            <Button
              onClick={handleNext}
              disabled={nextDisabled || isLoading}
              className="flex items-center gap-2 touch-manipulation bg-red-600 hover:bg-red-700 px-4 py-3 min-h-[44px] text-sm whitespace-nowrap"
            >
              <span className="truncate">{nextText}</span>
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Button>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="text-xs text-gray-500 text-center">
        Étape {currentStep} sur {totalSteps}
      </div>
    </div>
  );
}
