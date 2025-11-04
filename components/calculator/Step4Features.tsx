'use client';

import { useTranslations } from 'next-intl';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { useCalculator } from '@/contexts/CalculatorContext';
import { useState, useEffect } from 'react';
import type { PropertyFeatures } from '@/types/calculator';

export function Step4Features() {
  const t = useTranslations('calculator.step4');
  const { state, updateFeatures, nextStep, previousStep, markStepComplete } = useCalculator();

  const [features, setFeatures] = useState<PropertyFeatures>(
    state.features || {
      centralHeating: false,
      thermalRegulation: false,
      doubleGlazing: false,
      secondBathroom: false,
      recreationalSpaces: false,
      storageSpaces: false,
      buildingBefore2000: false,
      garages: 0,
    }
  );

  useEffect(() => {
    updateFeatures(features);
  }, [features, updateFeatures]);

  const handleToggle = (key: keyof Omit<PropertyFeatures, 'garages'>) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
    markStepComplete(4);
    nextStep();
  };

  const featuresList = [
    { key: 'centralHeating' as const, label: t('centralHeating') },
    { key: 'thermalRegulation' as const, label: t('thermalRegulation') },
    { key: 'doubleGlazing' as const, label: t('doubleGlazing') },
    { key: 'secondBathroom' as const, label: t('secondBathroom') },
    { key: 'recreationalSpaces' as const, label: t('recreationalSpaces') },
    { key: 'storageSpaces' as const, label: t('storageSpaces') },
    { key: 'buildingBefore2000' as const, label: t('buildingAge') },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-6">
          {featuresList.map((feature) => (
            <div key={feature.key} className="flex items-center justify-between py-3 border-b">
              <Label htmlFor={feature.key} className="text-base cursor-pointer flex-1">
                {feature.label}
              </Label>
              <Switch
                id={feature.key}
                checked={features[feature.key]}
                onCheckedChange={() => handleToggle(feature.key)}
              />
            </div>
          ))}

          {/* Garages */}
          <div className="pt-4">
            <Label className="text-base mb-4 block">{t('garages')}</Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  setFeatures((prev) => ({ ...prev, garages: Math.max(0, prev.garages - 1) }))
                }
                disabled={features.garages <= 0}
              >
                <Minus className="w-5 h-5" />
              </Button>
              <div className="flex-1 text-center">
                <div className="text-3xl font-bold">{features.garages}</div>
                <div className="text-sm text-gray-500">
                  {t('garagesCount', { count: features.garages })}
                </div>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  setFeatures((prev) => ({ ...prev, garages: Math.min(10, prev.garages + 1) }))
                }
                disabled={features.garages >= 10}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={previousStep}>
          ← Previous
        </Button>
        <Button onClick={handleNext}>Next →</Button>
      </div>
    </div>
  );
}
