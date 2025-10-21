'use client';

import { Clock, CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface ProgressStep {
  id: number;
  name: string;
  estimatedMinutes: number;
  isCompleted: boolean;
  isActive: boolean;
}

interface EnhancedProgressProps {
  steps: ProgressStep[];
  currentStep: number;
  totalTimeMinutes: number;
  elapsedTimeMinutes?: number;
  showTimeEstimate?: boolean;
  className?: string;
}

export function EnhancedProgress({
  steps,
  currentStep,
  totalTimeMinutes,
  elapsedTimeMinutes = 0,
  showTimeEstimate = true,
  className,
}: EnhancedProgressProps) {
  const completedSteps = steps.filter((step) => step.isCompleted).length;
  const progressPercentage = (completedSteps / steps.length) * 100;
  const remainingTime = Math.max(0, totalTimeMinutes - elapsedTimeMinutes);

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Progress Bar with Time Estimate */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-700">
          Étape {currentStep} sur {steps.length}
        </span>
        {showTimeEstimate && (
          <div className="flex items-center gap-1.5 text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {remainingTime > 0 ? `${remainingTime} min restantes` : 'Presque terminé!'}
            </span>
          </div>
        )}
      </div>

      {/* Visual Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-2.5 flex rounded-full bg-gray-100 shadow-inner">
          <div
            className="shadow-sm flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-red-500 via-red-600 to-red-500 transition-all duration-700 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs font-medium text-gray-400">0%</span>
          <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            {Math.round(progressPercentage)}%
          </span>
          <span className="text-xs font-medium text-gray-400">100%</span>
        </div>
      </div>
    </div>
  );
}
