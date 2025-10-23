'use client';

import { useEffect, useCallback } from 'react';

interface UseEnhancedNavigationOptions {
  currentStep: number;
  totalSteps: number;
  onStepChange?: (newStep: number, direction: 'forward' | 'backward') => void;
  preventUnload?: boolean;
}

export function useEnhancedNavigation({
  currentStep,
  totalSteps,
  onStepChange,
  preventUnload = true,
}: UseEnhancedNavigationOptions) {

  // Handle browser navigation (back/forward buttons)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Extract step information from browser state
      const newStep = event.state?.step || 1;
      const direction = newStep > currentStep ? 'forward' : 'backward';

      onStepChange?.(newStep, direction);
    };

    // Set initial state in browser history
    const currentState = {
      step: currentStep,
      timestamp: Date.now(),
    };

    // Replace current state if it doesn't exist, otherwise just listen
    if (!window.history.state || window.history.state.step !== currentStep) {
      window.history.replaceState(currentState, '', window.location.href);
    }

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentStep, onStepChange]);

  // Handle page unload protection
  useEffect(() => {
    if (!preventUnload) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Show warning if user has made progress
      if (currentStep > 1) {
        const message =
          'Vous perdrez votre progression si vous quittez. Continuer?';
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentStep, preventUnload]);

  // Navigation functions
  const navigateToStep = useCallback(
    (targetStep: number, pushToHistory = true) => {
      if (targetStep < 1 || targetStep > totalSteps) {
        console.warn(`Invalid step: ${targetStep}. Must be between 1 and ${totalSteps}`);
        return false;
      }

      // Update browser history
      if (pushToHistory) {
        const newState = {
          step: targetStep,
          timestamp: Date.now(),
        };

        if (targetStep > currentStep) {
          window.history.pushState(newState, '', window.location.href);
        } else {
          window.history.replaceState(newState, '', window.location.href);
        }
      }

      const direction = targetStep > currentStep ? 'forward' : 'backward';
      onStepChange?.(targetStep, direction);

      return true;
    },
    [currentStep, totalSteps, onStepChange]
  );

  const goToNextStep = useCallback(() => {
    return navigateToStep(currentStep + 1, true);
  }, [currentStep, navigateToStep]);

  const goToPreviousStep = useCallback(() => {
    return navigateToStep(currentStep - 1, false);
  }, [currentStep, navigateToStep]);

  const goToFirstStep = useCallback(() => {
    return navigateToStep(1, false);
  }, [navigateToStep]);

  const canGoNext = currentStep < totalSteps;
  const canGoPrevious = currentStep > 1;

  return {
    navigateToStep,
    goToNextStep,
    goToPreviousStep,
    goToFirstStep,
    canGoNext,
    canGoPrevious,
    currentStep,
    totalSteps,
  };
}
