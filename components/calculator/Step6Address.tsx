'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useCalculator } from '@/contexts/CalculatorContext';
import { useState, useEffect } from 'react';

export function Step6Address() {
  const t = useTranslations('calculator.step6');
  const { state, updateAddress, nextStep, previousStep, markStepComplete } = useCalculator();

  const [postalCode, setPostalCode] = useState(state.address?.postalCode || '');
  const [streetName, setStreetName] = useState(state.address?.streetName || '');
  const [buildingNumber, setBuildingNumber] = useState(state.address?.buildingNumber || '');
  const [error, setError] = useState('');

  useEffect(() => {
    updateAddress({ postalCode, streetName, buildingNumber });
  }, [postalCode, streetName, buildingNumber, updateAddress]);

  const validatePostalCode = (code: string): boolean => {
    const num = parseInt(code);
    return num >= 1000 && num <= 1210;
  };

  const handleNext = () => {
    if (!postalCode) {
      setError('Postal code is required');
      return;
    }

    if (!validatePostalCode(postalCode)) {
      setError(t('invalidPostalCode'));
      return;
    }

    setError('');
    markStepComplete(6);
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
      </div>

      <Card>
        <CardContent className="p-8 space-y-6">
          {/* Postal Code */}
          <div>
            <Label htmlFor="postalCode" className="text-base font-semibold mb-2 block">
              {t('postalCode')} <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600 mb-3">{t('postalCodeHelp')}</p>
            <Input
              id="postalCode"
              type="text"
              placeholder={t('postalCodePlaceholder')}
              value={postalCode}
              onChange={(e) => {
                setPostalCode(e.target.value);
                setError('');
              }}
              maxLength={4}
              className="text-lg"
            />
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>

          {/* Street Name */}
          <div>
            <Label htmlFor="streetName" className="text-base font-semibold mb-2 block">
              {t('streetName')}
            </Label>
            <p className="text-sm text-gray-600 mb-3">{t('streetNameHelp')}</p>
            <Input
              id="streetName"
              type="text"
              placeholder={t('streetNamePlaceholder')}
              value={streetName}
              onChange={(e) => setStreetName(e.target.value)}
              className="text-lg"
            />
          </div>

          {/* Building Number */}
          <div>
            <Label htmlFor="buildingNumber" className="text-base font-semibold mb-2 block">
              {t('buildingNumber')}
            </Label>
            <p className="text-sm text-gray-600 mb-3">{t('buildingNumberHelp')}</p>
            <Input
              id="buildingNumber"
              type="text"
              placeholder={t('buildingNumberPlaceholder')}
              value={buildingNumber}
              onChange={(e) => setBuildingNumber(e.target.value)}
              className="text-lg"
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm font-semibold mb-2">Why do we need your address?</p>
        <p className="text-sm text-gray-700">
          The postal code is required because different Brussels neighborhoods have different base
          rental costs (called the "difficulty index"). This significantly affects the calculation.
          Street name and building number are optional but help create a complete documentation if
          needed.
        </p>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={previousStep}>
          ← Previous
        </Button>
        <Button onClick={handleNext}>Calculate Rent →</Button>
      </div>
    </div>
  );
}
