'use client';

import { useForm } from '@/app/context/form-context';
import { useTranslations } from 'next-intl'; // Add this import
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, RefreshCw, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function EnergyStep() {
  const { state, dispatch, clearError } = useForm();
  const t = useTranslations('EnergyStep'); // Add this hook

  const handleBack = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const handleContinue = () => {
    if (state.energyClass) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  // Function to render appropriate error message with action buttons
  const renderErrorMessage = () => {
    if (!state.error) return null;

    // Different error types might need different actions
    switch (state.errorCode) {
      case 'DATABASE_ERROR':
        return (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('error.databaseErrorTitle')}</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{state.error}</p>
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearError();
                  }}
                  className="text-xs flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" /> {t('error.retryButton')}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        );

      default:
        return (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        );
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

      {renderErrorMessage()}

      <div className="space-y-6 sm:space-y-4">
        <div>
          <Label htmlFor="energyClass" className="text-base sm:text-sm font-medium">
            {t('energyClassLabel')}
          </Label>
          <Select
            value={state.energyClass}
            onValueChange={(value) =>
              dispatch({ type: 'UPDATE_FIELD', field: 'energyClass', value })
            }
          >
            <SelectTrigger
              id="energyClass"
              className="mt-2 sm:mt-1 h-12 sm:h-10 text-lg sm:text-base touch-manipulation"
            >
              <SelectValue placeholder={t('energyClassPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A" className="text-lg sm:text-base py-3 sm:py-2">
                A
              </SelectItem>
              <SelectItem value="B" className="text-lg sm:text-base py-3 sm:py-2">
                B
              </SelectItem>
              <SelectItem value="C" className="text-lg sm:text-base py-3 sm:py-2">
                C
              </SelectItem>
              <SelectItem value="D" className="text-lg sm:text-base py-3 sm:py-2">
                D
              </SelectItem>
              <SelectItem value="E" className="text-lg sm:text-base py-3 sm:py-2">
                E
              </SelectItem>
              <SelectItem value="F" className="text-lg sm:text-base py-3 sm:py-2">
                F
              </SelectItem>
              <SelectItem value="G" className="text-lg sm:text-base py-3 sm:py-2">
                G
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleBack}
          variant="outline"
          className="w-full sm:flex-1 h-12 sm:h-10 text-lg sm:text-base touch-manipulation"
        >
          {t('backButton')}
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!state.energyClass}
          className="w-full sm:flex-1 bg-[#e05c6d] hover:bg-[#d04c5d] h-12 sm:h-10 text-lg sm:text-base font-medium touch-manipulation"
        >
          {t('continueButton')}
        </Button>
      </div>
    </div>
  );
}
