'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCalculator } from '@/contexts/CalculatorContext';
import type { EnergyRating } from '@/types/calculator';

export function Step5EnergyRating() {
  const t = useTranslations('calculator.step5');
  const { state, updateEnergyRating, nextStep, previousStep, markStepComplete } = useCalculator();

  const handleSelect = (rating: EnergyRating) => {
    updateEnergyRating(rating);
    markStepComplete(5);
    nextStep();
  };

  const ratings = [
    { value: 'A' as EnergyRating, label: t('classA'), color: 'bg-green-600 text-white' },
    { value: 'B' as EnergyRating, label: t('classB'), color: 'bg-green-500 text-white' },
    { value: 'C' as EnergyRating, label: t('classC'), color: 'bg-lime-500 text-white' },
    { value: 'D' as EnergyRating, label: t('classD'), color: 'bg-yellow-500 text-white' },
    { value: 'E' as EnergyRating, label: t('classE'), color: 'bg-orange-500 text-white' },
    { value: 'F' as EnergyRating, label: t('classF'), color: 'bg-red-500 text-white' },
    { value: 'G' as EnergyRating, label: t('classG'), color: 'bg-red-700 text-white' },
    { value: 'unknown' as EnergyRating, label: t('unknown'), color: 'bg-gray-400 text-white' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ratings.map((rating) => {
          const isSelected = state.energyRating === rating.value;

          return (
            <Card
              key={rating.value}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'ring-4 ring-blue-500' : ''
              }`}
              onClick={() => handleSelect(rating.value)}
            >
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold ${rating.color}`}
                  >
                    {rating.value === 'unknown' ? '?' : rating.value}
                  </div>
                  <p className="text-sm font-medium">{rating.label}</p>
                  {isSelected && (
                    <div className="text-blue-600 text-sm font-medium">✓ Selected</div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <p className="font-semibold text-sm">{t('whatIsPeb')}</p>
        <p className="text-sm text-gray-700">
          The Energy Performance Certificate (PEB/EPB) indicates how energy-efficient your property
          is. Class A is the most efficient, Class G is the least.
        </p>
        <p className="text-sm text-gray-700">{t('whereToFind')}</p>
        <p className="text-sm text-gray-700">
          You can find this on your rental contract or the certificate document. If you don't know
          or don't have it, select "Unknown".
        </p>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={previousStep}>
          ← Previous
        </Button>
      </div>
    </div>
  );
}
