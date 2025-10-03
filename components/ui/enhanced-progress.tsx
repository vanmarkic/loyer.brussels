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
    <div className={cn('w-full space-y-4', className)}>
      {/* Progress Bar with Time Estimate */}
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-gray-900">
          Étape {currentStep} sur {steps.length}
        </span>
        {showTimeEstimate && (
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              {remainingTime > 0 ? `${remainingTime} min restantes` : 'Presque terminé!'}
            </span>
          </div>
        )}
      </div>

      {/* Visual Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-200">
          <div
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">0%</span>
          <span className="text-xs font-medium text-red-600">
            {Math.round(progressPercentage)}%
          </span>
          <span className="text-xs text-gray-500">100%</span>
        </div>
      </div>

      {/* Step Details (Mobile-Friendly) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              'flex items-center gap-2 p-2 rounded-md transition-colors',
              step.isActive
                ? 'bg-red-50 text-red-700 border border-red-200'
                : step.isCompleted
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-50 text-gray-500'
            )}
          >
            {step.isCompleted ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Circle
                className={cn(
                  'h-4 w-4',
                  step.isActive ? 'text-red-600' : 'text-gray-400'
                )}
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{step.name}</p>
              {showTimeEstimate && (
                <p className="text-xs opacity-75">~{step.estimatedMinutes} min</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
