'use client';

import { useForm } from '@/app/context/form-context';
import { useTranslations } from 'next-intl';
import { EnhancedProgress } from '@/app/components/ui/enhanced-progress';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import step components
const PropertyTypeStep = dynamic(
  () => import('./property-type-step').then((mod) => mod.PropertyTypeStep),
  { ssr: false }
);
const PropertyDetailsStep = dynamic(
  () => import('./property-details-step').then((mod) => mod.PropertyDetailsStep),
  { ssr: false }
);
const FeaturesStep = dynamic(
  () => import('./features-step').then((mod) => mod.FeaturesStep),
  { ssr: false }
);
const EnergyStep = dynamic(() => import('./energy-step').then((mod) => mod.EnergyStep), {
  ssr: false,
});
const AddressStep = dynamic(
  () => import('./address-step').then((mod) => mod.AddressStep),
  { ssr: false }
);
const ResultStep = dynamic(() => import('./result-step').then((mod) => mod.ResultStep), {
  ssr: false,
});
const WuuneResultStep = dynamic(
  () => import('./wuune-result-step').then((mod) => mod.WuuneResultStep),
  {
    ssr: false,
  }
);

export function RentalCalculator() {
  const { state } = useForm();
  const t = useTranslations('RentalCalculator');
  const [startTime] = useState(Date.now());
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // Update elapsed time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 60000);
      setElapsedMinutes(elapsed);
    }, 60000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Define calculator steps with time estimates
  const calculatorSteps = [
    {
      id: 1,
      name: 'Type de propriété',
      estimatedMinutes: 1,
      isCompleted: state.step > 1,
      isActive: state.step === 1,
    },
    {
      id: 2,
      name: 'Détails du bien',
      estimatedMinutes: 2,
      isCompleted: state.step > 2,
      isActive: state.step === 2,
    },
    {
      id: 3,
      name: 'Caractéristiques',
      estimatedMinutes: 2,
      isCompleted: state.step > 3,
      isActive: state.step === 3,
    },
    {
      id: 4,
      name: 'Performance énergétique',
      estimatedMinutes: 1,
      isCompleted: state.step > 4,
      isActive: state.step === 4,
    },
    {
      id: 5,
      name: 'Adresse',
      estimatedMinutes: 2,
      isCompleted: state.step > 5,
      isActive: state.step === 5,
    },
    {
      id: 6,
      name: 'Résultats',
      estimatedMinutes: 0,
      isCompleted: state.step > 6,
      isActive: state.step === 6,
    },
  ];

  const totalSteps = 6;
  const totalTimeMinutes = calculatorSteps.reduce(
    (sum, step) => sum + step.estimatedMinutes,
    0
  );

  return (
    <div className="w-full max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-1000 min-h-[500px] sm:min-h-[400px]">
      {state.step < totalSteps && (
        <div className="mb-4 sm:mb-6">
          <EnhancedProgress
            steps={calculatorSteps}
            currentStep={state.step}
            totalTimeMinutes={totalTimeMinutes}
            elapsedTimeMinutes={elapsedMinutes}
            showTimeEstimate={true}
            className="mb-4"
          />
        </div>
      )}

      {/* Render dynamic components */}
      {state.step === 1 && <PropertyTypeStep />}
      {state.step === 2 && <PropertyDetailsStep />}
      {state.step === 3 && <FeaturesStep />}
      {state.step === 4 && <EnergyStep />}
      {state.step === 5 && <AddressStep />}
      {state.step === 6 && <WuuneResultStep />}
    </div>
  );
}
