'use client';

import { useTranslations } from 'next-intl';
import { useCalculator } from '@/contexts/CalculatorContext';
import { Progress } from '@/components/ui/progress';
import { Step1HousingType } from './Step1HousingType';
import { Step2PropertyType } from './Step2PropertyType';
import { Step3PropertyDetails } from './Step3PropertyDetails';
import { Step4Features } from './Step4Features';
import { Step5EnergyRating } from './Step5EnergyRating';
import { Step6Address } from './Step6Address';
import { Step7Results } from './Step7Results';

const TOTAL_STEPS = 7;

export function Calculator() {
  const t = useTranslations('calculator');
  const { state } = useCalculator();

  const progressPercentage = (state.currentStep / TOTAL_STEPS) * 100;

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <Step1HousingType />;
      case 2:
        return <Step2PropertyType />;
      case 3:
        return <Step3PropertyDetails />;
      case 4:
        return <Step4Features />;
      case 5:
        return <Step5EnergyRating />;
      case 6:
        return <Step6Address />;
      case 7:
        return <Step7Results />;
      default:
        return <Step1HousingType />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-600">
            {t('progress', { current: state.currentStep, total: TOTAL_STEPS })}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <Progress value={progressPercentage} className="h-3" />

        {/* Step indicators */}
        <div className="grid grid-cols-7 gap-2 mt-4">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => {
            const isComplete = state.completedSteps.includes(step);
            const isCurrent = state.currentStep === step;

            return (
              <div
                key={step}
                className={`h-2 rounded-full transition-colors ${
                  isComplete
                    ? 'bg-green-500'
                    : isCurrent
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Current Step */}
      <div className="min-h-[500px]">{renderStep()}</div>
    </div>
  );
}
