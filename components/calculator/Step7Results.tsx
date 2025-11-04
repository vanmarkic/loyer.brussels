'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCalculator } from '@/contexts/CalculatorContext';
import { calculateReferenceRent, compareRent } from '@/lib/rent-calculator';
import { formatCurrency } from '@/lib/utils';
import { Download, AlertTriangle, CheckCircle, Info, TrendingDown } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { RentCalculationResult, RentComparison } from '@/types/calculator';

export function Step7Results() {
  const t = useTranslations('calculator.results');
  const { state, updateCurrentRent, previousStep, resetCalculator } = useCalculator();

  const [userRent, setUserRent] = useState(state.currentRent?.toString() || '');
  const [calculation, setCalculation] = useState<RentCalculationResult | null>(null);
  const [comparison, setComparison] = useState<RentComparison | null>(null);

  useEffect(() => {
    const result = calculateReferenceRent(state);
    setCalculation(result);
  }, [state]);

  useEffect(() => {
    const rentNum = parseFloat(userRent);
    if (rentNum && calculation) {
      updateCurrentRent(rentNum);
      const comp = compareRent(rentNum, calculation);
      setComparison(comp);
    } else {
      setComparison(null);
    }
  }, [userRent, calculation, updateCurrentRent]);

  if (!calculation) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to calculate. Please complete all steps.</p>
        <Button onClick={previousStep} className="mt-4">
          ← Go Back
        </Button>
      </div>
    );
  }

  const getStatusInfo = (status: RentComparison['status']) => {
    switch (status) {
      case 'abusive':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: t('abusiveRent.title'),
          cta: t('abusiveRent.cta'),
          ctaVariant: 'destructive' as const,
        };
      case 'high':
        return {
          icon: Info,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: t('highRent.title'),
          cta: t('highRent.cta'),
          ctaVariant: 'default' as const,
        };
      case 'fair':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: t('fairRent.title'),
          cta: t('fairRent.cta'),
          ctaVariant: 'secondary' as const,
        };
      case 'below':
        return {
          icon: TrendingDown,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: t('belowRent.title'),
          cta: t('belowRent.cta'),
          ctaVariant: 'secondary' as const,
        };
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
      </div>

      {/* Reference Rent Display */}
      <Card>
        <CardHeader>
          <CardTitle>{t('referenceRent')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">{t('minimumRent')}</div>
              <div className="text-2xl font-bold">{formatCurrency(calculation.minimumRent)}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-500">
              <div className="text-sm text-blue-600 mb-2 font-semibold">{t('medianRent')}</div>
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(calculation.medianRent)}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">{t('maximumRent')}</div>
              <div className="text-2xl font-bold">{formatCurrency(calculation.maximumRent)}</div>
            </div>
          </div>

          {/* User Rent Input */}
          <div className="pt-4">
            <Label htmlFor="userRent" className="text-base font-semibold mb-2 block">
              {t('yourRent')}
            </Label>
            <p className="text-sm text-gray-600 mb-3">{t('yourRentHelp')}</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold">€</span>
              <Input
                id="userRent"
                type="number"
                placeholder="1000"
                value={userRent}
                onChange={(e) => setUserRent(e.target.value)}
                className="text-xl font-semibold"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Result */}
      {comparison && (() => {
        const statusInfo = getStatusInfo(comparison.status);
        const Icon = statusInfo.icon;
        const message = t(`${comparison.status}Rent.message`, {
          difference: formatCurrency(Math.abs(comparison.difference)),
          amount: formatCurrency(Math.abs(comparison.difference)),
          percent: Math.abs(comparison.percentageDifference).toFixed(1),
        });

        return (
          <Card className={`${statusInfo.bgColor} border-2 ${statusInfo.borderColor}`}>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <Icon className={`w-12 h-12 ${statusInfo.color} flex-shrink-0`} />
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-3 ${statusInfo.color}`}>
                    {statusInfo.title}
                  </h3>
                  <p className="text-base text-gray-700 mb-4">{message}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/contact" className="flex-1">
                  <Button size="lg" variant={statusInfo.ctaVariant} className="w-full">
                    {statusInfo.cta}
                  </Button>
                </Link>
                <Link href="/questionnaire" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full">
                    {t('takeQuestionnaire')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button size="lg" variant="outline" className="w-full">
          <Download className="w-5 h-5 mr-2" />
          {t('downloadPdf')}
        </Button>
        <Button size="lg" variant="outline" onClick={resetCalculator} className="w-full">
          {t('startNew')}
        </Button>
      </div>

      {/* Calculation Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Calculation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Property Type:</span>
              <span className="font-medium">{state.propertyType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Living Space:</span>
              <span className="font-medium">{state.propertyDetails?.livingSpace} m²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bedrooms:</span>
              <span className="font-medium">{state.propertyDetails?.bedrooms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Energy Rating:</span>
              <span className="font-medium">{state.energyRating || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Postal Code:</span>
              <span className="font-medium">{state.address?.postalCode}</span>
            </div>
            {calculation.difficultyIndex && (
              <div className="flex justify-between">
                <span className="text-gray-600">Location Factor:</span>
                <span className="font-medium">{calculation.difficultyIndex.toFixed(2)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={previousStep}>
          ← Previous
        </Button>
      </div>
    </div>
  );
}
