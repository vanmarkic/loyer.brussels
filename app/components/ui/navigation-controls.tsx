'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';
import { useGlobalForm } from '@/app/context/global-form-context';

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
  autoSaveEnabled?: boolean;
  autoSaveInterval?: number; // in seconds
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
  nextText = 'Suivant',
  previousText = 'Précédent',
  isLoading = false,
  autoSaveEnabled = true,
  autoSaveInterval = 30,
  className = '',
}: NavigationControlsProps) {
  const { state, saveSession, clearSession } = useGlobalForm();
  const [lastSave, setLastSave] = useState<Date | null>(null);
  const [isNavigationWarningOpen, setIsNavigationWarningOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<'next' | 'previous' | null>(
    null
  );

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const interval = setInterval(() => {
      saveSession();
      setLastSave(new Date());
    }, autoSaveInterval * 1000);

    return () => clearInterval(interval);
  }, [autoSaveEnabled, autoSaveInterval, saveSession]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Prevent the default browser navigation
      event.preventDefault();

      // Save current state before navigation
      saveSession();

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

    // Add state to history for current step
    const currentState = { step: currentStep, data: state };
    window.history.replaceState(currentState, '', window.location.href);

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentStep, state, saveSession, onNext, onPrevious]);

  // Handle page unload (refresh, close)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Save session before page unload
      saveSession();

      // Show warning if user has unsaved progress
      if (currentStep > 1) {
        const message =
          'Vous avez des données non sauvegardées. Êtes-vous sûr de vouloir quitter?';
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentStep, saveSession]);

  const handleNext = () => {
    if (currentStep > 1) {
      // Save before navigation
      saveSession();
      setLastSave(new Date());
    }

    // Add new state to history
    const nextState = { step: currentStep + 1, data: state };
    window.history.pushState(nextState, '', window.location.href);

    onNext?.();
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      // Save before navigation
      saveSession();
      setLastSave(new Date());

      // Navigate using history API to maintain browser back/forward
      window.history.back();
    }

    onPrevious?.();
  };

  const handleReset = () => {
    clearSession();
    setLastSave(null);
    onReset?.();
  };

  const manualSave = () => {
    saveSession();
    setLastSave(new Date());
  };

  const formatLastSave = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Auto-save indicator */}
      {lastSave && (
        <div className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
          <Save className="h-3 w-3" />
          Dernière sauvegarde: {formatLastSave(lastSave)}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
        {/* Back button */}
        <div className="flex gap-2 flex-wrap">
          {currentStep > 1 && (
            <Button
              onClick={handlePrevious}
              disabled={previousDisabled || isLoading}
              variant="outline"
              className="flex items-center gap-2 touch-manipulation text-sm px-3 py-2 h-10 whitespace-nowrap"
            >
              <ArrowLeft className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{previousText}</span>
            </Button>
          )}

          {/* Manual save button (always available) */}
          <Button
            onClick={manualSave}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 touch-manipulation px-2 py-2 h-10 whitespace-nowrap"
            title="Sauvegarder manuellement"
          >
            <Save className="h-4 w-4 flex-shrink-0" />
          </Button>
        </div>

        {/* Next/Complete button */}
        <div className="flex gap-2 sm:ml-auto flex-wrap justify-end">
          {/* Reset button (only if progress exists) */}
          {currentStep > 1 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 touch-manipulation text-red-600 hover:text-red-700 px-3 py-2 h-10 whitespace-nowrap text-sm"
                >
                  <RotateCcw className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Recommencer</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Recommencer l'évaluation?</AlertDialogTitle>
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
              className="flex items-center gap-2 touch-manipulation bg-red-600 hover:bg-red-700 px-4 py-2 h-10 text-sm whitespace-nowrap"
            >
              <span className="truncate">{nextText}</span>
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Button>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="text-xs text-gray-500 text-center">
        Étape {currentStep} sur {totalSteps} • Navigation sécurisée activée
      </div>
    </div>
  );
}
