'use client';

import { useForm } from '@/app/context/form-context';
import { useTranslations } from 'next-intl'; // Add this import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SaveContinue } from '@/app/components/ui/save-continue';
import { AlertCircle, Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AddressAutocomplete } from './address-autocomplete';
import type { AddressResult } from '@/app/data/types'; // Import type from new location

export function AddressStep() {
  const { state, dispatch, fetchDifficultyIndexAndCalculate, clearError } = useForm();
  const t = useTranslations('AddressStep'); // Add this hook

  const handleCalculate = async () => {
    if (state.postalCode && state.streetName && state.streetNumber) {
      await fetchDifficultyIndexAndCalculate();
    }
  };

  const handleBack = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const handleAddressSelect = (address: AddressResult) => {
    // Clear any previous errors
    clearError();

    dispatch({ type: 'UPDATE_FIELD', field: 'postalCode', value: address.postcode });
    dispatch({ type: 'UPDATE_FIELD', field: 'streetName', value: address.streetname_fr });
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'streetNumber',
      value: address.house_number,
    });

    // If we already have the difficulty index from the search, store it
    if (address.indice_synth_difficulte !== undefined) {
      dispatch({
        type: 'UPDATE_FIELD',
        field: 'difficultyIndex',
        value: address.indice_synth_difficulte,
      });
    }
  };

  // Check if Supabase environment variables are available
  const hasSupabaseCredentials =
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <p className="text-muted-foreground mt-2">{t('description')}</p>
      </div>

      {!hasSupabaseCredentials && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            {t('demoModeAlert')}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6 sm:space-y-4">
        <AddressAutocomplete
          onAddressSelect={handleAddressSelect}
          label={t('autocompleteLabel')}
          placeholder={t('autocompletePlaceholder')}
        />

        <div className="pt-4 border-t border-gray-200">
          <p className="text-base sm:text-sm text-muted-foreground mb-4 sm:mb-3">
            {t('manualEntryInstruction')}
          </p>

          <div className="space-y-4 sm:space-y-3">
            <div>
              <Label htmlFor="postalCode" className="text-base sm:text-sm font-medium">
                {t('postalCodeLabel')}
              </Label>
              <Input
                id="postalCode"
                value={state.postalCode}
                onChange={(e) => {
                  clearError();
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'postalCode',
                    value: e.target.value,
                  });
                }}
                placeholder={t('postalCodePlaceholder')}
                className="mt-2 sm:mt-1 h-12 sm:h-10 text-lg sm:text-base touch-manipulation"
                inputMode="numeric"
              />
            </div>

            <div>
              <Label htmlFor="streetName" className="text-base sm:text-sm font-medium">
                {t('streetNameLabel')}
              </Label>
              <Input
                id="streetName"
                value={state.streetName}
                onChange={(e) => {
                  clearError();
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'streetName',
                    value: e.target.value,
                  });
                }}
                placeholder={t('streetNamePlaceholder')}
                className="mt-2 sm:mt-1 h-12 sm:h-10 text-lg sm:text-base touch-manipulation"
              />
            </div>

            <div>
              <Label htmlFor="streetNumber" className="text-base sm:text-sm font-medium">
                {t('streetNumberLabel')}
              </Label>
              <Input
                id="streetNumber"
                value={state.streetNumber}
                onChange={(e) => {
                  clearError();
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'streetNumber',
                    value: e.target.value,
                  });
                }}
                placeholder={t('streetNumberPlaceholder')}
                className="mt-2 sm:mt-1 h-12 sm:h-10 text-lg sm:text-base touch-manipulation"
                inputMode="numeric"
              />
            </div>
          </div>
        </div>
      </div>

      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleBack}
          variant="outline"
          className="w-full sm:flex-1 h-12 sm:h-10 text-base sm:text-base touch-manipulation"
        >
          {t('backButton')}
        </Button>
        <SaveContinue
          onContinue={handleCalculate}
          continueText={
            state.isLoading ? `${t('calculatingButton')}...` : t('calculateButton')
          }
          disabled={
            !state.postalCode ||
            !state.streetName ||
            !state.streetNumber ||
            state.isLoading
          }
          isLastStep={true}
          autoSaveInterval={30}
        />
      </div>
    </div>
  );
}
