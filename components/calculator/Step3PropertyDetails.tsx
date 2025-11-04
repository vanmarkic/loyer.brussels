'use client';

import { useTranslations } from 'next-intl';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useCalculator } from '@/contexts/CalculatorContext';
import { useState, useEffect, useRef } from 'react';

export function Step3PropertyDetails() {
  const t = useTranslations('calculator.step3');
  const { state, updatePropertyDetails, nextStep, previousStep, markStepComplete } =
    useCalculator();

  const [livingSpace, setLivingSpace] = useState(state.propertyDetails?.livingSpace || 50);
  const [bedrooms, setBedrooms] = useState(state.propertyDetails?.bedrooms || 1);
  const [bathrooms, setBathrooms] = useState(state.propertyDetails?.bathrooms || 1);

  useEffect(() => {
    updatePropertyDetails({ livingSpace, bedrooms, bathrooms });
  }, [livingSpace, bedrooms, bathrooms, updatePropertyDetails]);

  const handleNext = () => {
    if (livingSpace >= 15 && bathrooms >= 1) {
      markStepComplete(3);
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
      </div>

      <Card>
        <CardContent className="p-8 space-y-8">
          {/* Living Space */}
          <div>
            <Label className="text-lg font-semibold mb-4 block">{t('livingSpace')}</Label>
            <p className="text-sm text-gray-600 mb-4">{t('livingSpaceHelp')}</p>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setLivingSpace(Math.max(15, livingSpace - 5))}
                disabled={livingSpace <= 15}
              >
                <Minus className="w-5 h-5" />
              </Button>
              <div className="flex-1 text-center">
                <div className="text-4xl font-bold">{livingSpace}</div>
                <div className="text-sm text-gray-500">{t('livingSpaceUnit')}</div>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setLivingSpace(Math.min(500, livingSpace + 5))}
                disabled={livingSpace >= 500}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            {livingSpace < 20 && (
              <p className="text-amber-600 text-sm mt-2">
                ⚠ Please verify - this is unusually small
              </p>
            )}
            {livingSpace > 300 && (
              <p className="text-amber-600 text-sm mt-2">
                ⚠ Please verify this measurement
              </p>
            )}
          </div>

          {/* Bedrooms */}
          <div>
            <Label className="text-lg font-semibold mb-4 block">{t('bedrooms')}</Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}
                disabled={bedrooms <= 0}
              >
                <Minus className="w-5 h-5" />
              </Button>
              <div className="flex-1 text-center">
                <div className="text-4xl font-bold">{bedrooms}</div>
                <div className="text-sm text-gray-500">bedroom{bedrooms !== 1 ? 's' : ''}</div>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setBedrooms(Math.min(10, bedrooms + 1))}
                disabled={bedrooms >= 10}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <Label className="text-lg font-semibold mb-4 block">{t('bathrooms')}</Label>
            <p className="text-sm text-gray-600 mb-4">{t('bathroomsHelp')}</p>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                disabled={bathrooms <= 1}
              >
                <Minus className="w-5 h-5" />
              </Button>
              <div className="flex-1 text-center">
                <div className="text-4xl font-bold">{bathrooms}</div>
                <div className="text-sm text-gray-500">bathroom{bathrooms !== 1 ? 's' : ''}</div>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setBathrooms(Math.min(5, bathrooms + 1))}
                disabled={bathrooms >= 5}
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
        <Button onClick={handleNext} disabled={livingSpace < 15}>
          Next →
        </Button>
      </div>
    </div>
  );
}
