'use client';

import { useForm } from '@/app/context/form-context';
import { useTranslations } from 'next-intl'; // Add this import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NavigationControls } from '@/app/components/ui/navigation-controls';
import { MinusCircle, PlusCircle } from 'lucide-react';

export function PropertyDetailsStep() {
  const { state, dispatch } = useForm();
  const t = useTranslations('PropertyDetailsStep'); // Add this hook

  const handleContinue = () => {
    if (state.size > 0 && state.propertyType) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  // Update the incrementBedrooms function to limit to 4
  const incrementBedrooms = () => {
    if (state.bedrooms < 4) {
      dispatch({ type: 'UPDATE_FIELD', field: 'bedrooms', value: state.bedrooms + 1 });
    }
  };

  const decrementBedrooms = () => {
    if (state.bedrooms > 0) {
      dispatch({ type: 'UPDATE_FIELD', field: 'bedrooms', value: state.bedrooms - 1 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <p className="text-muted-foreground mt-2">{t('description')}</p>
      </div>

      <div className="space-y-6 sm:space-y-4">
        <div>
          <Label htmlFor="size" className="text-base sm:text-sm font-medium">
            {t('sizeLabel')}
          </Label>
          <Input
            id="size"
            type="number"
            min="1"
            value={state.size || ''}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'size',
                value: Number.parseInt(e.target.value) || 0,
              })
            }
            className="mt-2 sm:mt-1 h-12 sm:h-10 text-lg sm:text-base touch-manipulation"
            inputMode="numeric"
            placeholder="Ex: 75"
          />
        </div>

        <div>
          <Label className="text-base sm:text-sm font-medium">{t('bedroomsLabel')}</Label>
          <div className="flex items-center justify-between mt-2 sm:mt-1 bg-gray-50 rounded-lg p-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={decrementBedrooms}
              disabled={state.bedrooms === 0}
              className="h-12 w-12 sm:h-10 sm:w-10 touch-manipulation"
            >
              <MinusCircle className="h-6 w-6 sm:h-4 sm:w-4" />
            </Button>
            <span className="text-2xl sm:text-xl font-medium px-4">
              {state.bedrooms === 4 ? t('bedroomsCountMax') : state.bedrooms}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={incrementBedrooms}
              disabled={state.bedrooms >= 4}
              className="h-12 w-12 sm:h-10 sm:w-10 touch-manipulation"
            >
              <PlusCircle className="h-6 w-6 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>

      <NavigationControls
        currentStep={2}
        totalSteps={6}
        onNext={handleContinue}
        onPrevious={handleBack}
        nextDisabled={state.size <= 0 || !state.propertyType}
        nextText={t('continueButton')}
        previousText={t('backButton')}
        autoSaveEnabled={true}
        autoSaveInterval={30}
      />
    </div>
  );
}
