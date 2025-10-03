'use client';

import { useEffect, useCallback } from 'react';
import { useGlobalForm } from '@/features/calculator/context/global-form-context';

interface UseEnhancedNavigationOptions {
  currentStep: number;
  totalSteps: number;
  onStepChange?: (newStep: number, direction: 'forward' | 'backward') => void;
  preventUnload?: boolean;
  autoSave?: boolean;
}

export function useEnhancedNavigation({
  currentStep,
  totalSteps,
  onStepChange,
  preventUnload = true,
  autoSave = true,
}: UseEnhancedNavigationOptions) {
  const { state, saveSession } = useGlobalForm();

  // Handle browser navigation (back/forward buttons)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (autoSave) {
        saveSession();
      }

      // Extract step information from browser state
      const newStep = event.state?.step || 1;
      const direction = newStep > currentStep ? 'forward' : 'backward';

      onStepChange?.(newStep, direction);
    };

    // Set initial state in browser history
    const currentState = {
      step: currentStep,
      timestamp: Date.now(),
      sessionId: state.sessionId,
    };

    // Replace current state if it doesn't exist, otherwise just listen
    if (!window.history.state || window.history.state.step !== currentStep) {
      window.history.replaceState(currentState, '', window.location.href);
    }

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentStep, state.sessionId, onStepChange, autoSave, saveSession]);

  // Handle page unload protection
  useEffect(() => {
    if (!preventUnload) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Auto-save before unload
      if (autoSave) {
        saveSession();
      }

      // Show warning if user has made progress
      if (currentStep > 1) {
        const message =
          'Votre progression sera sauvegardée, mais vous perdrez votre place actuelle. Continuer?';
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    const handleUnload = () => {
      if (autoSave) {
        // Use sendBeacon for reliable saving during unload
        try {
          const dataToSave = JSON.stringify({
            ...state,
            lastUpdated: Date.now(),
          });

          // Store in sessionStorage as backup
          sessionStorage.setItem('loyer-brussels-form-data', dataToSave);

          // If available, use sendBeacon for more reliable transmission
          if (navigator.sendBeacon && false) {
            // Disabled for now as we're using localStorage
            const formData = new FormData();
            formData.append('sessionData', dataToSave);
            navigator.sendBeacon('/api/save-session', formData);
          }
        } catch (error) {
          console.warn('Failed to save session during unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [currentStep, preventUnload, autoSave, saveSession, state]);

  // Navigation functions
  const navigateToStep = useCallback(
    (targetStep: number, pushToHistory = true) => {
      if (targetStep < 1 || targetStep > totalSteps) {
        console.warn(`Invalid step: ${targetStep}. Must be between 1 and ${totalSteps}`);
        return false;
      }

      // Save current state before navigation
      if (autoSave) {
        saveSession();
      }

      // Update browser history
      if (pushToHistory) {
        const newState = {
          step: targetStep,
          timestamp: Date.now(),
          sessionId: state.sessionId,
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
    [currentStep, totalSteps, autoSave, saveSession, state.sessionId, onStepChange]
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
