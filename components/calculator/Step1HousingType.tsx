'use client';

import { useTranslations } from 'next-intl';
import { Home, Building2, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCalculator } from '@/contexts/CalculatorContext';
import type { HousingType } from '@/types/calculator';

export function Step1HousingType() {
  const t = useTranslations('calculator.step1');
  const { state, updateHousingType, nextStep, markStepComplete } = useCalculator();

  const handleSelect = (type: HousingType) => {
    updateHousingType(type);

    if (type === 'private') {
      markStepComplete(1);
      nextStep();
    } else {
      // For AIS and social housing, show info modal (simplified for now)
      alert(t(type === 'ais' ? 'aisHousingSubtitle' : 'socialHousingSubtitle'));
    }
  };

  const options = [
    {
      type: 'private' as HousingType,
      icon: Home,
      title: t('privateRental'),
      description: t('privateRentalDesc'),
      subtitle: t('privateRentalSubtitle'),
      available: true,
    },
    {
      type: 'ais' as HousingType,
      icon: Building2,
      title: t('aisHousing'),
      description: t('aisHousingDesc'),
      subtitle: t('aisHousingSubtitle'),
      available: false,
    },
    {
      type: 'social' as HousingType,
      icon: Building,
      title: t('socialHousing'),
      description: t('socialHousingDesc'),
      subtitle: t('socialHousingSubtitle'),
      available: false,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = state.housingType === option.type;

          return (
            <Card
              key={option.type}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? 'border-blue-500 border-2'
                  : option.available
                  ? 'hover:border-blue-300'
                  : 'opacity-75'
              }`}
              onClick={() => handleSelect(option.type)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      option.available ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 ${
                        option.available ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                    <p
                      className={`text-xs font-medium ${
                        option.available ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {option.subtitle}
                    </p>
                  </div>

                  {option.available && (
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(option.type);
                      }}
                    >
                      Select
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
        <p className="font-semibold mb-2">Brussels Region</p>
        <p>
          This calculator is only valid for private rental properties in the Brussels-Capital
          Region (postal codes 1000-1210).
        </p>
      </div>
    </div>
  );
}
