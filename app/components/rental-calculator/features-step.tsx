'use client';

import { useForm } from '@/app/context/form-context';
import { useTranslations } from 'next-intl'; // Add this import
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MinusCircle, PlusCircle } from 'lucide-react';

export function FeaturesStep() {
  const { state, dispatch } = useForm();
  const t = useTranslations('FeaturesStep'); // Add this hook

  const handleContinue = () => {
    // Check if all options have been selected
    const allSelected =
      state.hasCentralHeating !== null &&
      state.hasThermalRegulation !== null &&
      state.hasDoubleGlazing !== null &&
      state.hasSecondBathroom !== null &&
      state.hasRecreationalSpaces !== null &&
      state.hasStorageSpaces !== null &&
      state.constructedBefore2000 !== null; // Add validation for construction year

    if (allSelected) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  // Helper function to create radio options with mobile-optimized layout
  const createRadioOption = (
    field:
      | 'hasCentralHeating'
      | 'hasThermalRegulation'
      | 'hasDoubleGlazing'
      | 'hasSecondBathroom'
      | 'hasRecreationalSpaces'
      | 'hasStorageSpaces'
      | 'constructedBefore2000', // Add new field to type
    label: string
  ) => {
    const value = state[field];

    // Determine the value for the RadioGroup explicitly
    let radioGroupValue: string | undefined;

    // For boolean fields (hasCentralHeating, etc.)
    if (typeof value === 'boolean') {
      radioGroupValue = value ? 'true' : 'false';
    } else {
      radioGroupValue = undefined; // value is null
    }

    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-gray-300 transition-all">
        <div className="flex flex-col gap-4">
          <div className="font-semibold text-lg text-gray-800">{label}</div>
          <RadioGroup
            value={radioGroupValue} // Use the pre-calculated value
            onValueChange={(val) =>
              dispatch({
                type: 'UPDATE_FIELD',
                field,
                value: val === 'true' ? true : false,
              })
            }
            className="flex gap-4"
          >
            <>
              <div className="flex-1">
                <RadioGroupItem
                  value="true"
                  id={`${field}-true`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`${field}-true`}
                  className="flex items-center justify-center h-14 rounded-xl border-2 border-gray-200 bg-gray-50 cursor-pointer hover:bg-green-50 hover:border-green-300 peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-50 peer-data-[state=checked]:text-green-700 [&:has([data-state=checked])]:border-green-500 [&:has([data-state=checked])]:bg-green-50 [&:has([data-state=checked])]:text-green-700 font-semibold text-base transition-all"
                >
                  ✓ {t('yes')}
                </Label>
              </div>
              <div className="flex-1">
                <RadioGroupItem
                  value="false"
                  id={`${field}-false`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`${field}-false`}
                  className="flex items-center justify-center h-14 rounded-xl border-2 border-gray-200 bg-gray-50 cursor-pointer hover:bg-red-50 hover:border-red-300 peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-50 peer-data-[state=checked]:text-red-700 [&:has([data-state=checked])]:border-red-500 [&:has([data-state=checked])]:bg-red-50 [&:has([data-state=checked])]:text-red-700 font-semibold text-base transition-all"
                >
                  ✗ {t('no')}
                </Label>
              </div>
            </>
          </RadioGroup>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <p className="text-muted-foreground mt-2">{t('description')}</p>
      </div>

      <div className="space-y-6">
        {/* Features options */}
        <div className="grid gap-4">
          {createRadioOption('hasCentralHeating', t('options.centralHeating'))}
          {createRadioOption('hasThermalRegulation', t('options.thermalRegulation'))}
          {createRadioOption('hasDoubleGlazing', t('options.doubleGlazing'))}
          {createRadioOption('hasSecondBathroom', t('options.secondBathroom'))}
          {createRadioOption('hasRecreationalSpaces', t('options.recreationalSpaces'))}
          {createRadioOption('hasStorageSpaces', t('options.storageSpaces'))}
          {createRadioOption('constructedBefore2000', t('options.constructedBefore2000'))}
        </div>

        {/* Garage Input Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <Label
            htmlFor="numberOfGarages"
            className="block font-semibold text-lg text-gray-800 mb-4"
          >
            {t('garageLabel')}
          </Label>
          <div className="flex items-center justify-center gap-6">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'numberOfGarages',
                  value: Math.max(0, state.numberOfGarages - 1),
                })
              }
              disabled={state.numberOfGarages === 0}
              className="h-14 w-14 border-2 hover:border-gray-400 touch-manipulation flex-shrink-0"
              aria-label="Diminuer le nombre de garages"
            >
              <MinusCircle className="h-6 w-6" />
            </Button>
            <div className="bg-gray-50 rounded-xl border-2 border-gray-200 px-6 sm:px-8 py-4 min-w-[100px] text-center">
              <span className="text-3xl font-bold text-gray-800">
                {state.numberOfGarages}
              </span>
              <div className="text-sm text-gray-500 mt-1">garage(s)</div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'numberOfGarages',
                  value: state.numberOfGarages + 1,
                })
              }
              className="h-14 w-14 border-2 hover:border-gray-400 touch-manipulation flex-shrink-0"
              aria-label="Augmenter le nombre de garages"
            >
              <PlusCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-6">
        <Button
          onClick={handleContinue}
          disabled={
            state.hasCentralHeating === null ||
            state.hasThermalRegulation === null ||
            state.hasDoubleGlazing === null ||
            state.hasSecondBathroom === null ||
            state.hasRecreationalSpaces === null ||
            state.hasStorageSpaces === null ||
            state.constructedBefore2000 === null // Add check for construction year
          }
          className="w-full bg-[#e05c6d] hover:bg-[#d04c5d] h-16 text-lg font-semibold rounded-xl"
        >
          {t('continueButton')}
        </Button>
        <Button
          onClick={handleBack}
          variant="outline"
          className="w-full h-14 text-base border-2 hover:border-gray-400 rounded-xl"
        >
          {t('backButton')}
        </Button>
      </div>
    </div>
  );
}
