'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useGlobalForm } from '@/features/calculator/context/global-form-context';

interface SaveContinueProps {
  onContinue?: () => void;
  continueText?: string;
  isLastStep?: boolean;
  disabled?: boolean;
  autoSaveInterval?: number; // in seconds
}

export function SaveContinue({
  onContinue,
  continueText = 'Continuer',
  isLastStep = false,
  disabled = false,
  autoSaveInterval = 30,
}: SaveContinueProps) {
  const { state, saveSession } = useGlobalForm();
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);

  // Save on state changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveSession();
      setLastAutoSave(new Date());
    }, 1000); // Wait 1 second after last change

    return () => clearTimeout(timeoutId);
  }, [state, saveSession]);

  // Auto-save functionality (fallback)
  useEffect(() => {
    const interval = setInterval(() => {
      saveSession();
      setLastAutoSave(new Date());
    }, autoSaveInterval * 1000);

    return () => clearInterval(interval);
  }, [autoSaveInterval, saveSession]);

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        {/* Auto-save status */}
        <div className="text-sm text-gray-600">
          {lastAutoSave ? (
            <span>✓ Sauvegardé à {lastAutoSave.toLocaleTimeString()}</span>
          ) : (
            <span>En attente de sauvegarde...</span>
          )}
        </div>

        {/* Continue Button */}
        <Button
          onClick={onContinue}
          disabled={disabled}
          className={`flex items-center gap-2 touch-manipulation text-sm sm:text-base px-4 py-2 h-10 sm:h-auto whitespace-nowrap ${
            isLastStep ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          <span className="truncate">{continueText}</span>
          <ArrowRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
