'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCalculator } from '@/contexts/CalculatorContext';
import type { PropertyType } from '@/types/calculator';

export function Step2PropertyType() {
  const t = useTranslations('calculator.step2');
  const { state, updatePropertyType, nextStep, previousStep, markStepComplete } = useCalculator();

  const handleSelect = (type: PropertyType) => {
    updatePropertyType(type);
    markStepComplete(2);
    nextStep();
  };

  const properties = [
    { type: 'studio' as PropertyType, label: t('studio'), desc: t('studioDesc') },
    { type: 'apartment-1' as PropertyType, label: t('apartment1'), desc: '1 bedroom' },
    { type: 'apartment-2' as PropertyType, label: t('apartment2'), desc: '2 bedrooms' },
    { type: 'apartment-3' as PropertyType, label: t('apartment3'), desc: '3 bedrooms' },
    { type: 'apartment-4+' as PropertyType, label: t('apartment4'), desc: '4+ bedrooms' },
    { type: 'house' as PropertyType, label: t('house'), desc: t('houseDesc') },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => {
          const isSelected = state.propertyType === property.type;

          return (
            <Card
              key={property.type}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'border-blue-500 border-2 bg-blue-50' : 'hover:border-blue-300'
              }`}
              onClick={() => handleSelect(property.type)}
            >
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <h3 className="font-semibold text-lg">{property.label}</h3>
                  <p className="text-sm text-gray-600">{property.desc}</p>
                  {isSelected && (
                    <div className="text-blue-600 text-sm font-medium">✓ Selected</div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={previousStep}>
          ← Previous
        </Button>
      </div>
    </div>
  );
}
