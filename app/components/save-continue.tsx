'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface SaveContinueProps {
  onContinue?: () => void;
  continueText?: string;
  isLastStep?: boolean;
  disabled?: boolean;
}

export function SaveContinue({
  onContinue,
  continueText = 'Continuer',
  isLastStep = false,
  disabled = false,
}: SaveContinueProps) {
  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end items-stretch sm:items-center">
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
